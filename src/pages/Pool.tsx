import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useAccount, useSwitchChain } from "wagmi";

import Pool from "../contract-hooks/Pool.js";
import PoolRedeem from "../components/pool/PoolRedeemTab.js";
import { getCurrentTimestampInSeconds, wait } from "../utils/time.js";
import { toastSuccess } from "../utils/toastWrapper.js";
import { Cycle, Position } from "../types/index.js";
import PoolInfoTab from "../components/pool/PoolInfoTab.js";
import PoolJoinTab from "../components/pool/PoolJoinTab.js";
import TokenData from "../components/low-level/TokenData.js";
import PoolState from "../components/pool/PoolState.js";
import PoolBidTab from "../components/pool/PoolBidTab.js";
import PoolDepositTab from "../components/pool/PoolDepositTab.js";
import WaitTab from "../components/low-level/WaitTab.js";
import Loader from "../components/low-level/Loader.js";
import PoolStarted from "../components/pool/PoolStarted.js";

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

  const renderPoolInterface = () => {
    if (!pool) return;

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
          // pool={pool}
          // position={position}
          // updatePosition={updatePosition}
          // setActionBtn={setActionBtn}
          // setLoading={setLoading}
          />
        </div>
      );
    }

    if (state === "LIVE" || state === "ENDED")
      return (
        <div>
          <PoolStarted
            pool={pool}
            state={state}
            currentCycle={currentCycle}
            position={position}
            updatePosition={updatePosition}
            isCycleDepositAndBidOpen={isCycleDepositAndBidOpen}
            poolChainId={poolChainId}
          />
        </div>
      );

    return null;
  };

  return pool ? (
    <div className="">
      <TokenData token={pool.ybt} />
      <PoolState
        state={state}
        currentCycle={currentCycle}
        positionsFilled={allPositions.length}
        totalCycles={pool.totalCycles}
        totalPositions={pool.totalPositions}
      />
      <PoolInfoTab pool={pool} />
      <div className="absolute left-1/2 -translate-x-1/2 w-[1783px] h-[1783px] circle-gradient rounded-full border-2 border-gray-950 flex justify-center" />
      <div className="relative w-full flex justify-center items-center min-h-[650px]">
        {renderPoolInterface()}
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default PoolPage;
