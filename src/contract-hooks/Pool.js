import { Base } from "./Base";
import { abi as POOL_ABI } from "../abi/SpiralPool.sol/SpiralPool.json";
import { formatUnits, parseUnits } from "../utils/formatUnits";
import { readYbt } from "../config/contractsData";
import ERC20 from "./ERC20";
import { NATIVE_ADDRESS } from "../utils/NATIVE";

export default class Pool extends Base {
  constructor(address) {
    super(address, POOL_ABI);
  }

  static async createInstance(address, chainId, ybtSymbol) {
    const instance = new Pool(address);
    instance.chainId = chainId;

    if (ybtSymbol) {
      const ybt = await readYbt(chainId, ybtSymbol);
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
      // instance.getPositionsFilled(),
      // instance.getCyclesFinalized(),
    ]);

    instance.address = instance.address;
    instance.amountCycle = formatUnits(amountCycle);
    instance.amountCollateralInBase = formatUnits(amountCollateralInBase);
    instance.cycleDuration = parseInt(cycleDuration);
    instance.cycleDepositAndBidDuration = parseInt(cycleDepositAndBidDuration);
    instance.totalCycles = parseInt(totalCycles);
    instance.totalPositions = parseInt(totalCycles);
    instance.startTime = parseInt(startTime);
    instance.endTime = instance.startTime + instance.cycleDuration * instance.totalCycles; // Just for display

    return instance;
  }

  async depositYbtCollateral(receiver) {
    return this.write("depositYbtCollateral", [receiver]);
  }

  async depositCycle(positionId, value) {
    if (this.baseToken.address !== NATIVE_ADDRESS) {
      return this.write("depositCycle", [positionId]);
    } else {
      return this.write(
        "depositCycle",
        [positionId],
        parseUnits(this.amountCycle, this.baseToken.decimals)
      );
    }
  }

  async bidCycle(positionId, bidAmount) {
    return this.write("bidCycle", [positionId, parseUnits(bidAmount, this.baseToken.decimals)]);
  }

  async claimCollateralYield(positionId) {
    return this.write("claimCollateralYield", [positionId]);
  }

  async claimSpiralYield(positionId) {
    return this.write("claimSpiralYield", [positionId]);
  }

  async redeemCollateralIfDiscarded(positionId) {
    return this.write("redeemCollateralIfDiscarded", [positionId]);
  }

  async getPositionsFilled() {
    return parseInt(await this.read("getPositionsFilled", [], this.chainId));
  }

  async getCyclesFinalized() {
    return parseInt(await this.read("getCyclesFinalized", [], this.chainId));
  }

  async getAmountCollateral() {
    const amountCollateral = await this.read("getAmountCollateral", [], this.chainId);
    return formatUnits(amountCollateral, this.ybt.decimals);
  }

  async getAllPositions() {
    const positionsData = await this.read("getAllPositions", [], this.chainId);
    const positions = await Promise.all(positionsData.map((_, index) => this.getPosition(index)));
    return positions;
  }

  async getPoolState() {
    const poolState = await this.read("getPoolState", [], this.chainId);
    return ["WAITING", "LIVE", "ENDED", "DISCARDED"][poolState];
  }

  async getCycleState(cycle) {
    const cycleState = await this.read("getCycleState", [cycle], this.chainId);
    return ["NotStarted", "DepositAndBid", "Unfinalized", "Finalized"][cycleState];
  }

  async getPosition(positionId) {
    const [position, owner] = await Promise.all([
      this.read("getPosition", [positionId], this.chainId),
      this.read("ownerOf", [positionId], this.chainId),
    ]);

    position.id = positionId;
    position.owner = owner;
    position.amountCollateral = formatUnits(position.amountCollateral, this.ybt.decimals);
    position.winningCycle = parseInt(position.winningCycle);

    return position;
  }

  async getCollateralYield(position) {
    const amountCollateralYield = await this.read(
      "getCollateralYield",
      [position.id],
      this.chainId
    );
    return formatUnits(amountCollateralYield, this.ybt.decimals);
  }

  async getSpiralYield(position) {
    const { amountBase, amountSY: amountYbt } = await this.read(
      "getSpiralYield",
      [position.id],
      this.chainId
    );

    return {
      amountBase: formatUnits(amountBase, this.ybt.decimals),
      amountYbt: formatUnits(amountYbt, this.ybt.decimals),
    };
  }

  async getLowestBid() {
    const { positionId, amount } = await this.read(
      "getLowestBid",
      [this.calcCurrentCycle()],
      this.chainId
    );

    return {
      positionId: parseInt(positionId),
      amount: formatUnits(amount, this.baseToken.decimals),
    };
  }

  currentTimestamp() {
    return Math.floor(Date.now() / 1000);
  }

  calcPoolState(positionsFilled, cyclesFinalized) {
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

  calcCycleStartAndEndTime(currentCycle) {
    const currentCycleStartTime = this.startTime + (currentCycle - 1) * this.cycleDuration;
    const currentCycleEndTime = currentCycleStartTime + this.cycleDuration;

    return { startTime: currentCycleStartTime, endTime: currentCycleEndTime };
  }

  calcDepositAndBidEndTime(currentCycle) {
    const currentCycleStartTime = this.startTime + (currentCycle - 1) * this.cycleDuration;
    return currentCycleStartTime + this.cycleDepositAndBidDuration;
  }
}
