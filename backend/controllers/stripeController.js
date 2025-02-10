const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const SERVER_DOMAIN = process.env.VITE_PATH;
const CLIENT_DOMAIN = process.env.VITE_CLIENT_PATH;
const Products = require("../models/Products");

const handleCheckout = async (req, res) => {
  const { products } = req.body;
  console.log(products);

  try {
    if (!products || products.length < 1)
      return res.status(400).json({ message: "Request contains no products" });
    const lineItems = products.map((product) => {
      if (!product || !product.price)
        return {
          price: product.priceId,
          quantity: product.quantity,
        };
    });

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}/stripe/success`, //FINISH PAYMENT CONFIRMATION / WEBHOOK
      cancel_url: `${CLIENT_DOMAIN}/cart`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error });
  }
};

const checkoutSuccess = async (req, res) => {
  try {
    console.log(req.session.user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error });
  }
};

const syncProducts = async (req, res) => {
  try {
    const products = await Products.find(); // Fetch all products from MongoDB

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

      console.log(product);
      await product.save();
    }

    res.json({ message: "Products synced with Stripe successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { handleCheckout, checkoutSuccess, syncProducts };
