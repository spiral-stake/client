import { useEffect, useState } from "react";
import PoolFactory from "../contract-hooks/PoolFactory"
import { PoolInfo, Ybt } from "../types/types"
import { chainConfig } from "../config/chainConfig";
import SY from "../contract-hooks/SY";
import { readYbt } from "../config/contractsData";
import { useAccount, useChainId } from "wagmi";
import { useNavigate } from "react-router-dom";
import { toastSuccess } from "../utils/toastWrapper";
import axios from "axios";
import { parseTime } from "../utils/time";
import { handleAsync } from "../utils/handleAsyncFunction";

function CreatePool({ ybts, poolFactory, setSwitchingNetwork }: { ybts: Ybt[], poolFactory: PoolFactory | undefined, setSwitchingNetwork: (value: boolean) => void }) {
  const [pool, setPool] = useState<PoolInfo>({
    ybt: undefined,
    ybtExchangeRate: undefined,
    amountCycle: "",
    cycleDuration: "",
    cycleDurationUnit: "minutes",
    totalCycles: "",
    startInterval: "",
    startIntervalUnit: "minutes",
    cycleDepositAndBidDuration: "",
    cycleDepositAndBidDurationUnit: "minutes",
  });

  const [actionBtn, setActionBtn] = useState({ text: "", onClick: () => { }, disabled: false });
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
    if (!chainId) return;
    setApi(chainConfig[chainId].api + "/schedule-pool-cronjob");
  }, [chainId]);

  useEffect(() => {
    let {
      amountCycle,
      totalCycles,
      cycleDuration,
      cycleDurationUnit,
      startInterval,
      startIntervalUnit,
      cycleDepositAndBidDuration,
      cycleDepositAndBidDurationUnit,
    } = pool;

    cycleDuration = parseTime(cycleDuration, cycleDurationUnit);
    startInterval = parseTime(startInterval, startIntervalUnit);
    cycleDepositAndBidDuration = parseTime(
      cycleDepositAndBidDuration,
      cycleDepositAndBidDurationUnit
    );

    const errors = [
      { condition: !amountCycle, text: "Invalid Cycle Amount" },
      { condition: parseInt(totalCycles) < 2, text: "Invalid Total Cycles" },
      { condition: parseInt(cycleDuration) < 120, text: "Cycle duration too low" },
      { condition: parseInt(startInterval) < 60, text: "Start interval too low" },
      {
        condition: parseInt(cycleDepositAndBidDuration) < 60,
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
        () =>
          handleCreatePool(),
        setLoading
      ),
    });
  }, [pool]);

  const handleYbtChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const _ybt = await readYbt(chainId || appChainId, e.target.value);
    const _ybtExchangeRate = await new SY(_ybt.syToken.address).getYbtExchangeRate(_ybt);
    setPool({ ...pool, ybt: _ybt, ybtExchangeRate: _ybtExchangeRate });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof typeof pool;
    const value = isNaN(parseFloat(e.target.value)) ? e.target.value : parseFloat(e.target.value);

    setPool(prevPool => ({
      ...prevPool,
      [name]: value,
    }) as typeof pool); // Assert as correct type
  };

  const handleCreatePool = async () => {
    if (!poolFactory) return
    if (!pool.ybt) return

    const poolAddress = await poolFactory.createSpiralPool(
      pool.ybt.syToken,
      pool.ybt.baseToken,
      pool.amountCycle,
      pool.totalCycles,
      pool.cycleDuration,
      pool.cycleDepositAndBidDuration,
      pool.startInterval
    );

    await axios.post(api, { poolAddress });
    toastSuccess("Spiral Pool created successfully");
    navigate(`/pools/${poolAddress}?ybt=${pool.ybt.symbol}&poolChainId=${chainId}`);
  };

  return (
    <div>
    </div>
  )
}

export default CreatePool
