//hard coded array with key value pair key-statr time value-it's value
import timeIcon from "../assets/Icons/Time.svg";
import collateral from "../assets/Icons/Collateral.svg";
import coin from "../assets/Icons/coin.svg";
import cycle from "../assets/Icons/cycle.svg";
import deposit from "../assets/Icons/deposit.svg";

import Info from "./low-level/Info";
import Pool from "../contract-hooks/Pool";
import { formatTime, getLocalTimeFromTimestamp } from "../utils/time";
import { displayTokenAmount } from "../utils/displayTokenAmounts";

const PoolInfoTab = ({ pool }: { pool: Pool }) => {
  const poolStartTime = getLocalTimeFromTimestamp(pool.startTime);
  const poolCycleDuration = formatTime(pool.cycleDuration);
  const poolDepositAndBidDuration = formatTime(pool.cycleDepositAndBidDuration);

  const items = [
    {
      symbol: timeIcon,
      title: "Start Time",
      value: `${poolStartTime.formattedDate}, ${poolStartTime.formattedTime}`,
    },
    {
      symbol: collateral,
      title: "Collateral",
      value: `~ ${displayTokenAmount(pool.amountCollateralInBase, pool.baseToken)} `,
    },
    {
      symbol: coin,
      title: "Cycle Amount",
      value: `${displayTokenAmount(pool.amountCycle, pool.baseToken)} `,
    },
    { symbol: cycle, title: "Total Cycles", value: `${pool.totalCycles}` },
    {
      symbol: timeIcon,
      title: "Cycle Duration",
      value: `${poolCycleDuration.value} ${poolCycleDuration.unit}`,
    },
    {
      symbol: deposit,
      title: "Deposit Window",
      value: `${poolDepositAndBidDuration.value} ${poolDepositAndBidDuration.unit}`,
    },
  ];

  return (
    <div className="grid grid-cols-2  lg:flex justify-around my-5 mx-5 ">
      {items.map((item, key) => (
        <div className="mb-5 flex justify-center items-center">
          {key !== 0 && (
            <div
              className={` ${
                key % 2 == 0
                  ? "hidden"
                  : "w-0 h-6 mr-6 outline outline-[1.50px] outline-offset-[-0.75px] outline-gray-800"
              } `}
            ></div>
          )}
          <Info symbol={item.symbol} title={item.title} value={item.value} />
        </div>
      ))}
    </div>
  );
};

export default PoolInfoTab;
