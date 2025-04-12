const stripe = require("stripe")(process.env.STRIPE_SECRET);
const SERVER_DOMAIN = process.env.VITE_PATH;
const CLIENT_DOMAIN = process.env.VITE_CLIENT_PATH;
const { Product, Discount } = require("../models/Products.js");
const User = require("../models/Users.js");
const { Orders } = require("../models/Orders.js");
const Users = require("../models/Users.js");
const { createOrder } = require("../models/createOrder.js");

const endpointSecret =
  "whsec_532019e6b33b8f33f4ca608a9c36356acb076993c972768d6fc5e4b7499206d8";

const handleCheckout = async (req, res) => {
  const { products, seoValue } = req.body;
  const userId = req.session.user.userId;
  let customerId;
  let customer;

  try {
    if (!products || products.length < 1) {
      return res.status(400).json({ message: "Request contains no products" });
    }
    if (!userId)
      return res.status(400).json({ message: "No user could be found" });
    const user = await User.findById(userId);
    if (user.customerId) {
      try {
        customer = await stripe.customers.retrieve(user.customerId);
      } catch (error) {
        console.log("Customer does not exist");
      }
    }

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

    //gather data
    const lineItems = await Promise.all(
      products.map(async (product) => {
        const foundProduct = await Product.findOneAndUpdate(
          { sku: { $regex: `^${sku}$`, $options: "i" } },
          { $inc: { clicks: seoValue } },
          { new: true }
        );
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
    //filter null values
    const filteredLineItems = lineItems.filter((item) => item !== null);
    //for stripe session
    const stripeLineItems = filteredLineItems.map((item) => {
      const lineItem = structuredClone(item);
      delete lineItem.productData;
      return lineItem;
    });

    const newOrder = await createOrder(lineItems, customer, user);
    if (!newOrder) {
      return res.status(400).json({ message: "Missing required info" });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: stripeLineItems,
      phone_number_collection: { enabled: true },
      mode: "payment",
      success_url: `${process.env.VITE_CLIENT_PATH}/order?q=${newOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
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
          orderId: JSON.stringify(newOrder._id),
          userInfo: JSON.stringify({
            userId: user._id,
            email: user.email,
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
  res.status(200).send("OK");
  setImmediate(async () => {
    switch (event.type) {
      case "payment_intent.succeeded": {
        try {
          const paymentIntent = event.data.object;
          const orderId = paymentIntent.metadata.orderId.replace(/"/g, "");
          const userInfo = JSON.parse(paymentIntent.metadata.userInfo);

          const user = await User.findById(userInfo.userId);
          if (!user) {
            break;
          }

          if (paymentIntent.amount !== paymentIntent.amount_received) {
            break;
          }

          const verifiedOrder = await Orders.updateOne(
            { _id: orderId },
            { verified: true, status: "processing" }
          );

          const updatedUser = await Users.updateOne(
            { _id: userInfo.userId },
            {
              $push: { orders: orderId },
              $set: { cart: [] },
            }
          );
          break;
        } catch (error) {
          console.error(error);
          break;
        }
      }

      case "payment_intent.payment_failed":
        console.log("PaymentIntent has failed", event.data.object);
        break;

      case "checkout.session.completed": {
        try {
          const session = event.data.object;
          const paymentIntentId = session.payment_intent;
          const shippingDetails = session.shipping_details;
          const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId
          );
          if (!paymentIntent) {
            break;
          }
          const orderId = paymentIntent.metadata.orderId.replace(/"/g, "");
          const phoneNumber = session.customer_details?.phone || "N/A";

          const updateOrder = await Orders.updateOne(
            { _id: orderId },
            {
              $set: {
                "userInfo.phoneNumber": phoneNumber,
                "shippingInfo.name": shippingDetails.name,
                "shippingInfo.address": {
                  line1: shippingDetails.address.line1,
                  city: shippingDetails.address.city,
                  state: shippingDetails.address.state,
                  country: shippingDetails.address.country,
                },
              },
            }
          );
          break;
        } catch (error) {
          console.log(error);
          break;
        }
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  });
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
  if (!req.session || !req.session.user) {
    return res.status(400).json({ message: "Could not verify identity" });
  }
  const userId = req.session.user.userId;
  if (!orderIdList[0]) {
    return res.status(400).json({ message: "Missing orders list" });
  }
  try {
    if (!orderIdList || orderIdList.length < 1) {
      return res.status(400).json({ message: "Faulty id list" });
    }
    const ordersList = await Promise.all(
      orderIdList.map(async (orderId) => {
        return await Orders.findOne({ _id: orderId });
      })
    );

    const filteredList = ordersList
      .filter((item) => item !== null)
      .sort((a, b) => b.createdAt - a.createdAt);

    if (filteredList) {
      if (filteredList[0] && filteredList[0].userInfo.userId === userId) {
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
