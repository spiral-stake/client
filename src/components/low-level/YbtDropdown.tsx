import arrowIcon from "../../assets/Icons/arrowDown.svg";
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
        className="w-full h-16 px-2 border-b border-gray-900 inline-flex justify-start items-center gap-6"
      >
        <div className="flex-1 flex justify-start items-center">
          <div className="h-16 p-3 flex justify-start items-center gap-2">
            <img src={tokenIcon} alt="" className="w-8 h-8" />
          </div>
          <div className="flex-1 h-16 py-3 flex justify-start items-center gap-4">
            <div className="flex-1 inline-flex flex-col justify-center items-start gap-3">
              <div className="self-stretch inline-flex justify-center items-center gap-2">
                <div className="flex-1 justify-center text-zinc-300 text-xl font-medium font-['Outfit']">
                  {ybt.symbol}
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch p-3 flex justify-start items-center gap-4">
            <div className="inline-flex flex-col justify-center items-start gap-2">
              <Tag color="green" text={tagMsg} />
            </div>
          </div>
          <div className="h-16 p-3 flex justify-start items-center gap-4">
            <img src={arrowIcon} alt="" className={`h-6 w-6 ${showPools && "-rotate-180"}`} />
          </div>
        </div>
      </div>

      {showPools &&
        (pools.length ? (
          <div>
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
