const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const SERVER_DOMAIN = process.env.VITE_PATH;
const CLIENT_DOMAIN = process.env.VITE_CLIENT_PATH;
const { Product, Discount } = require("../models/Products.js");
const User = require("../models/Users.js");
const { Orders } = require("../models/Orders.js");
const Users = require("../models/Users.js");

const endpointSecret =
  "whsec_532019e6b33b8f33f4ca608a9c36356acb076993c972768d6fc5e4b7499206d8";

const handleCheckout = async (req, res) => {
  const { products } = req.body;
  const userId = req.session.user.userId;
  let customerId;
  try {
    if (!products || products.length < 1) {
      return res.status(400).json({ message: "Request contains no products" });
    }
    if (!userId)
      return res.status(400).json({ message: "No user could be found" });
    const user = await User.findById(userId);
    const customer = await stripe.customers.retrieve(user.customerId);
    if (
      !customer ||
      customer.deleted ||
      !customer.shipping ||
      !customer.shipping.address ||
      !customer.shipping.address.line1
    ) {
      const newCustomer = await stripe.customers.create({
        email: user.email || "",
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        shipping: {
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          address: {
            line1: user.address?.street || "",
            city: user.address?.city || "",
            state: user.address?.state || "",
            postal_code: user.address?.zipCode || "",
            country: user.address?.country || "",
          },
        },
      });

      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { customerId: newCustomer.id },
        { new: true }
      );

      customerId = updatedUser?.customerId || newCustomer.id;
    } else {
      await stripe.customers.update(user.customerId, {
        shipping: {
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          address: {
            line1: user.address?.street || "",
            city: user.address?.city || "",
            state: user.address?.state || "",
            postal_code: user.address?.zipCode || "",
            country: user.address?.country || "",
          },
        },
      });

      customerId = user.customerId;
    }

    const lineItems = await Promise.all(
      products.map(async (product) => {
        const foundProduct = await Product.findOne({ sku: product.sku });
        const foundDiscount = await Discount.findOne({
          code: product.promoCode?.toUpperCase(),
        });

        if (!foundProduct) return null;
        if (foundProduct.discount > 1) {
          foundProduct.discount = foundProduct.discount / 100;
        }
        if (
          foundDiscount &&
          foundDiscount.value > 1 &&
          foundDiscount.validProducts &&
          (foundDiscount.validProducts.length === 0 ||
            foundDiscount.validProducts.includes(
              (sku) => sku.toLowerCase() === foundProduct.sku.toLowerCase()
            ))
        ) {
          foundDiscount.value = foundDiscount.value / 100;
        }

        const totalPrice = Math.round(
          foundProduct.price *
            (1 - foundProduct.discount) *
            (1 - (foundDiscount?.value || 0)) *
            100
        );

        return {
          price_data: {
            currency: "usd",
            unit_amount: totalPrice,
            product_data: {
              name: foundProduct.productName,
              description:
                foundProduct.description || "No description available",
            },
          },
          quantity: product.quantity,
          productData: {
            sku: foundProduct.sku,
            productName: foundProduct.productName,
            color: JSON.stringify(product.color),
            size: product.size,
          },
        };
      })
    );
    // {
    //   price_data: { currency: 'usd', unit_amount: 9000 },
    //   quantity: 1,
    //   productData: {
    //     sku: 'SKU-1',
    //     productName: 'Fancy Polo',
    //     color: '{"colorName":"white","colorCode":"#ffffff","idMod":"whi"}',
    //     size: 'L'
    //   }
    // }
    const filteredLineItems = lineItems.filter((item) => item !== null);
    const metaDataLineItems = filteredLineItems.map((item) => {
      const lineItem = structuredClone(item);
      return {
        sku: `${lineItem.productData.sku}-${
          JSON.parse(lineItem.productData.color).idMod
        }-${lineItem.productData.size}`,
        q: lineItem.quantity,
        p: lineItem.price_data.unit_amount,
      };
    });
    const stripeLineItems = filteredLineItems.map((item) => {
      const lineItem = structuredClone(item);
      delete lineItem.productData;
      return lineItem;
    });

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: stripeLineItems,
      mode: "payment",
      success_url: `${process.env.VITE_CLIENT_PATH}/success`,
      cancel_url: `${CLIENT_DOMAIN}/cart`,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
      customer_update: {
        shipping: "auto",
      },
      automatic_tax: {
        enabled: true,
      },
      payment_intent_data: {
        metadata: {
          session: JSON.stringify(req.session.user),
          product: JSON.stringify(metaDataLineItems),
          shipping: JSON.stringify({
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            address: {
              line1: user.address?.street || "",
              city: user.address?.city || "",
              state: user.address?.state || "",
              postal_code: user.address?.zipCode || "",
              country: user.address?.country || "",
            },
          }),
        },
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error });
  }
};

const webhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  //   // Verify the event with the Stripe signature to prevent tampering
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Error message: " + err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      (async () => {
        try {
          const paymentIntent = event.data.object;
          const sessionData = JSON.parse(paymentIntent.metadata.session);
          const productInfo = JSON.parse(paymentIntent.metadata.product);
          const shippingInfo = JSON.parse(paymentIntent.metadata.shipping);

          const productInfoMap = await Promise.all(
            productInfo.map(async (product) => {
              const [pre, post, colorMod, size] = product.sku.split("-");
              const sku = `${pre}-${post}`;
              const foundProduct = await Product.findOne({ sku: sku });

              const color =
                foundProduct.colors.find((color) => {
                  return color.idMod === colorMod;
                }) || null;

              return {
                paymentInfo: {
                  currency: "usd",
                  unit_amount: product.p,
                },
                sku: sku,
                quantity: product.q,
                size: size,
                color: color,
                name: foundProduct.productName,
              };
            })
          );

          const newOrder = await Orders.create({
            productInfo: productInfoMap,
            shippingInfo: {
              name: shippingInfo.name,
              address: shippingInfo.address,
            },
            userInfo: {
              userId: sessionData.userId,
              email: sessionData.email,
            },
          });

          await Users.updateOne(
            { _id: sessionData.userId },
            { $push: { orders: newOrder._id } }
          );

          res.redirect(
            301,
            `${process.env.VITE_CLIENT_PATH}/success?q=${newOrder._id}`
          );
        } catch (error) {
          console.error("Error processing webhook:", error);
          res.status(500).send("Internal Server Error");
        }
      })();
      break;
    }

    case "payment_intent.payment_failed":
      console.log("PaymentIntent has failed", event.data.object);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};

const syncProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from MongoDB

    for (const product of products) {
      if (product.stripeProductId) continue;

      const stripeProduct = await stripe.products.create({
        name: product.productName,
        description: product.description,
        tax_code: product.taxcode,
        shippable: true,
        active: true,
      });

      const price = await stripe.prices.create({
        unit_amount: product.price * 100, // Convert to cents
        currency: "usd",
        product: stripeProduct.id,
      });

      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: product.price * 100, // Stripe expects price in cents
        currency: "usd",
      });

      product.stripeProductId = stripeProduct.id;
      product.stripePrice = stripePrice.id;

      await product.save();
    }

    return res
      .status(200)
      .json({ message: "Products synced with Stripe successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrders = async (req, res) => {
  const { orderIdList } = req.body;
  const userId = req.session.user.userId;
  try {
    if (!orderIdList || orderIdList.length < 1) {
      return res.status(400).json({ message: "Faulty id list" });
    }
    const ordersList = await Promise.all(
      orderIdList.map(async (orderId) => {
        return await Orders.findOne({ _id: orderId });
      })
    );

    const filteredList = ordersList.filter((item) => item !== null);
    if (filteredList) {
      if (filteredList[0].userInfo.userId === userId) {
        return res
          .status(200)
          .json({ orders: filteredList, orderExists: true });
      } else return res.status(400).json({ message: "Unauthorized" });
    } else {
      return res.status(204).json({ orders: null, orderExists: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error });
  }
};

module.exports = {
  handleCheckout,
  syncProducts,
  getOrders,
  webhook,
};
