export default function parsePrice(price, discount) {
  let initialPrice = price
    ? parseFloat(price % 1 !== 0 ? price.toFixed(2) : price)
    : 0;
  initialPrice =
    initialPrice % 1 === 0 ? initialPrice : initialPrice.toFixed(2);
  let finalPrice = price;
  if (discount !== 0) {
    finalPrice =
      ((initialPrice * (100 - discount)) / 100) % 1 !== 0
        ? ((initialPrice * (100 - discount)) / 100).toFixed(2)
        : (initialPrice * (100 - discount)) / 100;
  }
  finalPrice = parseFloat(finalPrice);
  finalPrice = finalPrice % 1 === 0 ? finalPrice : finalPrice.toFixed(2);
  return { initialPrice, finalPrice };
}
