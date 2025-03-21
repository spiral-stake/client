import BigNumber from "bignumber.js";
import { formatUnits as formatUnitsWagmi, parseUnits as parseUnitsWagmi } from "viem";

export const formatUnits = (value, decimals = 18) => {
  return new BigNumber(formatUnitsWagmi(value, decimals));
};

export const parseUnits = (value, decimals = 18) => {
  value = typeof value !== "string" ? value.toString() : value;
  return parseUnitsWagmi(value, decimals);
};
