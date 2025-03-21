import { Base } from "./Base";
import { abi as POOL_ABI } from "../abi/SpiralPool.sol/SpiralPool.json";
import { formatUnits, parseUnits } from "../utils/formatUnits.ts";
import { readYbt } from "../config/contractsData";
import ERC20 from "./ERC20";
import { NATIVE_ADDRESS } from "../utils/NATIVE.ts";
import { Position, SpiralYield, Token, Ybt } from "../types/types";
import BigNumber from "bignumber.js";

export default class Pool extends Base {
  public chainId!: number;
  public baseToken!: Token | ERC20;
  public ybt!: ERC20;
  public syToken!: ERC20;
  public amountCycle!: BigNumber;
  public amountCollateralInBase!: BigNumber;
  public cycleDuration!: number;
  public cycleDepositAndBidDuration!: number;
  public totalCycles!: number;
  public totalPositions!: number;
  public startTime!: number;
  public endTime!: number;

  constructor(address: string) {
    super(address, POOL_ABI);
  }

  static async createInstance(address: string, chainId: number, ybtSymbol: string): Promise<Pool> {
    const instance = new Pool(address);
    instance.chainId = chainId;

    if (ybtSymbol) {
      const ybt: Ybt = await readYbt(chainId, ybtSymbol);
      const { baseToken, syToken } = ybt;

      if (baseToken.address !== NATIVE_ADDRESS) {
        instance.baseToken = new ERC20(
          baseToken.address,
          baseToken.name,
          baseToken.symbol,
          baseToken.decimals
        );
      } else {
        instance.baseToken = {
          address: baseToken.address,
          name: baseToken.name,
          symbol: baseToken.symbol,
          decimals: baseToken.decimals,
        };
      }
      instance.ybt = new ERC20(ybt.address, ybt.name, ybt.symbol, ybt.decimals);
      instance.syToken = new ERC20(syToken.address, syToken.name, syToken.symbol, syToken.decimals);
    }

    const [
      amountCycle,
      amountCollateralInBase,
      cycleDuration,
      cycleDepositAndBidDuration,
      totalCycles,
      startTime,
    ] = await Promise.all([
      instance.read("getamountCycle", [], chainId),
      instance.read("getAmountCollateralInBase", [], chainId),
      instance.read("getCycleDuration", [], chainId),
      instance.read("getCycleDepositAndBidDuration", [], chainId),
      instance.read("getTotalCycles", [], chainId),
      instance.read("getStartTime", [], chainId),
    ]);

    instance.address = instance.address;
    instance.amountCycle = formatUnits(amountCycle as bigint);
    instance.amountCollateralInBase = formatUnits(amountCollateralInBase as bigint);
    instance.cycleDuration = parseInt((cycleDuration as bigint).toString());
    instance.cycleDepositAndBidDuration = parseInt((cycleDepositAndBidDuration as bigint).toString());
    instance.totalCycles = parseInt((totalCycles as bigint).toString());
    instance.totalPositions = parseInt((totalCycles as bigint).toString());
    instance.startTime = parseInt((startTime as bigint).toString());
    instance.endTime = instance.startTime + instance.cycleDuration * instance.totalCycles;

    return instance;
  }

  async depositYbtCollateral(receiver: string) {
    return this.write("depositYbtCollateral", [receiver]);
  }

  async depositCycle(positionId: number) {
    if ((this.baseToken as Token).address !== NATIVE_ADDRESS) {
      return this.write("depositCycle", [positionId]);
    } else {
      return this.write(
        "depositCycle",
        [positionId],
        parseUnits(this.amountCycle.toString(), this.baseToken.decimals)
      );
    }
  }

  async bidCycle(positionId: number, bidAmount: string) {
    return this.write("bidCycle", [positionId, parseUnits(bidAmount, this.baseToken.decimals)]);
  }

  async claimCollateralYield(positionId: number) {
    return this.write("claimCollateralYield", [positionId]);
  }

  async claimSpiralYield(positionId: number) {
    return this.write("claimSpiralYield", [positionId]);
  }

  async redeemCollateralIfDiscarded(positionId: number) {
    return this.write("redeemCollateralIfDiscarded", [positionId]);
  }

