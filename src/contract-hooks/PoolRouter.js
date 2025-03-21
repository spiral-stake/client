import { Base } from "./Base";
import { abi as POOL_ROUTER_ABI } from "../abi/SpiralPoolRouter.sol/SpiralPoolRouter.json";
import { parseUnits } from "../utils/formatUnits";

export default class PoolRouter extends Base {
  constructor(poolRouterAddress, pool) {
    super(poolRouterAddress, POOL_ROUTER_ABI);

    this.pool = pool;
  }

  static async createInstance(pool) {
    const { spiralPoolRouter } = await import(`../addresses/${pool.chainId}.json`);
    return new PoolRouter(spiralPoolRouter, pool);
  }

  ///////////////////////////
  // WRITE FUNCTIONS
  /////////////////////////

  async depositYbtCollateral(receiver, amountYbtCollateral) {
    return this.write("depositYbtCollateral", [
      receiver,
      this.pool.address,
      this.pool.syToken.address,
      this.pool.ybt.address,
      parseUnits(amountYbtCollateral, this.pool.ybt.decimals),
    ]);
  }
}
