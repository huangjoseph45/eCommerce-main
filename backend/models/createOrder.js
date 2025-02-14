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

  const shippingInfo = customer.shipping;

  const newOrder = await Orders.create({
    productInfo: productInfoMap,
    shippingInfo: {
      name: shippingInfo.name,
      address: shippingInfo.address,
    },
    userInfo: {
      userId: user._id,
      email: user.email,
    },
    verified: false,
    default: "processing",
  });

  if (!newOrder) {
    return null;
  }
  return newOrder;
};

module.exports = { createOrder };