  async getPositionsFilled() {
    return parseInt((await this.read("getPositionsFilled", [], this.chainId) as bigint).toString());
  }

  async getCyclesFinalized() {
    return parseInt((await this.read("getCyclesFinalized", [], this.chainId) as bigint).toString());
  }

  async getAmountCollateral() {
    const amountCollateral = await this.read("getAmountCollateral", [], this.chainId);
    return formatUnits((amountCollateral as bigint), this.ybt.decimals);
  }

  async getAllPositions(): Promise<Position[]> {
    const positionsData = (await this.read("getAllPositions", [], this.chainId) as Position[]);
    const positions = await Promise.all(
      positionsData.map((_: any, index: number) => this.getPosition(index))
    );
    return positions;
  }

  async getPoolState(): Promise<string> {
    const poolState = await this.read("getPoolState", [], this.chainId);
    return ["WAITING", "LIVE", "ENDED", "DISCARDED"][Number(poolState)];
  }

  async getCycleState(cycle: number): Promise<string> {
    const cycleState = await this.read("getCycleState", [cycle], this.chainId);
    return ["NotStarted", "DepositAndBid", "Unfinalized", "Finalized"][Number(cycleState)];
  }

  async getPosition(positionId: number) {
    type RawPosition = {
      amountCollateral: bigint;
      winningCycle: bigint;
      cyclesDeposited: boolean[];
      spiralYield: SpiralYield
    };
  
    const [position, owner] = await Promise.all([
      this.read("getPosition", [positionId], this.chainId) as Promise<RawPosition>,
      this.read("ownerOf", [positionId], this.chainId) as Promise<string>,
    ]);
  
    const typedPosition: Position = {
      ...position, // Preserve any additional properties
      id: positionId,
      owner: owner,
      amountCollateral: formatUnits(position.amountCollateral, this.ybt.decimals),
      winningCycle: parseInt(position.winningCycle.toString()),
      cyclesDeposited: position.cyclesDeposited,
      spiralYield: position.spiralYield
    };
  
    return typedPosition;
  }

  async getCollateralYield(position: Position) {
    const amountCollateralYield = await this.read(
      "getCollateralYield",
      [position.id],
      this.chainId
    );
    return formatUnits((amountCollateralYield as bigint), this.ybt.decimals);
  }

  async getSpiralYield(position: Position) {
    const spiralYield: { amountBase: bigint, amountSY: bigint } = await this.read(
      "getSpiralYield",
      [position.id],
      this.chainId
    );

    return {
      amountBase: formatUnits(spiralYield.amountBase, this.ybt.decimals),
      amountYbt: formatUnits(spiralYield.amountSY, this.ybt.decimals),
    };
  }

  async getLowestBid() {
    const lowestBid: { positionId: bigint, amount: bigint } = await this.read(
      "getLowestBid",
      [this.calcCurrentCycle()],
      this.chainId
    );
  
    return {
      positionId: parseInt(lowestBid.positionId.toString()),
      amount: formatUnits(lowestBid.amount, (this.baseToken as Token).decimals),
    };
  }

  currentTimestamp(){
    return Math.floor(Date.now() / 1000);
  }

  calcPoolState(positionsFilled: number, cyclesFinalized: number) {
    const timestamp = this.currentTimestamp();

    if (timestamp < this.startTime) return "WAITING";
    else if (positionsFilled < this.totalPositions) return "DISCARDED";
    else if (cyclesFinalized === this.totalCycles) return "ENDED";
    else return "LIVE";
  }

  calcCurrentCycle() {
    const timestamp = this.currentTimestamp();
    let currentCycle = Math.floor((timestamp - this.startTime) / this.cycleDuration) + 1;

    return Math.min(currentCycle, this.totalCycles);
  }

  calcCycleStartAndEndTime(currentCycle: number) {
    const currentCycleStartTime = this.startTime + (currentCycle - 1) * this.cycleDuration;
    const currentCycleEndTime = currentCycleStartTime + this.cycleDuration;

    return { startTime: currentCycleStartTime, endTime: currentCycleEndTime };
  }

  calcDepositAndBidEndTime(currentCycle: number) {
    const currentCycleStartTime = this.startTime + (currentCycle - 1) * this.cycleDuration;
    return currentCycleStartTime + this.cycleDepositAndBidDuration;
  }
}