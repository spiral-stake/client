import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useAccount, useSwitchChain } from "wagmi";

import Pool from "../contract-hooks/Pool.js";
import PoolRedeem from "../components/pool-tabs/PoolRedeemTab.js";
import { getCurrentTimestampInSeconds, wait } from "../utils/time.js";
import { toastSuccess } from "../utils/toastWrapper.js";
import { Cycle, Position } from "../types/index.js";
import PoolInfoTab from "../components/PoolInfo.js";
import PoolJoinTab from "../components/pool-tabs/PoolJoinTab.js";
import TokenData from "../components/low-level/TokenData.js";
import PoolState from "../components/PoolState.js";
import Loader from "../components/low-level/Loader.js";
import PoolDepositTab from "../components/pool-tabs/PoolDepositTab.js";
import PoolBidTab from "../components/pool-tabs/PoolBidTab.js";
import WaitTab from "../components/low-level/WaitTab.js";
import PositionNft from "../components/low-level/PositionNft.js";
import ErrorIconBig from "../assets/icons/errorIconBig.svg";
import PositionCollaretal from "../components/low-level/PositionCollateral.js";
import Tag from "../components/low-level/Tag.js";
import TagSquare from "../components/low-level/TagSquare.js";
import PoolGlobe from "../components/low-level/PoolGlobe.js";

