import BigNumber from "bignumber.js";

export const displayAmount = (amount: BigNumber, decimalPlaces = 3) => {
  if (amount === undefined) return "0";

  if (amount.isZero()) return "0.00";

  if (amount.isInteger()) {
    return amount.toString();
  }

  const formattedAmount = amount.toFixed(decimalPlaces);

  return new BigNumber(formattedAmount).isGreaterThan(0) ? formattedAmount : "< 0.001";
};
