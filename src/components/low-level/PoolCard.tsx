import Pool from "../../contract-hooks/Pool";
import { useState, useEffect } from "react";
import tokenIcon from "../../assets/icons/Group.svg";
import { displayTokenAmount } from "../../utils/displayTokenAmounts";
import TagSquare from "./TagSquare";
import { formatTime, getLocalTimeFromTimestamp } from "../../utils/time";
import { Link } from "react-router-dom";
import TextLoading from "./TextLoading";
import cycleIcon from "../../assets/icons/cycle.svg";
import timeIcon from "../../assets/icons/Time.svg";
import depositIcon from "../../assets/icons/deposit.svg";
import winIcon from "../../assets/icons/winIcon.svg";

const PoolCard = ({ pool }: { pool: Pool }) => {
  const [state, setState] = useState<string>();

  useEffect(() => {
    const getPoolState = async () => {
      const [positionsFilled, cyclesFinalized] = await Promise.all([
        pool.getPositionsFilled(),
        pool.getCyclesFinalized(),
      ]);

      setState(pool.calcPoolState(positionsFilled, cyclesFinalized));
    };

    getPoolState();
  }, []);

  return (
    <Link to={`/pools/${pool.address}?ybt=${pool.ybt.symbol}&poolChainId=${pool.chainId}`}>
      <div className="w-full hover:bg-slate-900 rounded-md py-5 lg:py-2 border-y border-y-slate-800 lg:border-y-0 grid grid-cols-[1.3fr_1.8fr_2.2fr_2.2fr] grid-rows-[1fr_1fr_2fr] lg:grid-cols-12 lg:grid-rows-1 items-center lg:pr-5 transition-all ease-out duration-150">
        <div className="col-span-3 row-span-2 lg:col-span-4 lg:row-span-1 flex justify-center items-center">
          <div className="h-16 p-3 inline-flex justify-start items-center gap-2">
            <img src={tokenIcon} alt="" />
          </div>
          <div className="w-full h-16 p-3 inline-flex justify-start items-center gap-4">
            <div className="inline-flex flex-col justify-center items-start">
              <div className="inline-flex justify-center items-center gap-2">
                <div className="flex-1 justify-center text-zinc-300 text-base font-medium font-['Outfit']">
                  {pool.ybt.symbol}
                </div>
              </div>
              <div className="justify-center text-neutral-400 text-sm font-normal font-['Outfit']">
                {state ? (
                  (state === "LIVE" &&
                    `Starting : ${getLocalTimeFromTimestamp(pool.startTime).formattedDate} ${
                      getLocalTimeFromTimestamp(pool.startTime).formattedTime
                    }`) ||
                  (state === "WAITING" &&
                    `Starting : ${getLocalTimeFromTimestamp(pool.startTime).formattedDate} ${
                      getLocalTimeFromTimestamp(pool.startTime).formattedTime
                    }`) ||
                  (state === "ENDED" &&
                    `Ended : ${getLocalTimeFromTimestamp(pool.endTime).formattedDate} ${
                      getLocalTimeFromTimestamp(pool.endTime).formattedTime
                    }`) ||
                  (state === "DISCARDED" &&
                    `Discarded : ${getLocalTimeFromTimestamp(pool.startTime).formattedDate} ${
                      getLocalTimeFromTimestamp(pool.startTime).formattedTime
                    }`)
                ) : (
                  <TextLoading width={100} />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden flex justify-end col-span-1 row-span-2">
          {state ? (
            (state === "WAITING" && <TagSquare text="Waiting" color="yellow" />) ||
            (state === "LIVE" && <TagSquare text="Live" color="green" />) ||
            (state === "DISCARDED" && <TagSquare text="Discarded" color="red" />) ||
            (state == "ENDED" && <TagSquare text="Ended" color="gray" />)
          ) : (
            <TextLoading />
          )}
        </div>

        <div className="col-span-1 h-16 inline-flex justify-start items-center">
          <div className="w-full lg:pl-0 inline-flex flex-col justify-center items-center lg:items-start gap-0">
           <div className="flex flex-col justify-start">
           <div className="justify-center text-zinc-300 text-base font-normal font-['Outfit'] truncate">
              {pool.totalCycles}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1 lg:hidden">
              <img src={cycleIcon} alt="" className="w-2.5 h-2.5" />
              <span>Cycle</span>
            </div>
           </div>
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2 h-16  inline-flex items-center justify-start gap-0 lg:gap-4">
          <div className="w-full inline-flex flex-col  lg:pl-0 lg:border-l-0 border-l-2 border-l-gray-800 justify-center lg:items-start items-center gap-0 lg:gap-2 overflow-hidden">
            <div className="flex flex-col justify-start">
            <div className="justify-center text-zinc-300 text-base font-normal font-['Outfit']">
              {`${formatTime(pool.cycleDuration).value} ${formatTime(
                pool.cycleDuration
              ).unit.toLowerCase()}`}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1 lg:hidden">
              <img src={timeIcon} alt="" className="w-2.5 h-2.5" />
              <span>Duration</span>
            </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2 h-16  inline-flex justify-start items-center gap-4">
          <div className="w-full inline-flex flex-col lg:pl-0 lg:border-l-0 border-l-2 border-l-gray-800 justify-center lg:items-start items-center gap-0 overflow-hidden">
           <div className="flex flex-col justify-start">
           <div className="justify-center text-zinc-300 text-base font-normal font-['Outfit']">
              {`${displayTokenAmount(pool.amountCycle, pool.baseToken, 2)}`}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1 lg:hidden">
              <img src={depositIcon} alt="" className="w-2.5 h-2.5" />
              <span>Deposit</span>
            </div>
           </div>
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2 h-16  inline-flex justify-start items-center lg:gap-4">
          <div className="w-full inline-flex flex-col lg:pl-0 lg:border-l-0 border-l-2 border-l-gray-800 justify-center lg:items-start items-center gap-0 overflow-hidden">
            <div className="flex flex-col justify-start">
            <div className="justify-center text-white text-base font-normal font-['Outfit']">
              {`${displayTokenAmount(pool.amountCollateralInBase, pool.baseToken, 2)}`}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1 lg:hidden">
              <img src={winIcon} alt="" className="w-2.5 h-2.5" />
              <span>Win</span>
            </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:inline-flex col-span-1">
          {state ? (
            (state === "WAITING" && <TagSquare text="Waiting" color="yellow" />) ||
            (state === "LIVE" && <TagSquare text="Live" color="green" />) ||
            (state === "DISCARDED" && <TagSquare text="Discarded" color="red" />) ||
            (state == "ENDED" && <TagSquare text="Ended" color="gray" />)
          ) : (
            <TextLoading />
          )}
        </div>
      </div>
    </Link>
  );
};

export default PoolCard;
