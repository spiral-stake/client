import ERC20 from "./ERC20"; // Importing the ERC20 class
import { abi as ABI_SY } from "../abi/SYBase.sol/SYBase.json";

export default class SY extends ERC20 {
  constructor(address) {
    super(address, ...ABI_SY);
  }

  static async createInstance(address) {
    const instance = new SY(address);

    const [{ name, symbol, decimals }, ybt] = await Promise.all([
      ERC20.createInstance(address),
      instance.read("yieldToken"),
    ]);

    instance.name = name;
    instance.symbol = symbol;
    instance.decimals = decimals;
    instance.ybt = ybt;

    return instance;
  }

  ///////////////////////////
  // SPECIFIC SY FUNCTIONS
  /////////////////////////

  async getUnderlying() {
    const assetInfo = await this.read("assetInfo");
    return assetInfo[1];
  }
}
