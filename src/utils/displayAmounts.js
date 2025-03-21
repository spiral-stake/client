import BigNumber from "bignumber.js";

export const displayAmount = (amount, decimals = 3) => {
  if (amount === undefined) return;

  if (amount.isZero()) return "0.00";

  if (amount.isInteger()) {
    return amount.toString();
  }

  const formattedAmount = amount.toFixed(decimals);

  return new BigNumber(formattedAmount).isGreaterThan(0) ? formattedAmount : "< 0.001";
};
