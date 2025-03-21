import { Base } from "./Base";
import { abi as POOL_ROUTER_ABI } from "../abi/SpiralPoolRouter.sol/SpiralPoolRouter.json";
import { parseUnits } from "../utils/formatUnits.ts";
import Pool from "./Pool.ts";
import BigNumber from "bignumber.js";

export default class PoolRouter extends Base {
  pool: Pool;

  constructor(poolRouterAddress: string, pool: Pool) {
    super(poolRouterAddress, POOL_ROUTER_ABI);

    this.pool = pool;
  }

  static async createInstance(pool: Pool) {
    const { spiralPoolRouter } = await import(`../addresses/${pool.chainId}.json`);
    return new PoolRouter(spiralPoolRouter, pool);
  }

  ///////////////////////////
  // WRITE FUNCTIONS
  /////////////////////////

  async depositYbtCollateral(receiver:string, amountYbtCollateral: BigNumber) {
    return this.write("depositYbtCollateral", [
      receiver,
      this.pool.address,
      this.pool.syToken.address,
      this.pool.ybt.address,
      parseUnits(amountYbtCollateral.toString(), this.pool.ybt.decimals),
    ]);
  }
}
