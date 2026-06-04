export function formatPriceNumber(price: number): string {
  return price.toLocaleString("fa-IR");
}

export function formatPriceToman(price: number): string {
  return `تومان ${formatPriceNumber(price)}`;
}
