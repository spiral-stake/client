import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { handleAsync } from "../../utils/handleAsyncFunction";
import { toastSuccess } from "../../utils/toastWrapper";
import { NATIVE_ADDRESS } from "../../utils/NATIVE";
import { Base } from "../../contract-hooks/Base";
import Pool from "../../contract-hooks/Pool";
import { Cycle, Position } from "../../types";
import BigNumber from "bignumber.js";
import ERC20 from "../../contract-hooks/ERC20";
import Input from "../low-level/Input";
import infoIcon from "../../assets/Icons/infoIcon.svg";
import BtnFull from "../low-level/BtnFull";
import ActionBtn from "../ActionBtn";
import { displayAmount } from "../../utils/displayAmounts";

const PoolDepositTab = ({
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
  const [userBaseTokenBalance, setUserBaseTokenBalance] = useState<BigNumber>();
  const [userBaseTokenAllowance, setUserBaseTokenAllowance] = useState<BigNumber>();
  const [loading, setLoading] = useState(false);
  const [actionBtn, setActionBtn] = useState({ text: "", onClick: () => {}, disabled: false });

  const { address } = useAccount();

  useEffect(() => {
    if (!address) return;

    updateUserBaseTokenBalance();
    updateUserBaseTokenAllowance();
  }, [address]);

  useEffect(() => {
    if (!position) {
      return setActionBtn({
        ...actionBtn,
        text: `Not Joined`,
        disabled: true,
      });
    }

    const updatingActionBtn = () => {
      if (position.cyclesDeposited[currentCycle.count] === true) {
        return setActionBtn({
          ...actionBtn,
          text: `Cycle Deposit Paid`,
          disabled: true,
        });
      }

      if (!isCycleDepositAndBidOpen) {
        return setActionBtn({
          ...actionBtn,
          text: "Cycle Deposit & Bid Window Closed",
          disabled: true,
        });
      }

      if (userBaseTokenBalance?.isLessThan(pool.amountCycle)) {
        return setActionBtn({
          ...actionBtn,
          text: `Insufficient ${pool.baseToken.symbol} Balance`,
          disabled: true,
        });
      }

      if (pool.baseToken.address !== NATIVE_ADDRESS) {
        if (userBaseTokenAllowance?.isLessThan(pool.amountCycle)) {
          return setActionBtn({
            text: `Approve and Deposit`,
            disabled: false,
            onClick: handleAsync(
              () => handleApproveAndCycleDeposit(pool.baseToken, pool.address, pool.amountCycle),
              setLoading
            ),
          });
        }

        return setActionBtn({
          text: `Deposit Cycle Amount`,
          disabled: false,
          onClick: handleAsync(handleCycleDeposit, setLoading),
        });
      } else {
        return setActionBtn({
          text: `Deposit Cycle Amount`,
          disabled: false,
          onClick: handleAsync(handleCycleDeposit, setLoading),
        });
      }
    };

    updatingActionBtn();
  }, [
    userBaseTokenBalance,
    userBaseTokenAllowance,
    position,
    currentCycle,
    isCycleDepositAndBidOpen,
  ]);

  const updateUserBaseTokenBalance = async () => {
    if (!address) return;
    let balance;

    if (pool.baseToken.address !== NATIVE_ADDRESS) {
      balance = await pool.baseToken.balanceOf(address);
    } else {
      balance = await new Base("", []).getNativeBalance(address);
    }

    setUserBaseTokenBalance(balance);
  };

  const updateUserBaseTokenAllowance = async () => {
    if (!address) return;
    if (pool.baseToken.address !== NATIVE_ADDRESS) {
      const allowance = await pool.baseToken.allowance(address, pool.address);
      setUserBaseTokenAllowance(allowance);
    }
  };

  const handleApproveAndCycleDeposit = async (token: ERC20, to: string, value: BigNumber) => {
    await token.approve(to, value.toString());
    await Promise.all([updateUserBaseTokenAllowance(), handleCycleDeposit()]);
  };

  const handleCycleDeposit = async () => {
    await pool.depositCycle(position.id);

    toastSuccess(
      `Cycle amount deposited successfully, ${pool.amountCycle} ${pool.baseToken.symbol} worth of ${pool.ybt.symbol} collateral released`
    );
    await Promise.all([
      updateUserBaseTokenBalance(),
      updateUserBaseTokenAllowance(),
      updatePosition(position.id),
    ]);
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          <span>Cycles Deposit</span>
          <img onClick={() => {}} src={infoIcon} alt="" className="w-4 h-4 text-gray-400" />
        </div>
        <div className="px-2.5 py-2 bg-neutral-800 rounded-[33.78px] inline-flex justify-start items-center gap-1.5">
          <div className="justify-start text-neutral-300 text-xs font-normal font-['Outfit'] leading-none">
            Time left: Hardcoded
          </div>
        </div>
      </div>
      <div className="mt-3 mb-4">
        <Input
          disabled={true}
          value={displayAmount(pool.amountCycle)}
          inputTokenSymbol={pool.baseToken.symbol}
          name={""}
          onChange={() => {}}
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

export default PoolDepositTab;
