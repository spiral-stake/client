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

const PoolPage = () => {
  const [pool, setPool] = useState<Pool>();
  const [state, setState] = useState<string>();
  const [cyclesFinalized, setCyclesFinalized] = useState(0);
  const [currentCycle, setCurrentCycle] = useState<Cycle>();
  const [isCycleDepositAndBidOpen, setIsCycleDepositAndBidOpen] = useState(false);

  const [allPositions, setAllPositions] = useState<Position[]>([]);
  const [position, setPosition] = useState<Position>();

  const [loading, setLoading] = useState(false);

  const { address, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { address: poolAddress } = useParams();
  const ybtSymbol = useSearchParams()[0].get("ybt") as string;
  const poolChainId = parseInt(useSearchParams()[0].get("poolChainId") as string);

  useEffect(() => {
    if (!poolAddress) return;
    const getPool = async () => {
      try {
        const _pool = await Pool.createInstance(poolAddress, poolChainId, ybtSymbol);
        setPool(_pool);
      } catch (error) {
        console.error("Failed to create pool instance:", error);
      }
    };

    getPool();
  }, []);

  useEffect(() => {
    getPoolState();
  }, [pool]);

  const getPoolState = async () => {
    if (!pool) return;

    try {
      const [_allPositions, _cyclesFinalized] = await Promise.all([
        pool.getAllPositions(),
        pool.getCyclesFinalized(),
      ]);

      setState(pool.calcPoolState(_allPositions.length, _cyclesFinalized));
      setCyclesFinalized(_cyclesFinalized);
      setAllPositions(_allPositions);
    } catch (error) {
      console.error("Failed to get pool state:", error);
    }
  };

  useEffect(() => {
    // Only for the 1st cycle
    if (state === "LIVE" && !currentCycle) {
      updateCurrentCycle();
    }

    if (state === "DISCARDED") {
      toastSuccess("Pool Discarded, Please redeem your YBT Collateral");
    }

    if (state === "ENDED") {
      toastSuccess("Pool Ended, Claim Yield (if any)");
    }
  }, [state, currentCycle]);

  useEffect(() => {
    if (address && state && allPositions) {
      const userPositions = allPositions.filter((position) => position.owner === address);

      if (userPositions.length) {
        setPosition(userPositions[0]);
      } else {
        setPosition(undefined);
      }
    }
  }, [address, state, allPositions]);

  const getAllPositions = async () => {
    if (!pool) return;

    try {
      const _allPositions = await pool.getAllPositions();
      setAllPositions(_allPositions);
    } catch (error) {
      console.error("Failed to get All Positions:", error);
    }
  };

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

  const closeCycleDepositWindow = async () => {
    setIsCycleDepositAndBidOpen(false);
    toastSuccess(`Deposit and Bid Window closed for cycle ${currentCycle}`);

    await wait(10);
    getPoolState();
  };

  const updateCurrentCycle = () => {
    if (!pool) return;

    let newCycleCount = !currentCycle ? pool.calcCurrentCycle() : currentCycle.count + 1;

    const { startTime, endTime } = pool.calcCycleStartAndEndTime(newCycleCount);
    const depositAndBidEndTime = pool.calcDepositAndBidEndTime(newCycleCount);
    setCurrentCycle({ count: newCycleCount, startTime, endTime, depositAndBidEndTime });

    setIsCycleDepositAndBidOpen(getCurrentTimestampInSeconds() < depositAndBidEndTime);
    toastSuccess(`Cycle ${newCycleCount} has started, Please make cycle Deposits and Bid`);
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
            getAllPositions={getAllPositions}
            setLoading={setLoading}
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
          <div className="w-full flex justify-center">
            <PositionNft winningCycle={1} />
          </div>
        </div>
      );

    if (state === "ENDED") {
      return; // Need to add logic
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
      <div className="absolute left-1/2 -translate-x-1/2 w-[1783px] h-[1783px] circle-gradient rounded-full border-2 border-gray-950 flex justify-center" />
      <div className="relative w-full flex justify-center items-center min-h-[650px]">
        {renderPoolTab()}
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default PoolPage;
