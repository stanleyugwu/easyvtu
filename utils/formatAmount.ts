/**
 * Formats money amount number value, adding comma where neccessary.
 * @example
 * let amt = formatAmount(2000)
 * amt === `2,000`
 */
const formatAmount = (amount: number | string) =>
  amount?.toString
    ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : amount;

export default formatAmount;
