import { useEffect, useState } from "react";
import PoolFactory from "../contract-hooks/PoolFactory";
import { PoolInfo, Ybt } from "../types";
import { chainConfig } from "../config/chainConfig";
import SY from "../contract-hooks/SY";
import { readYbt } from "../config/contractsData";
import { useAccount, useChainId } from "wagmi";
import { useNavigate } from "react-router-dom";
import { toastSuccess } from "../utils/toastWrapper";
import axios from "axios";
import { parseTime } from "../utils/time";
import { handleAsync } from "../utils/handleAsyncFunction";
import PageTitle from "../components/low-level/PageTitle";
import InputContainer from "../components/low-level/InputContainer";
import Input from "../components/low-level/Input";
import SelectToken from "../components/low-level/SelectToken";
import CustomSelect from "../components/low-level/CustomSelect";
import Slider from "../components/low-level/Slider";
import ActionBtn from "../components/ActionBtn";

const cycleDurations = ["2 mins", "7 mins", "10 mins"];
const cycleDepositAndBidDurations = ["1 min", "2 mins", "3 mins", "4 mins", "5 mins"];
const startIntervals = ["2 min", "5 min", "10 min"];

function CreatePool({ ybts, poolFactory }: { ybts: Ybt[]; poolFactory: PoolFactory | undefined }) {
  const [pool, setPool] = useState<PoolInfo>({
    ybt: undefined,
    ybtExchangeRate: undefined,
    amountCycle: "",
    cycleDuration: cycleDurations[0],
    // cycleDurationUnit: "minutes",
    totalCycles: "",
    startInterval: startIntervals[0],
    // startIntervalUnit: "minutes",
    cycleDepositAndBidDuration: "1",
    // cycleDepositAndBidDurationUnit: "minutes",
  });

  const [actionBtn, setActionBtn] = useState({ text: "", onClick: () => {}, disabled: false });
  const [loading, setLoading] = useState(false);
  const [api, setApi] = useState("");

  const appChainId = useChainId();
  const { address, chainId } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ybts.length) return;
    setPool({ ...pool, ybt: ybts[0] });
  }, [ybts]);

  useEffect(() => {
    if (!chainId || chainId !== appChainId) return;
    setApi(chainConfig[chainId].api + "/schedule-pool-cronjob");
  }, [chainId]);

  useEffect(() => {
    let { amountCycle, totalCycles, cycleDuration, startInterval, cycleDepositAndBidDuration } =
      pool;

    cycleDuration = parseTime(cycleDuration.split(" ")[0], cycleDuration.split(" ")[1]);
    startInterval = parseTime(startInterval.split(" ")[0], startInterval.split(" ")[1]);
    cycleDepositAndBidDuration = parseTime(cycleDepositAndBidDuration, "mins");

    const errors = [
      { condition: !amountCycle, text: "Invalid Cycle Amount" },
      {
        condition: !parseInt(totalCycles) || parseInt(totalCycles) < 2,
        text: "Invalid Total Cycles",
      },
      { condition: parseInt(cycleDuration) < 120, text: "Cycle duration too low" },
      { condition: parseInt(startInterval) < 60, text: "Start interval too low" },
      {
        condition:
          parseInt(cycleDepositAndBidDuration) < 60 ||
          parseInt(cycleDepositAndBidDuration) >= parseInt(cycleDuration),
        text: "Invalid Pool Deposit and Bid duration",
      },
    ];

    const error = errors.find((err) => err.condition);

    if (error) {
      return setActionBtn({
        ...actionBtn,
        disabled: true,
        text: error.text,
      });
    }

    return setActionBtn({
      disabled: false,
      text: "Create Spiral Pool",
      onClick: handleAsync(
        () => handleCreatePool(cycleDuration, cycleDepositAndBidDuration, startInterval),
        setLoading
      ),
    });
  }, [pool]);

  const handleYbtChange = async (tokenSymbol: string) => {
    const _ybt = await readYbt(chainId || appChainId, tokenSymbol);
    const _ybtExchangeRate = await new SY(_ybt.syToken.address).getYbtExchangeRate(_ybt);
    setPool({ ...pool, ybt: _ybt, ybtExchangeRate: _ybtExchangeRate });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setPool(
      (prevPool) =>
        ({
          ...prevPool,
          [name]: value,
        } as typeof pool)
    );
  };

  const handleCustomInputChange = (name: string, value: string) => {
    setPool(
      (prevPool) =>
        ({
          ...prevPool,
          [name]: value,
        } as typeof pool)
    );
  };

  const handleCreatePool = async (
    cycleDuration: string,
    cycleDepositAndBidDuration: string,
    startInterval: string
  ) => {
    if (!poolFactory) return;
    if (!pool.ybt) return;

    const poolAddress = await poolFactory.createSpiralPool(
      pool.ybt.syToken,
      pool.ybt.baseToken,
      pool.amountCycle,
      pool.totalCycles,
      cycleDuration,
      cycleDepositAndBidDuration,
      startInterval
    );

    await axios.post(api, { poolAddress });
    toastSuccess("Spiral Pool created successfully");
    navigate(`/pools/${poolAddress}?ybt=${pool.ybt.symbol}&poolChainId=${chainId}`);
  };

  return (
    pool.ybt && (
      <div>
        <PageTitle title={"Create a Spiral Pool"} subheading={"Create pools to enjoy Liquidity"} />
        <InputContainer
          inputComponent={
            <SelectToken
              tokens={ybts}
              handleTokenChange={handleYbtChange}
              selectedToken={pool.ybt}
            />
          }
        />
        <InputContainer
          inputComponent={
            <Input
              name={"amountCycle"}
              onChange={handleInputChange}
              value={pool.amountCycle}
              inputTokenSymbol={pool.ybt.baseToken.symbol}
            />
          }
        />
        <InputContainer
          inputComponent={
            <Input name={"totalCycles"} onChange={handleInputChange} value={pool.totalCycles} />
          }
        />
        <InputContainer
          inputComponent={
            <CustomSelect
              name={"cycleDuration"}
              options={cycleDurations}
              onChange={handleCustomInputChange}
              value={pool.cycleDuration}
            />
          }
        />
        <InputContainer
          inputComponent={
            <Slider
              name="cycleDepositAndBidDuration"
              value={pool.cycleDepositAndBidDuration}
              onChange={handleInputChange}
              labels={cycleDepositAndBidDurations}
            />
          }
        />
        <InputContainer
          inputComponent={
            <CustomSelect
              name={"startInterval"}
              options={startIntervals}
              onChange={handleCustomInputChange}
              value={pool.startInterval}
            />
          }
        />
        <ActionBtn
          text={actionBtn.text}
          onClick={actionBtn.onClick}
          disabled={actionBtn.disabled}
          expectedChainId={appChainId}
        />
      </div>
    )
  );
}

export default CreatePool;
