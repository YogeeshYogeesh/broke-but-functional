export function formatMoney(n) {
  const value = Math.round(Number(n) || 0);
  const sign = value < 0 ? '-' : '';
  return sign + '₹' + Math.abs(value).toLocaleString('en-IN');
}
