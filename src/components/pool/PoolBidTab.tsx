import infoIcon from "../../assets/Icons/infoIcon.svg";
import Pool from "../../contract-hooks/Pool";
import { Cycle, LowestBid, Position } from "../../types";
import Input from "../low-level/Input";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { handleAsync } from "../../utils/handleAsyncFunction";
import { displayAmount } from "../../utils/displayAmounts";
import { toastSuccess } from "../../utils/toastWrapper";
import ActionBtn from "../ActionBtn";

const PoolBidTab = ({
  pool,
  currentCycle,
  position,
  updatePosition,
  isCycleDepositAndBidOpen,
  poolChainId,
}: {
  pool: Pool;
  currentCycle: Cycle;
  position: Position;
  updatePosition: (value: number) => void;
  isCycleDepositAndBidOpen: boolean;
  poolChainId: number;
}) => {
  const [amountBid, setAmountBid] = useState("");
  const [lowestBid, setLowestBid] = useState<LowestBid>();
  const [loading, setLoading] = useState(false);
  const [actionBtn, setActionBtn] = useState({ text: "", onClick: () => {}, disabled: false });

  useEffect(() => {
    updateLowestBid();
  }, [currentCycle]);

  const updateLowestBid = async () => {
    setLowestBid(await pool.getLowestBid());
  };

  const handleAmountBidChange = (e: any) => {
    setAmountBid(e.target.value);
  };

  useEffect(() => {
    const updatingActionBtn = () => {
      if (position.winningCycle) {
        return setActionBtn({
          ...actionBtn,
          text: `Already Won, Cannot Bid`,
          disabled: true,
        });
      }

      if (!amountBid || parseInt(amountBid) === 0) {
        return setActionBtn({
          ...actionBtn,
          text: `Bid Lowest Liqudity`,
          disabled: true,
        });
      }

      if (lowestBid) {
        const isBidTooHigh = lowestBid.amount?.isZero()
          ? parseFloat(amountBid) > parseFloat(pool.amountCollateralInBase.toString())
          : parseFloat(amountBid) >= parseFloat(lowestBid.amount.toString());

        if (isBidTooHigh) {
          return setActionBtn({ ...actionBtn, text: "Bid Amount too High", disabled: true });
        }
      }

      return setActionBtn({
        text: `Bid Lowest Liqudity`,
        disabled: false,
        onClick: handleAsync(handleCycleBid, setLoading),
      });
    };

    updatingActionBtn();
  }, [position, currentCycle, amountBid, lowestBid]);

  const handleCycleBid = async () => {
    await pool.bidCycle(position.id, amountBid);
    toastSuccess(`Lowest bid is now yours at ${amountBid} ${pool.baseToken.symbol}`);

    setAmountBid("");
    updateLowestBid();
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          <span>Your Bid</span>
          <img onClick={() => {}} src={infoIcon} alt="" className="w-4 h-4 text-gray-400" />
        </div>
        <div className="px-2.5 py-2 bg-neutral-800 rounded-[33.78px] inline-flex justify-start items-center gap-1.5">
          <div className="justify-start text-neutral-300 text-xs font-normal font-['Outfit'] leading-none">
            Time left: hardcoded
          </div>
        </div>
      </div>
      <div>
        <div className="w-full inline-flex flex-col justify-start items-start gap-2 mt-4 mb-1">
          <div className="self-stretch inline-flex justify-between items-start">
            <div className="justify-start text-white text-opacity-70 text-xs font-normal font-['Outfit']">
              Current Bid
            </div>
            <div className="justify-start text-white text-xs font-normal font-['Outfit']">
              hardcoded
            </div>
          </div>
          <div className="self-stretch inline-flex justify-between items-start">
            <div className="justify-start text-white text-opacity-70 text-xs font-normal font-['Outfit']">
              Total Biders
            </div>
            <div className="justify-start text-white text-xs font-normal font-['Outfit']">
              {pool.totalCycles - (currentCycle.count - 1)}
            </div>
          </div>
          <div className="self-stretch inline-flex justify-between items-start">
            <div className="justify-start text-white text-opacity-70 text-xs font-normal font-['Outfit']">
              Max / Start Bid:
            </div>
            <div className="justify-start text-white text-xs font-normal font-['Outfit']">
              {displayAmount(pool.amountCollateralInBase)} {pool.baseToken.symbol}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 mb-4">
        <Input
          name={""}
          value={amountBid}
          onChange={handleAmountBidChange}
          inputTokenSymbol={pool.baseToken.symbol}
        />
      </div>
      <div>
        <ActionBtn
          text={actionBtn.text}
          disabled={actionBtn.disabled}
          expectedChainId={poolChainId}
          onClick={actionBtn.onClick}
        />
      </div>
    </div>
  );
};

export default PoolBidTab;
