import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useAccount } from "wagmi";

import Pool from "../contract-hooks/Pool.js";
import PoolRedeem from "../components/pool-tabs/PoolRedeemTab.js";
import { getCurrentTimestampInSeconds } from "../utils/time.js";
import { toastInfo, toastSuccess } from "../utils/toastWrapper.js";
import { Cycle, Position } from "../types/index.js";
import PoolInfoTab from "../components/PoolInfo.js";
import PoolJoinTab from "../components/pool-tabs/PoolJoinTab.js";
import TokenData from "../components/low-level/TokenData.js";
import PoolState from "../components/PoolState.js";
import Loader from "../components/low-level/Loader.js";
import PoolDepositTab from "../components/pool-tabs/PoolDepositTab.js";
import PoolBidTab from "../components/pool-tabs/PoolBidTab.js";
import WaitTab from "../components/low-level/WaitTab.js";
import ErrorIconBig from "../assets/icons/errorIconBig.svg";
import PoolFinalizedTab from "../components/pool-tabs/PoolFinalizedTab.js";
import PoolPositionTab from "../components/pool-tabs/PoolPositionTab.js";
import checkBig from "../assets/icons/checkIconBig.svg";
import CycleGlobe from "../components/low-level/CycleGlobe.js";
import arrowIcon from "../assets/icons/arrow.svg";

