import BigNumber from "bignumber.js";
import { Token } from "../types";

export const displayTokenAmount = (amount: BigNumber, token?: Token, decimalPlaces = 3) => {
  let formattedAmount;

  if (amount.isZero()) formattedAmount = "0.00";
  else if (amount.isInteger()) {
    formattedAmount = amount.toString();
  } else {
    formattedAmount = amount.toFixed(decimalPlaces);
  }

  return `${new BigNumber(formattedAmount).isGreaterThan(0) ? formattedAmount : "< 0.001"} ${
    (token && token.symbol) || ""
  }`;
};
