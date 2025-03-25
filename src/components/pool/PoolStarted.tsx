import Pool from "../../contract-hooks/Pool";
import { Cycle, Position } from "../../types";
import WaitTab from "../low-level/WaitTab";
import PoolBidTab from "./PoolBidTab";
import PoolDepositTab from "./PoolDepositTab";

const PoolStarted = ({
  pool,
  state,
  currentCycle,
  position,
  updatePosition,
  isCycleDepositAndBidOpen,
  poolChainId,
}: {
  pool: Pool;
  state: String;
  currentCycle: Cycle | undefined;
  position: Position | undefined;
  updatePosition: (value: number) => void;
  isCycleDepositAndBidOpen: boolean;
  poolChainId: number;
}) => {
  return position ? (
    state === "LIVE" && currentCycle ? (
      <div>
        <PoolDepositTab
          pool={pool}
          currentCycle={currentCycle}
          position={position}
          updatePosition={updatePosition}
          isCycleDepositAndBidOpen={isCycleDepositAndBidOpen}
          poolChainId={poolChainId}
        />
        <PoolBidTab
          pool={pool}
          currentCycle={currentCycle}
          position={position}
          updatePosition={updatePosition}
          isCycleDepositAndBidOpen={isCycleDepositAndBidOpen}
          poolChainId={poolChainId}
        />
      </div>
    ) : (
      <WaitTab title="Pool is Ended" />
    )
  ) : (
    <WaitTab title="Not Participated" />
  );
};

export default PoolStarted;
