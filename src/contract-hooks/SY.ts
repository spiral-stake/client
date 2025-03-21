import { abi as ABI_SY } from "../abi/SYBase.sol/SYBase.json";
import { Ybt } from "../types/types";
import { formatUnits } from "../utils/formatUnits";
import { Base } from "./Base";

export default class SY extends Base {
  constructor(address: string) {
    super(address, [...ABI_SY]);
  }

  ///////////////////////////
  // SPECIFIC SY FUNCTIONS
  /////////////////////////

  async getYbtExchangeRate(ybt: Ybt) {
    const syExchangeRate = await this.read("exchangeRate");
    return formatUnits((syExchangeRate as bigint), ybt.decimals);
  }
}
