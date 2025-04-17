import { Base } from "./Base";
import { abi as POOL_FACTORY_ABI } from "../abi/SpiralPoolFactory.sol/SpiralPoolFactory.json";
import { parseUnits } from "../utils/formatUnits.ts";
import { Token } from "../types/index.ts";

export default class PoolFactory extends Base {
  constructor(poolFactoryAddress: string) {
    super(poolFactoryAddress, POOL_FACTORY_ABI);
  }

  static async createInstance(chainId: number) {
    const { spiralPoolFactory } = await import(`../addresses/${chainId}.json`);
    return new PoolFactory(spiralPoolFactory);
  }

  ///////////////////////////
  // WRITE FUNCTIONS
  /////////////////////////

  async createSpiralPool(
    syToken: Token,
    baseToken: Token,
    amountCycle: string,
    totalCycles: string,
    cycleDuration: string,
    cycleDepositAndBidDuration: string,
    startInterval: string
  ) {
    const receipt = await this.write("createSpiralPool", [
      syToken.address,
      parseUnits(amountCycle, baseToken.decimals),
      cycleDuration,
      cycleDepositAndBidDuration,
      totalCycles,
      startInterval,
    ]);

    const paddedAddress = receipt.logs[0].topics[1] as string;
    const newSpiralPoolAddress = `0x${paddedAddress.slice(26)}`;
    return newSpiralPoolAddress;
  }

  ///////////////////////////
  // READ FUNCTIONS
  /////////////////////////

  async getSpiralPoolsForSYToken(syTokenAddress: string) {
    const pools = (await this.read("getSpiralPoolsForSYToken", [syTokenAddress])) as string[];
    return pools.reverse();
  }
}