const PoolPage = ({
  showOverlay,
}: {
  showOverlay: (overlayComponent: React.ReactNode | undefined) => void;
}) => {
  const [pool, setPool] = useState<Pool>();
  const [state, setState] = useState<string>();
  const [cyclesFinalized, setCyclesFinalized] = useState(0);
  const [currentCycle, setCurrentCycle] = useState<Cycle>();
  const [isCycleDepositAndBidOpen, setIsCycleDepositAndBidOpen] =
    useState(false);

  const [allPositions, setAllPositions] = useState<Position[]>([]);
  const [position, setPosition] = useState<Position>();

  const [loading, setLoading] = useState(false);

  const { address, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { address: poolAddress } = useParams();
  const ybtSymbol = useSearchParams()[0].get("ybt") as string;
  const poolChainId = parseInt(
    useSearchParams()[0].get("poolChainId") as string
  );

 

  useEffect(() => {
    if (!poolAddress) return;
    showOverlay(undefined);

    const getPoolAndPositions = async () => {
      try {
        const _pool = await Pool.createInstance(
          poolAddress,
          poolChainId,
          ybtSymbol
        );

        setPool(_pool);
        setState(_pool.calcPoolState(_pool.allPositions.length));
        setAllPositions(_pool.allPositions);
      } catch (error) {
        console.error("Failed to create pool instance:", error);
      }
    };

    getPoolAndPositions();
  }, []);

  useEffect(() => {
    if (state === "LIVE" && !currentCycle) {
      updateCurrentCycle(); // Only for the 1st cycle
    }

    if (state === "DISCARDED") {
      toastSuccess("Pool Discarded, Please redeem your YBT Collateral");
    }

    if (state === "ENDED") {
      toastSuccess("Pool Ended, Claim Yield (if any)");
    }
  }, [state, currentCycle]);

  useEffect(() => {
    if (!address || (!state && !allPositions)) return;

    const userPositions = allPositions.filter(
      (position) => position.owner === address
    );

    if (!userPositions.length) {
      setPosition(undefined);
    }
    setPosition(userPositions[0]);
  }, [address, state, allPositions]);

  // To be pinged by startTime countdown
  const syncPoolInitialState = async () => {
    if (!pool) return;

    try {
      const _allPositions = await pool.getAllPositions();
      const _poolState = pool.calcPoolState(_allPositions.length);

      setState(_poolState);
      setAllPositions(_allPositions);
    } catch (error) {
      console.error("Failed to get current pool state:", error);
    }
  };

  // To be called by joinPool, to add new positions
  const updateAllPositions = async () => {
    if (!pool) return;

    try {
      const _allPositions = await pool.getAllPositions();
      setAllPositions(_allPositions);
    } catch (error) {
      console.error("Failed to get All Positions:", error);
    }
  };

  // To update positions state for various action items
  const updatePosition = async (positionId: number) => {
    if (!allPositions || !pool) return;

    try {
      const updatedPosition = await pool.getPosition(positionId);
      setPosition(updatedPosition);

      const updatedPositions = [...allPositions];
      updatedPositions[positionId] = updatedPosition;
      setAllPositions(updatedPositions);
    } catch (error) {
      console.error("Failed to update Position", error);
    }
  };

  // Will be called by coutdown timers and once during page state initialization (IF LIVE)
  const updateCurrentCycle = () => {
    if (!pool) return;

    let newCycleCount = !currentCycle
      ? pool.calcCurrentCycle()
      : currentCycle.count + 1;

    const { startTime, endTime } = pool.calcCycleStartAndEndTime(newCycleCount);
    const depositAndBidEndTime = pool.calcDepositAndBidEndTime(newCycleCount);
    setCurrentCycle({
      count: newCycleCount,
      startTime,
      endTime,
      depositAndBidEndTime,
    });

    setIsCycleDepositAndBidOpen(
      getCurrentTimestampInSeconds() < depositAndBidEndTime
    );
    toastSuccess(
      `Cycle ${newCycleCount} has started, Please make cycle Deposits and Bid`
    );
  };

  // Will be called by countdown timers to close depositAndBidWindow and to also check if cycle is finalized
  const closeCycleDepositWindow = async () => {
    setIsCycleDepositAndBidOpen(false);
    toastSuccess(`Deposit and Bid Window closed for cycle ${currentCycle}`);

    // Also wait & to check if cycle is finalized
    await wait(10);
    if (!pool) return;
    const _cyclesFinalized = await pool.getCyclesFinalized();
    setCyclesFinalized(_cyclesFinalized);
  };

  const renderPoolTab = () => {
    if (!pool || !state) return;

    if (state === "WAITING") {
      return (
        <div>
          <PoolJoinTab
            pool={pool}
            allPositions={allPositions}
            position={position}
            updateAllPositions={updateAllPositions}
            showOverlay={showOverlay}
          />
        </div>
      );
    }

    if (state === "DISCARDED") {
      return (
        <div>
          <PoolRedeem
            pool={pool}
            position={position}
            updatePosition={updatePosition}
            positionsFilled={allPositions.length}
          />
        </div>
      );
    }

    if (!position) {
      return (
        <div>
          <WaitTab
            icon={ErrorIconBig}
            title="Not a Participant"
            msg="You don't hold a position in this Pool"
          />
        </div>
      );
    }

    if (state === "LIVE" && currentCycle)
      return (
        <div className="grid grid-cols-2 w-[764px] gap-16">
          <div className="flex flex-col gap-12">
            <PoolDepositTab
              pool={pool}
              currentCycle={currentCycle}
              position={position}
              updatePosition={updatePosition}
              isCycleDepositAndBidOpen={isCycleDepositAndBidOpen}
              poolChainId={poolChainId}
              showOverlay={showOverlay}
            />
            <PoolBidTab
              pool={pool}
              currentCycle={currentCycle}
              position={position}
              isCycleDepositAndBidOpen={isCycleDepositAndBidOpen}
              poolChainId={poolChainId}
              showOverlay={showOverlay}
            />
          </div>
          <div className="w-full flex flex-col items-center justify-center gap-4">
            <PositionNft winningCycle={1} />
            <PositionCollaretal />
          </div>
        </div>
      );

    if (state === "ENDED") {
      return (
        <div>
          <WaitTab
            title="Pool is Ended"
            msg="Pool has ended, Please Claim remaining Yield, if any"
          />
        </div>
      );
    }
  };

  return pool ? (
    <div className="">
      <div className="flex items-center gap-4 mt-2">
        <TokenData token={pool.ybt} />
        <PoolState
          state={state}
          currentCycle={currentCycle}
          positionsFilled={allPositions.length}
          totalCycles={pool.totalCycles}
          totalPositions={pool.totalPositions}
        />
      </div>
      <PoolInfoTab pool={pool} />
      
      <div
        className={`absolute left-1/2 -translate-x-1/2 w-[1783px] h-[1783px] bg-[linear-gradient(180deg,#01152a_1.93%,#03050d_28.18%)] rounded-full transition-transform duration-1000 flex justify-around items-start`}
      ></div>

      <div className="relative w-full flex justify-center items-center min-h-[650px]">
        <div className="min-w-[312px] overflow-hidden">{renderPoolTab()}</div>
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default PoolPage;
