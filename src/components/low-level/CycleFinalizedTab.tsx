import BtnFull from "./BtnFull";
import Tag from "./Tag";
import logoBlue from "../../assets/icons/logoBlue.svg";
import { Cycle, Position } from "../../types";
import Pool from "../../contract-hooks/Pool";
import { displayTokenAmount } from "../../utils/displayTokenAmounts";
import { useState } from "react";

const CycleFinalizedTab = ({
  pool,
  currentCycle,
  position,
  updatePosition,
}: {
  pool: Pool;
  currentCycle: Cycle;
  position: Position;
  showOverlay: (overlayComponent: React.ReactNode) => void;
  updatePosition: (value: number) => void;
}) => {
  const [loading, setLoading] = useState(false);

  const handleClaimSpiralYield = async () => {
    if (!pool || !position) return;

    setLoading(true);
    await pool.claimSpiralYield(position.id);
    updatePosition(position.id);

    // toastSuccess(
    //   `Claimed ${
    //     spiralYield.amountBase > 0 ? `${spiralYield.amountBase} ${pool.baseToken.symbol}` : ""
    //   }   ${spiralYield.amountYbt > 0 ? `& ${spiralYield.amountYbt} ${pool.ybt.symbol}` : ""}`
    // );
    setLoading(false);
  };

  const renderFinalizedTab = () => {
    // For Bid winners
    if (position.winningCycle === currentCycle.count)
      return (
        <div className="flex flex-col items-center">
          <span className="text-lg mb-2">You Won!</span>
          <span className="text-xs font-light text-white text-opacity-70 mb-[2px]">
            You received the pooled liquidity:
          </span>
          <span className="text-sm text-green-500">
            {
              displayTokenAmount(
                pool.amountCollateralInBase,
                pool.baseToken
              ) /** Need to add actual liquidity + slashed collaerals */
            }
          </span>
        </div>
      );

    // For non-bid winners, only if they have spiral yeild left to claim
    if (
      position.spiralYield.amountBase.isGreaterThan(0) ||
      position.spiralYield.amountYbt.isGreaterThan(0)
    ) {
      return (
        <div className="flex flex-col items-center">
          <span className="text-lg mb-2">Congratulations!</span>
          <span className="text-xs font-light text-white text-opacity-70">
            You have received Spiral Yield
          </span>
          <span className="text-sm text-green-500">
            {
              position.spiralYield.amountBase.isGreaterThan(0) &&
                displayTokenAmount(
                  position.spiralYield.amountBase,
                  pool.baseToken
                ) /** Need to add actual liquidity + slashed collaerals */
            }
            {" + "}
            {
              position.spiralYield.amountYbt.isGreaterThan(0) &&
                displayTokenAmount(
                  position.spiralYield.amountYbt,
                  pool.baseToken
                ) /** Need to add actual liquidity + slashed collaerals */
            }
          </span>
          <BtnFull text="Claim Spiral Yield" onClick={handleClaimSpiralYield} />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center">
        <span className="text-lg mb-2">Cycle Finalized</span>
        <span className="text-xs font-light text-white text-opacity-70">
          You have claimed Spiral Yield
        </span>
        <BtnFull text={"Spiral Yield Claimed"} onClick={() => {}} disabled={true} />
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-8 bg-gradient-to-b from-slate-900 to-gray-950 rounded-xl p-1">
      <div className="flex flex-col items-center gap-4 p-6">
        <img src={logoBlue} alt="" className="w-24 h-24" />
        <div className="flex flex-col gap-6 py-3">{renderFinalizedTab()}</div>
      </div>

      <div className="flex justify-between mt-6 p-2">
        <span className="text-sm">{`Cycle ${currentCycle.count + 1} is starting in`}</span>
        <Tag color="green" text={"02m:52s"} />
      </div>
    </div>
  );
};

export default CycleFinalizedTab;
