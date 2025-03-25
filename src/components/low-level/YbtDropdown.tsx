import { useState } from "react";
import arrowIcon from "../../assets/Icons/arrowDown.svg";
import TagGreen from "./TagGreen";
import { Ybt } from "../../types";
import PoolCard from "./PoolCard";
import Loader from "./Loader";

const YbtDropdown = ({
  tokenIcon,
  tagMsg,
  poolAddresses,
  ybt,
}: {
  tokenIcon: string;
  tagMsg: string;
  poolAddresses: string[];
  ybt: Ybt;
}) => {
  const [showPoolcards, setShowPoolcards] = useState(false);

  return (
    <div className="cursor-pointer" onClick={()=>setShowPoolcards(!showPoolcards)}>
      <div className="w-full h-16 px-2 border-b border-gray-900 inline-flex justify-start items-center gap-6">
        <div className="flex-1 flex justify-start items-center">
          <div className="h-16 p-3 flex justify-start items-center gap-2">
            <img src={tokenIcon} alt="" className="w-8 h-8" />
          </div>
          <div className="flex-1 h-16 py-3 flex justify-start items-center gap-4">
            <div className="flex-1 inline-flex flex-col justify-center items-start gap-3">
              <div className="self-stretch inline-flex justify-center items-center gap-2">
                <div className="flex-1 justify-center text-zinc-300 text-xl font-medium font-['Outfit']">
                  swETH
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch p-3 flex justify-start items-center gap-4">
            <div className="inline-flex flex-col justify-center items-start gap-2">
              <TagGreen text={tagMsg} />
            </div>
          </div>
          <div className="h-16 p-3 flex justify-start items-center gap-4">
            <img src={arrowIcon} alt="" className={`h-6 w-6 ${showPoolcards&&"-rotate-180"}`} />
          </div>
        </div>
      </div>

      {showPoolcards && (
       <div>
       <div>
           {poolAddresses.map((poolAddress: string, index: number) => (
             <PoolCard key={index} poolAddress={poolAddress} ybt={ybt}/>
           ))}
         </div>
     </div>
      )}
    </div>
  );
};

export default YbtDropdown;
