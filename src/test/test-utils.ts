export function getPriceValueFromText(text: string) {
  return Number.parseFloat(text.replace(/\s/g, ''));
}
