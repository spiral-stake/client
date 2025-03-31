import arrowIcon from "../../assets/icons/arrowDown.svg";
import { Ybt } from "../../types";
import PoolCard from "./PoolCard";
import { useEffect, useState } from "react";
import Pool from "../../contract-hooks/Pool";
import Loader from "../../components/low-level/Loader";
import { useChainId } from "wagmi";
import Tag from "./Tag";

const YbtDropdown = ({
  tokenIcon,
  tagMsg,
  poolAddresses,
  ybt,
  selectedYbt,
  handleYbtChange,
}: {
  tokenIcon: string;
  tagMsg: string;
  poolAddresses: string[];
  ybt: Ybt;
  selectedYbt: Ybt | undefined;
  handleYbtChange: (ybt: Ybt | undefined) => void;
}) => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [showPools, setShowPools] = useState(false);

  const poolChainId = useChainId();

  useEffect(() => {
    if (selectedYbt?.address !== ybt.address) return setShowPools(false);
    setShowPools(true);

    async function getPools() {
      const _pools = await Promise.all(
        poolAddresses.map((poolAddress) =>
          Pool.createInstance(poolAddress, poolChainId, ybt.symbol)
        )
      );

      setPools(_pools);
    }

    getPools();
  }, [selectedYbt]);

  return (
    <div className="cursor-pointer">
      <div
        onClick={() =>
          !selectedYbt || selectedYbt.address !== ybt.address
            ? handleYbtChange(ybt)
            : handleYbtChange(undefined)
        }
        className="w-full h-16 border-b border-gray-900 inline-flex justify-start items-center gap-6"
      >
        <div className="w-full grid grid-cols-12 justify-start items-center">
          <div className="col-span-6 flex justify-start  items-center">
            <div className="h-16 p-3 flex justify-start items-center gap-2">
              <img src={tokenIcon} alt="" className="w-8 h-8" />
            </div>
            <div className="w-full pl-2 flex justify-start text-zinc-300 text-xl font-medium font-['Outfit']">
              {ybt.symbol}
            </div>
          </div>
          <div className="col-span-6 flex justify-end">
            <div className="p-3 flex justify-start items-center gap-4">
              <div className="inline-flex flex-col justify-center items-start gap-2">
                <Tag dot={true} color="green" text={tagMsg} />
              </div>
            </div>
            <div className="h-16 p-3 flex justify-start items-center gap-4">
              <img src={arrowIcon} alt="" className={`h-6 w-6 ${showPools && "-rotate-180"}`} />
            </div>
          </div>
        </div>
      </div>

      {showPools &&
        (pools.length ? (
          <div>
            <div className="hidden mt-2 pb-2 w-full lg:grid grid-cols-12 pr-5 border-b border-gray-900">
              <div className="col-span-4 flex justify-center items-center pl-3">
                <span className="px-3 inline-flex justify-start items-center ">#</span>
                <span className="w-full px-5 inline-flex justify-start items-center gap-4">
                  Pools
                </span>
              </div>

              <div className="col-span-1 flex justify-start items-center">
                <span>Cycles</span>
              </div>
              <div className="col-span-2 flex justify-start items-center">
                <span>Duration</span>
              </div>
              <div className="col-span-2 flex justify-start items-center">
                <span>Deposit</span>
              </div>
              <div className="col-span-2 flex justify-start items-center">
                <span>Win</span>
              </div>
              <div className="col-span-1 flex justify-start items-center">
                <span>Status</span>
              </div>
            </div>
            {/* <div className="h-0 w-full px-5 outline-[10px] outline-gray-600"/> */}
            <div>
              {pools.map((pool: Pool, index: number) => (
                <PoolCard key={index} pool={pool} />
              ))}
            </div>
          </div>
        ) : (
          <Loader />
        ))}
    </div>
  );
};

export default YbtDropdown;
