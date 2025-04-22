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
import cycleIcon from "../assets/icons/cycle.svg";
import collateralIcon from "../assets/icons/Collateral.svg";
import timeIcon from "../assets/icons/Time.svg";
import depositIcon from "../assets/icons/deposit.svg";
import circleIcon from "../assets/icons/circleIcon.svg";
import logo from "../assets/logo.svg";
import Loading from "../components/low-level/Loading";
import CreatePoolInfo from "../components/low-level/CreatePoolInfo";
import BigNumber from "bignumber.js";

const cycleDurations = ["5 mins", "7 mins", "10 mins"]; // changes on prod
const cycleDepositAndBidDurations = ["3 mins", "4 mins", "5 mins", "6 mins", "7 mins"];
const startIntervals = ["5 mins", "7 mins", "10 mins"]; // Needs to change to 5 min instead of 1 min

function CreatePool({
  ybts,
  poolFactory,
  showOverlay,
}: {
  ybts: Ybt[];
  poolFactory: PoolFactory | undefined;
  showOverlay: (overlayComponent: JSX.Element | null | undefined) => void;
}) {
  const [pool, setPool] = useState<PoolInfo>({
    ybt: undefined,
    ybtExchangeRate: undefined,
    amountCollateral: "",
    amountCycle: BigNumber(NaN),
    cycleDuration: cycleDurations[0],
    totalCycles: "",
    startInterval: startIntervals[0],
    cycleDepositAndBidDuration: `${parseInt(cycleDepositAndBidDurations[0])}`,
  });

  const [actionBtn, setActionBtn] = useState({
    text: "",
    onClick: () => {},
    disabled: false,
  });
  const [loading, setLoading] = useState(false);
  const [api, setApi] = useState("");

  const appChainId = useChainId();
  const { chainId } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ybts.length) return;
    setPool({ ...pool, ybt: ybts[0] });

    const updateYbtExchangeRate = async () => {
      const _ybtExchangeRate = await new SY(ybts[0].syToken.address).getYbtExchangeRate(ybts[0]);
      setPool((prevPool) => ({ ...prevPool, ybtExchangeRate: _ybtExchangeRate }));
    };
    updateYbtExchangeRate();
  }, [ybts]);

  useEffect(() => {
    if (!chainId || chainId !== appChainId) return;
    setApi(chainConfig[chainId].api + "/schedule-pool-cronjob");
  }, [chainId]);

  useEffect(() => {
    let {
      amountCollateral,
      amountCycle,
      totalCycles,
      cycleDuration,
      startInterval,
      cycleDepositAndBidDuration,
    } = pool;

    cycleDuration = parseTime(cycleDuration.split(" ")[0], cycleDuration.split(" ")[1]);
    startInterval = parseTime(startInterval.split(" ")[0], startInterval.split(" ")[1]);
    cycleDepositAndBidDuration = parseTime(cycleDepositAndBidDuration, "mins");

    const errors = [
      { condition: !amountCollateral, text: "Invalid YBT Collateral amount" },
      { condition: !amountCycle, text: "Invalid Cycle Amount" },
      {
        condition: !parseInt(totalCycles) || parseInt(totalCycles) < 2,
        text: "Invalid Total Cycles",
      },
      {
        condition: parseInt(cycleDuration) < 120,
        text: "Cycle duration too low",
      },
      {
        condition: parseInt(startInterval) < 60,
        text: "Start interval too low",
      },
      {
        condition:
          parseInt(cycleDepositAndBidDuration) < 60 ||
          parseInt(cycleDepositAndBidDuration) >= parseInt(cycleDuration),
        text: "Bid & Deposit Duration < Cycle Duration",
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

  useEffect(() => {
    if (!loading) return showOverlay(undefined);

    showOverlay(
      <div className="w-full lg:w-[420px]">
        <Loading
          loadingText="Creating Pool"
          loadingTitle="Creating Spiral Pool"
          infoComponent={<CreatePoolInfo poolInfo={pool} />}
        />
      </div>
    );
  }, [loading]);

  const handleYbtChange = async (tokenSymbol: string) => {
    const _ybt = await readYbt(chainId || appChainId, tokenSymbol);
    const _ybtExchangeRate = await new SY(_ybt.syToken.address).getYbtExchangeRate(_ybt);
    setPool({ ...pool, ybt: _ybt, ybtExchangeRate: _ybtExchangeRate });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    let _amountCycle = pool.amountCycle;
    if (pool.ybtExchangeRate && (name === "amountCollateral" || name === "totalCycles")) {
      _amountCycle = BigNumber(1)
        .dividedBy(pool.ybtExchangeRate)
        .multipliedBy(name === "amountCollateral" ? value : pool.amountCollateral)
        .dividedBy(name === "totalCycles" ? value : pool.totalCycles);
    }

    setPool(
      (prevPool) =>
        ({
          ...prevPool,
          [name]: value,
          amountCycle: _amountCycle,
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
      pool.amountCycle.toString(),
      pool.totalCycles,
      cycleDuration,
      cycleDepositAndBidDuration,
      startInterval
    );

    await axios.post(api, { poolAddress, ybt: pool.ybt.symbol, poolChainId: chainId });
    toastSuccess("Pool Created", "Spiral Pool created successfully");
    navigate(`/pools/${poolAddress}?ybt=${pool.ybt.symbol}&poolChainId=${chainId}`);
  };

  return (
    <div className="w-full flex lg:grid grid-cols-2 py-16 gap-10">
      <div className="hidden lg:flex justify-center items-center pr-5">
        {" "}
        <img src={logo} alt="" className="w-64" />
      </div>
      {pool.ybt && (
        <div className="w-full flex flex-col justify-between gap-3 lg:px-10">
          <PageTitle
            title={"Create a Spiral Pool"}
            subheading={"Create pools to access pooled liquidity while maintaining yield exposure"}
          />
          <InputContainer
            label="Yield-bearing Collateral Token (YBT) *"
            condition=""
            errorMsg="Select a Token first"
            labelIcon={circleIcon}
            inputComponent={
              <SelectToken
                tokens={ybts}
                handleTokenChange={handleYbtChange}
                selectedToken={pool.ybt}
              />
            }
          />

          <InputContainer
            label="YBT Collateral Amount*"
            condition=""
            errorMsg="This Feild is compulsary"
            labelIcon={collateralIcon}
            inputComponent={
              <Input
                name={"amountCollateral"}
                onChange={handleInputChange}
                value={pool.amountCollateral}
                inputTokenSymbol={pool.ybt.symbol}
              />
            }
          />

          <InputContainer
            label="Total Cycles / Participants *"
            condition="(>=2 cycles)"
            errorMsg="no of cycles should be >=2 (greater than or equal to 2)"
            labelIcon={cycleIcon}
            inputComponent={
              <Input name={"totalCycles"} onChange={handleInputChange} value={pool.totalCycles} />
            }
          />

          <InputContainer
            label="Per-Cycle Contribution *"
            condition=""
            errorMsg="This Feild is compulsary"
            labelIcon={depositIcon}
            inputComponent={
              <Input
                name={"amountCycle"}
                onChange={handleInputChange}
                value={pool.amountCycle.toFixed(4) === "NaN" ? "0" : pool.amountCycle.toFixed(4)}
                inputTokenSymbol={pool.ybt.baseToken.symbol}
                disabled={true}
              />
            }
          />

          <InputContainer
            label="Cycle Duration *"
            condition=""
            errorMsg="Cycle Duration should be >=7 (greater or equal to 7)"
            labelIcon={timeIcon}
            inputComponent={
              <CustomSelect
                name={"cycleDuration"}
                options={cycleDurations}
                onChange={handleCustomInputChange}
                value={pool.cycleDuration}
              />
            }
          />

          {/* <InputContainer
            label="Cycle Deposit and Bid duration *"
            condition=""
            errorMsg=""
            labelIcon={depositIcon}
            inputComponent={
              <Slider
                name="cycleDepositAndBidDuration"
                value={pool.cycleDepositAndBidDuration}
                onChange={handleInputChange}
                labels={cycleDepositAndBidDurations}
              />
            }
          /> */}
          {/* <InputContainer
            label="Starting in *"
            condition=""
            errorMsg=""
            labelIcon={timeIcon}
            inputComponent={
              <CustomSelect
                name={"startInterval"}
                options={startIntervals}
                onChange={handleCustomInputChange}
                value={pool.startInterval}
              />
            }
          /> */}
          <div className="mt-5">
            <ActionBtn
              text={actionBtn.text}
              onClick={actionBtn.onClick}
              disabled={actionBtn.disabled}
              expectedChainId={appChainId}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatePool;
