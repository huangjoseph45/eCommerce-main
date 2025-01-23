export default function parsePrice(price, discount) {
  const initialPrice = price % 1 !== 0 ? price.toFixed(2) : price;
  let finalPrice = price;
  if (discount !== 0) {
    finalPrice =
      ((initialPrice * (100 - discount)) / 100) % 1 !== 0
        ? ((initialPrice * (100 - discount)) / 100).toFixed(2)
        : (initialPrice * (100 - discount)) / 100;
  }
  return { initialPrice, finalPrice };
}
