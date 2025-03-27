import { useEffect, useState } from "react";
import Pool from "../../contract-hooks/Pool";
import { Position } from "../../types";
import BtnFull from "../low-level/BtnFull";
import Input from "../low-level/Input";
import PoolRouter from "../../contract-hooks/PoolRouter";
import BigNumber from "bignumber.js";
import { useAccount } from "wagmi";
import { handleAsync } from "../../utils/handleAsyncFunction";
import { toastSuccess } from "../../utils/toastWrapper";
import { displayTokenAmount } from "../../utils/displayTokenAmounts.ts";
import WaitTab from "../low-level/WaitTab";
import waitIcon from "../../assets/Icons/wait.svg";
import successIcon from "../../assets/Icons/success.svg";

const PoolJoinTab = ({
  pool,
  allPositions,
  position,
  getAllPositions,
  setLoading,
}: {
  pool: Pool;
  allPositions: Position[];
  position: Position | undefined;
  getAllPositions: () => void;
  setLoading: (bool: boolean) => void;
}) => {
  const ybtCollateral = pool.ybt;

  const [poolRouter, setPoolRouter] = useState<PoolRouter>();
  const [amountYbtCollateral, setAmountYbtCollateral] = useState<BigNumber>();
  const [userYbtCollateralBalance, setUserYbtCollateralBalance] = useState<BigNumber>();
  const [userYbtCollateralAllowance, setUserYbtCollateralAllowance] = useState<BigNumber>();
  const [actionBtn, setActionBtn] = useState({ text: "", onClick: () => {}, disabled: false });

  const { address } = useAccount() as { address: `0x${string}` };

  useEffect(() => {
    const getPoolRouter = async () => {
      const _poolRouter = await PoolRouter.createInstance(pool);
      setPoolRouter(_poolRouter);
    };

    const getAmountCollateral = async () => {
      setAmountYbtCollateral(undefined);

      const _amountCollateral = await pool.getAmountCollateral();
      setAmountYbtCollateral(_amountCollateral);
    };

    getPoolRouter();
    getAmountCollateral();
  }, []);

  useEffect(() => {
    if (!address || !poolRouter) return;

    updateUserYbtCollateralBalance();
    updateUserYbtCollateralAllowance();
  }, [address, poolRouter]);

  useEffect(() => {
    if (!amountYbtCollateral) return;

    const updatingActionBtn = () => {
      if (userYbtCollateralBalance?.isLessThan(amountYbtCollateral)) {
        return setActionBtn({
          ...actionBtn,
          text: `Insufficient ${ybtCollateral.symbol} Balance`,
          disabled: true,
        });
      }

      if (userYbtCollateralAllowance?.isGreaterThanOrEqualTo(amountYbtCollateral)) {
        return setActionBtn({
          text: "Join Pool",
          disabled: false,
          onClick: handleAsync(handleJoin, setLoading),
        });
      }

      return setActionBtn({
        text: `Approve and Join`,
        disabled: userYbtCollateralBalance?.isLessThan(amountYbtCollateral) ? true : false,
        onClick: handleAsync(handleApproveAndJoin, setLoading),
      });
    };

    updatingActionBtn();
  }, [
    userYbtCollateralBalance,
    userYbtCollateralAllowance,
    allPositions,
    amountYbtCollateral,
    position,
  ]);

  const updateUserYbtCollateralBalance = async () => {
    const balance = await ybtCollateral.balanceOf(address as `0x${string}`);
    setUserYbtCollateralBalance(balance);
  };

  const updateUserYbtCollateralAllowance = async () => {
    if (!poolRouter) return;
    const allowance = await ybtCollateral.allowance(address, poolRouter.address);
    setUserYbtCollateralAllowance(allowance);
  };

  const handleApproveAndJoin = async () => {
    if (!poolRouter || !amountYbtCollateral) return;

    await ybtCollateral.approve(poolRouter.address, amountYbtCollateral.toString());
    await Promise.all([updateUserYbtCollateralAllowance(), handleJoin()]);
  };

  const handleJoin = async () => {
    if (!poolRouter || !amountYbtCollateral) return;

    await poolRouter.depositYbtCollateral(address, amountYbtCollateral);

    toastSuccess("Joined the pool successfully");
    await Promise.all([
      updateUserYbtCollateralBalance(),
      updateUserYbtCollateralAllowance(),
      getAllPositions(),
    ]);
  };

  return allPositions.length < pool.totalPositions ? (
    !position ? (
      <div className="w-full">
        <span className="text-xl">YBT Collateral</span>
        <div className="w-full mt-3 mb-2">
          {amountYbtCollateral ? (
            <Input
              name={"YBT Collateral"}
              autoFocus={true}
              disabled={true}
              inputTokenSymbol={pool.ybt.symbol}
              value={displayTokenAmount(amountYbtCollateral)}
              onChange={() => {}}
            />
          ) : (
            <>Loading...</>
          )}
        </div>
        <div className="flex justify-between text-xs font-thin">
          <span>Approx YBT Collateral</span>
          <span>~{`${pool.amountCollateralInBase} ${pool.baseToken.symbol}`}</span>
        </div>
        <div className="w-full mt-4">
          <BtnFull
            disabled={actionBtn.disabled}
            onClick={actionBtn.onClick}
            text={actionBtn.text}
          />
        </div>
      </div>
    ) : (
      <WaitTab
        icon={waitIcon}
        title={"Waiting for Participants"}
        msg={
          amountYbtCollateral &&
          `You have participated in this pool and deposited your collateral of ${displayTokenAmount(
            amountYbtCollateral,
            pool.ybt.symbol
          )}`
        }
      />
    )
  ) : (
    <WaitTab
      icon={waitIcon}
      title={"Pool Starting In"}
      msg={`You have participated in this pool and deposited your collateral of ${
        amountYbtCollateral && displayTokenAmount(amountYbtCollateral, pool.ybt.symbol)
      }`}
    />
  );
};

export default PoolJoinTab;