const PoolPage = ({
  showOverlay,
}: {
  showOverlay: (overlayComponent: JSX.Element | null | undefined) => void;
}) => {
  // ----- State ------ //
  const [pool, setPool] = useState<Pool>();
  const [state, setState] = useState<string>();
  const [cyclesFinalized, setCyclesFinalized] = useState(0);
  const [currentCycle, setCurrentCycle] = useState<Cycle>();
  const [isCycleDepositAndBidOpen, setIsCycleDepositAndBidOpen] = useState(false);
  const [slider1, setShowSlider1] = useState(true);

  // All positions is needed for cycle globe hover effect for diplaying winning positions
  const [allPositions, setAllPositions] = useState<Position[]>([]);
  const [position, setPosition] = useState<Position>();

  const { address } = useAccount();
  const { address: poolAddress } = useParams();
  const ybtSymbol = useSearchParams()[0].get("ybt") as string;
  const poolChainId = parseInt(useSearchParams()[0].get("poolChainId") as string);

  ////////////////////////
  // Use Effects
  ///////////////////////

  useEffect(() => {
    if (!poolAddress) return;
    showOverlay(undefined);

    const initialize = async () => {
      try {
        const _pool = await Pool.createInstance(poolAddress, poolChainId, ybtSymbol);

        setPool(_pool);
        setState(_pool.calcPoolState(_pool.allPositions.length));
        setAllPositions(_pool.allPositions);
        setCyclesFinalized(_pool.cyclesFinalized);
      } catch (error) {
        console.error("Failed to initialize pool page:", error);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (state === "LIVE" || state === "ENDED") {
      updateCurrentCycle();
    }
  }, [state]);

  useEffect(() => {
    if (!address || !allPositions) return;

    const userPositions = allPositions.filter((position) => position.owner === address);

    if (!userPositions.length) return setPosition(undefined);
    setPosition(userPositions[0]);
  }, [address, allPositions]);

  ////////////////////////
  // Handler Functions
  ///////////////////////

  // To be pinged by startTime countdown
  const syncPoolInitialState = async () => {
    if (!pool) return;

    try {
      const _allPositions = await pool.getAllPositions();
      const _poolState = pool.calcPoolState(_allPositions.length);

      setState(_poolState);
      setAllPositions(_allPositions);
    } catch (error) {
      console.error("Failed to sync initial Pool State:", error);
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

    let newCycleCount = !currentCycle ? pool.calcCurrentCycle() : currentCycle.count + 1;

    const { startTime, endTime } = pool.calcCycleStartAndEndTime(newCycleCount);
    const depositAndBidEndTime = pool.calcDepositAndBidEndTime(newCycleCount);
    setCurrentCycle({
      count: newCycleCount,
      startTime,
      endTime,
      depositAndBidEndTime,
    });

    setIsCycleDepositAndBidOpen(getCurrentTimestampInSeconds() < depositAndBidEndTime);
    state !== "ENDED"
      ? toastSuccess(
          `Cycle ${newCycleCount} Started`,
          `Cycle ${newCycleCount} has started, Please make cycle Deposits and Bid`
        )
      : toastInfo("Pool Ended", "Pool has Ended Please collect your yield if any");
  };

  // Will be called by countdown timers to close depositAndBidWindow
  const closeCycleDepositWindow = async () => {
    setIsCycleDepositAndBidOpen(false);
    toastSuccess(
      "Deposit and Bid Window Closed",
      `Deposit and Bid Window closed for cycle ${currentCycle?.count}`
    );
  };

  const checkCycleFinalized = async () => {
    if (!pool || !position) return;

    const [_cyclesFinalized] = await Promise.all([
      await pool.getCyclesFinalized(),
      await updatePosition(position.id),
    ]);

    setCyclesFinalized(_cyclesFinalized);
  };

  const setPoolEnded = () => {
    setState("ENDED");
  };

  ////////////////////////
  // Compenents Renders
  ///////////////////////

  const renderPoolTab = () => {
    if (!pool || !state) return null;

    if (state === "WAITING") {
      return (
        <div>
          <PoolJoinTab
            pool={pool}
            allPositions={allPositions}
            position={position}
            updateAllPositions={updateAllPositions}
            syncPoolInitialState={syncPoolInitialState}
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

    if (!currentCycle) return;

    if (state === "LIVE") {
      return (
        <div className="flex flex-col w-full lg:grid grid-cols-2 lg:w-[764px] lg:mt-24 lg:ml-12  lg:gap-16">
          <div className={`${slider1 ? "flex" : "hidden"} lg:flex w-full`}>
            {cyclesFinalized !== currentCycle.count ? (
              <div className="flex flex-col gap-12 w-full">
                <PoolDepositTab
                  pool={pool}
                  currentCycle={currentCycle}
                  position={position}
                  updatePosition={updatePosition}
                  isCycleDepositAndBidOpen={isCycleDepositAndBidOpen}
                  showOverlay={showOverlay}
                />
                <PoolBidTab
                  pool={pool}
                  currentCycle={currentCycle}
                  position={position}
                  isCycleDepositAndBidOpen={isCycleDepositAndBidOpen}
                  showOverlay={showOverlay}
                  closeCycleDepositWindow={closeCycleDepositWindow}
                  checkCycleFinalized={checkCycleFinalized}
                />
              </div>
            ) : (
              <PoolFinalizedTab
                pool={pool}
                currentCycle={currentCycle}
                position={position}
                showOverlay={showOverlay}
                updatePosition={updatePosition}
                updateCurrentCycle={updateCurrentCycle}
                setPoolEnded={setPoolEnded}
              />
            )}
          </div>
          <div className={`${!slider1 ? "flex" : "hidden"} lg:flex`}>
            <PoolPositionTab
              pool={pool}
              currentCycle={currentCycle}
              cyclesFinalized={cyclesFinalized}
              position={position}
              updatePosition={updatePosition}
            />
          </div>

          <div className="lg:hidden w-full flex text-sm absolute left-1 right-1 bottom-2">
            <div
              onClick={() => setShowSlider1(!slider1)}
              className={`cursor-pointer w-full text-center p-2 ${
                slider1 && "border-t-2 border-t-blue-600"
              }`}
            >
              Main
            </div>
            <div
              onClick={() => setShowSlider1(!slider1)}
              className={`cursor-pointer w-full text-center p-2 ${
                !slider1 && "border-t-2 border-t-blue-600"
              }`}
            >
              <span>NFTs</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full  lg:mb-0 flex flex-col justify-end lg:grid lg:grid-cols-2 lg:w-[764px] lg:mt-24 lg:ml-12 lg:gap-16">
        {" "}
        <div className={`${slider1 ? "flex" : "hidden"} lg:flex`}>
          <WaitTab
            icon={checkBig}
            title="Pool has Ended"
            msg="Pool has ended, Claim any remaining Yield"
          />
        </div>
        <div className={`${!slider1 ? "flex" : "hidden"} lg:flex`}>
          <PoolPositionTab
            pool={pool}
            currentCycle={currentCycle}
            cyclesFinalized={cyclesFinalized}
            position={position}
            updatePosition={updatePosition}
          />
        </div>
        <div className="lg:hidden w-full flex text-sm absolute left-1 right-1 bottom-2">
          <div
            onClick={() => setShowSlider1(!slider1)}
            className={`cursor-pointer w-full text-center p-2 ${
              slider1 && "border-t-2 border-t-blue-600"
            }`}
          >
            Main
          </div>
          <div
            onClick={() => setShowSlider1(!slider1)}
            className={`cursor-pointer w-full text-center p-2 ${
              !slider1 && "border-t-2 border-t-blue-600"
            }`}
          >
            <span>NFTs</span>
          </div>
        </div>
      </div>
    );
  };

  return pool ? (
    <div className="pt-5 cursor-default">
      <Link to={"/pools"} className="flex gap-1 text-sm pb-2">
        <img src={arrowIcon} alt="" />
        <span>{`Pools / `}</span>
        <span className="text-gray-400">{pool.ybt.symbol}</span>
      </Link>
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
        className={`absolute left-1/2 border-[3px] border-transparent border-b-blue-600 border-l-blue-600 bg-[radial-gradient(circle_at_center,#03050d_40%,#01152a_96%)] ${
          state === "ENDED" && "rotate-[130deg]"
        }  ${(state === "WAITING" || state === "DISCARDED") && "rotate-[-30deg]"} ${
          currentCycle && currentCycle?.count % 2 === 0 ? "rotate-[77deg]" : "rotate-[12deg]"
        }    -translate-x-1/2 w-[1783px] h-[1783px] rounded-full transition-transform duration-1000 flex justify-around items-start`}
      ></div>

      {/* <CycleGlobe currentCycle={currentCycle} pool={pool} state={state} /> */}

      <div className="relative w-full flex justify-center items-center min-h-[650px]">
        <div className="min-w-[312px]">{renderPoolTab()}</div>
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default PoolPage;
