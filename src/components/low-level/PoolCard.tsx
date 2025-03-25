import Pool from "../../contract-hooks/Pool";
import { useState, useEffect } from "react";
import tokenIcon from "../../assets/icons/Group.svg";
import { displayAmount } from "../../utils/displayAmounts";
import TagSquare from "./TagSquare";
import { formatTime, getLocalTimeFromTimestamp } from "../../utils/time";
import { Link } from "react-router-dom";
import TextLoading from "./TextLoading";

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
      <div className="w-full flex items-center justify-between">
        <div className="flex justify-center items-center">
          <div className="h-16 p-3 inline-flex justify-start items-center gap-2">
            <img src={tokenIcon} alt="" />
          </div>
          <div className=" h-16 p-3 w-[400px] inline-flex justify-start items-center gap-4">
            <div className="flex-1 inline-flex flex-col justify-center items-start">
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
        <div className=" h-16 p-3 pr-10 inline-flex justify-start items-center gap-4">
          <div className="flex-1 inline-flex flex-col justify-center items-start gap-2 w-28">
            <div className="justify-center text-zinc-300 text-base font-normal font-['Outfit'] truncate">
              {pool.totalCycles}
            </div>
          </div>
        </div>
        <div className="h-16 p-3 pr-10 inline-flex justify-start items-center gap-4">
          <div className="flex-1 inline-flex flex-col justify-center items-start gap-2 w-28 overflow-hidden">
            <div className="justify-center text-zinc-300 text-base font-normal font-['Outfit']">
              {`${formatTime(pool.cycleDuration).value} ${formatTime(pool.cycleDuration).unit}`}
            </div>
          </div>
        </div>
        <div className=" h-16 p-3 pr-10 inline-flex justify-start items-center gap-4">
          <div className="flex-1 inline-flex flex-col justify-center items-start gap-2 w-28 overflow-hidden">
            <div className="justify-center text-zinc-300 text-base font-normal font-['Outfit']">
              {`${displayAmount(pool.amountCycle, 2)} ${pool.baseToken.symbol}`}
            </div>
          </div>
        </div>
        <div className=" h-16 p-3 pr-10 inline-flex justify-start items-center gap-4">
          <div className="flex-1 inline-flex flex-col justify-center items-start gap-2 w-28 overflow-hidden">
            <div className="justify-center text-white text-base font-normal font-['Outfit']">
              {`${displayAmount(pool.amountCollateralInBase, 2)} ${pool.baseToken.symbol}`}
            </div>
          </div>
        </div>
        <div className="w-16">
          {state ? (
            (state === "WAITING" && <TagSquare text="Waiting" color="yellow" />) ||
            (state === "LIVE" && <TagSquare text="Live" color="green" />) ||
            (state === "DISCARDED" && <TagSquare text="Discarded" color="gray" />) ||
            (state == "ENDED" && <TagSquare text="Ended" color="red" />)
          ) : (
            <TextLoading />
          )}
        </div>
      </div>
    </Link>
  );
};

export default PoolCard;
