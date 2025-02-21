const { Orders } = require("../models/Orders.js");

const createOrder = async (lineItems, customer, user) => {
  const productInfoMap = await Promise.all(
    lineItems.map(async (product) => {
      const { sku, size, color, productName } = product.productData;
      const { currency, unit_amount } = product.price_data;
      const quantity = product.quantity;
      if (
        !sku ||
        !color ||
        !size ||
        !productName ||
        !currency ||
        !unit_amount ||
        !quantity
      )
        return null;
      return {
        paymentInfo: {
          currency: currency,
          unit_amount: unit_amount,
        },
        sku: sku,
        quantity: quantity,
        size: size,
        color: JSON.parse(color),
        name: productName,
      };
    })
  );

  if (productInfoMap.includes(null)) return null;

  const shippingInfo = customer?.shipping || null;

  try {
    const newOrder = await Orders.create({
      productInfo: productInfoMap,
      shippingInfo: {
        name: shippingInfo?.name || null,
        address: shippingInfo?.address || null,
      },
      userInfo: {
        userId: user._id,
        email: user.email,
      },
      verified: false,
      status: "processing", // Changed from `default` if that was the intent.
    });
    return newOrder;
  } catch (error) {
    console.error("Error creating order:", error);
    return null;
  }
};

module.exports = { createOrder };
