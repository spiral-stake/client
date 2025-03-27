import Pool from "../../contract-hooks/Pool";
import { Cycle, Position } from "../../types";
import PositionNft from "../low-level/PositionNft";
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
  state: string;
  currentCycle: Cycle | undefined;
  position: Position | undefined;
  updatePosition: (value: number) => void;
  isCycleDepositAndBidOpen: boolean;
  poolChainId: number;
}) => {
  return position ? (
    <div className="grid grid-cols-2 w-[764px] gap-16">
      {state === "LIVE" && currentCycle ? (
        <div className="">
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
            isCycleDepositAndBidOpen={isCycleDepositAndBidOpen}
            poolChainId={poolChainId}
          />
        </div>
      ) : (
        <WaitTab title="Pool is Ended" msg="Pool has just ended" />
      )}
      <div className="w-full flex justify-center">
        <PositionNft winningCycle={1} />
      </div>
    </div>
  ) : (
    <div>
      <WaitTab title="Not Participated" msg="You never participated" />
    </div>
  );
};

export default PoolStarted;
