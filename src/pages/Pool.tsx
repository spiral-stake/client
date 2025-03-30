import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useAccount } from "wagmi";

import Pool from "../contract-hooks/Pool.js";
import PoolRedeem from "../components/pool-tabs/PoolRedeemTab.js";
import { getCurrentTimestampInSeconds } from "../utils/time.js";
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
import ErrorIconBig from "../assets/icons/errorIconBig.svg";
import CycleFinalizedTab from "../components/low-level/CycleFinalizedTab.js";
import PoolPositionTab from "../components/pool-tabs/PoolPositionTab.js";
import checkBig from "../assets/icons/checkIconBig.svg";
import Tag from "../components/low-level/Tag.js";

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
  const [isCycleDepositAndBidOpen, setIsCycleDepositAndBidOpen] =
    useState(false);
  const [slider1, setShowSlider1] = useState(true);

  // All positions is needed for cycle globe hover effect for diplaying winning positions
  const [allPositions, setAllPositions] = useState<Position[]>([]);
  const [position, setPosition] = useState<Position>();

  const { address } = useAccount();
  const { address: poolAddress } = useParams();
  const ybtSymbol = useSearchParams()[0].get("ybt") as string;
  const poolChainId = parseInt(
    useSearchParams()[0].get("poolChainId") as string
  );

  ////////////////////////
  // Use Effects
  ///////////////////////

  useEffect(() => {
    if (!poolAddress) return;
    showOverlay(undefined);

    const initialize = async () => {
      try {
        const _pool = await Pool.createInstance(
          poolAddress,
          poolChainId,
          ybtSymbol
        );

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

    const userPositions = allPositions.filter(
      (position) => position.owner === address
    );

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

    setIsCycleDepositAndBidOpen(
      getCurrentTimestampInSeconds() < depositAndBidEndTime
    );
    toastSuccess(
      `Cycle ${newCycleCount} Started`,
      `Cycle ${newCycleCount} has started, Please make cycle Deposits and Bid`
    );
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
    setState("ENED");
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
        <div className="flex flex-col w-full lg:grid grid-cols-2 lg:w-[764px] mt-24 ml-12  gap-16">
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
              <CycleFinalizedTab
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
      <div className="w-full  lg:mb-0 flex flex-col justify-end lg:grid lg:grid-cols-2 lg:w-[764px] mt-24 ml-12 gap-16">
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
    <div className="pt-5">
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
        className={`absolute left-1/2 -translate-x-1/2 w-[1783px] h-[1783px] rotate-[16deg] bg-[linear-gradient(176deg,#01152a_1.93%,#03050d_28.18%)] rounded-full transition-transform duration-1000 flex justify-around border-4 border-gray-700 border-l-blue-600 border-b-blue-600 items-start`}
      ></div>

      <div
        className={`absolute left-1/2 -translate-x-1/2 w-[1783px] h-[1783px]  rounded-full transition-transform duration-1000 flex justify-around items-start`}
      >
        <div className="">
          {/* 11:00 marking - positioned at 330 degrees */}
          <div
            className="flex flex-col justify-center items-center absolute text-white text-lg font-bold gap-2"
            style={{
              top: "50%",
              left: "50%",
              transform:
                "translate(-50%, -50%) rotate(330deg) translateY(-861px) rotate(-330deg)",
            }}
          >
            <div className="w-6 h-6 p-1 rounded-full bg-blue-600 bg-opacity-30">
              <div className="w-4 h-4 rounded-full bg-blue-600 " />
            </div>
            <div className="font-normal text-sm">Cycle 1</div>
            <div>
              <Tag color="green" text="00:00:00" dot={false} />
            </div>
          </div>

          {/* 1:00 marking - positioned at 30 degrees */}
          <div
            className="absolute flex flex-col justify-center items-center text-white text-lg font-bold gap-2"
            style={{
              top: "50%",
              left: "50%",
              transform:
                "translate(-50%, -50%) rotate(30deg) translateY(-861px) rotate(-30deg)",
            }}
          >
            <div className="w-6 h-6 p-1 rounded-full bg-blue-600 bg-opacity-30">
              <div className="w-4 h-4 rounded-full bg-blue-600 " />
            </div>
            <div className="font-normal text-sm">Cycle 2</div>
            <div>
              <Tag color="green" text="00:00:00" dot={false} />
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full flex justify-center items-center min-h-[650px]">
        <div className="min-w-[312px]">{renderPoolTab()}</div>
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default PoolPage;
