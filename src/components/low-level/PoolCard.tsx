import Pool from "../../contract-hooks/Pool";
import { useState, useEffect } from "react";
import { useChainId } from "wagmi";
import { Ybt } from "../../types";
import tokenIcon from "../../assets/icons/Group.svg";
import { displayAmount } from "../../utils/displayAmounts";
import TagSquare from "./TagSquare";
import {
  countdown,
  formatTime,
  getLocalTimeFromTimestamp,
} from "../../utils/time";

const PoolCard = ({ poolAddress, ybt }: { poolAddress: string; ybt: Ybt }) => {
  const [pool, setPool] = useState<Pool>();
  const [state, setState] = useState<string>();
  const [currentCycle, setCycle] = useState<number | undefined>();
  const [positionsFilled, setPositionsFilled] = useState(0);
  const [cyclesFinalized, setCyclesFinalized] = useState(0);

  const poolChainId = useChainId();

  useEffect(() => {
    const getPool = async () => {
      const [_pool, _positionsFilled, _cyclesFinalized] = await Promise.all([
        Pool.createInstance(poolAddress, poolChainId, ybt.symbol),
        new Pool(poolAddress).getPositionsFilled(),
        new Pool(poolAddress).getCyclesFinalized(),
      ]);

      setPool(_pool);
      setPositionsFilled(_positionsFilled);
      setCyclesFinalized(_cyclesFinalized);
    };

    getPool();
  }, [poolAddress]);

  useEffect(() => {
    if (!pool) return;

    setState(pool.calcPoolState(positionsFilled, cyclesFinalized));
  }, [pool, positionsFilled, cyclesFinalized]);

  useEffect(() => {
    if (!pool) return;
    if (state !== "LIVE") return;

    setCycle(pool.calcCurrentCycle());
  }, [state]);

  console.log(state);

  return pool ? (
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
              {(state === "LIVE" &&
                `Started at : ${
                  getLocalTimeFromTimestamp(pool.startTime).formattedDate
                } ${
                  getLocalTimeFromTimestamp(pool.startTime).formattedTime
                }`) ||
                (state === "WAITING" &&
                  `Starting in : ${countdown(pool.startTime)}`) ||
                (state === "ENDED" &&
                  `Ended on : ${
                    getLocalTimeFromTimestamp(pool.endTime).formattedDate
                  } ${
                    getLocalTimeFromTimestamp(pool.endTime).formattedTime
                  }`) ||
                (state === "DISCARDED" &&
                  `Discarded on : ${
                    getLocalTimeFromTimestamp(pool.startTime).formattedDate
                  } ${
                    getLocalTimeFromTimestamp(pool.startTime).formattedTime
                  }`)}
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
            {`${formatTime(pool.cycleDuration).value} ${
              formatTime(pool.cycleDuration).unit
            }`}
          </div>
        </div>
      </div>
      <div className=" h-16 p-3 pr-10 inline-flex justify-start items-center gap-4">
        <div className="flex-1 inline-flex flex-col justify-center items-start gap-2 w-28 overflow-hidden">
          <div className="justify-center text-zinc-300 text-base font-normal font-['Outfit']">
            {`${displayAmount(pool.amountCycle, 2)} ${pool.ybt.symbol}`}
          </div>
        </div>
      </div>
      <div className=" h-16 p-3 pr-10 inline-flex justify-start items-center gap-4">
        <div className="flex-1 inline-flex flex-col justify-center items-start gap-2 w-28 overflow-hidden">
          <div className="justify-center text-white text-base font-normal font-['Outfit']">
            {`${displayAmount(pool.amountCollateralInBase, 2)} ${
              pool.ybt.symbol
            }`}
          </div>
        </div>
      </div>
      <div className="w-16">
        {(state === "WAITING" && <TagSquare text="Waiting" color="yellow" />) ||
          (state === "LIVE" && <TagSquare text="Live" color="green" />) ||
          (state === "DISCARDED" && (
            <TagSquare text="Discard" color="gray" />
          )) ||
          (state == "ENDED" && <TagSquare text="Ended" color="red" />)}
      </div>
    </div>
  ) : (
    <></>
    //LOADING........................................................................
    
  );
};

export default PoolCard;
