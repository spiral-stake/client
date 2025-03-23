//hard coded array with key value pair key-statr time value-it's value
import timeIcon from "../../assets/Icons/Time.svg";
import collateral from "../../assets/Icons/Collateral.svg";
import coin from "../../assets/Icons/coin.svg";
import cycle from "../../assets/Icons/cycle.svg";
import deposit from "../../assets/Icons/deposit.svg";

import Info from "../low-level/Info";

const PoolInfoTab = () => {
  const items = [
    { symbol: timeIcon, title: "start time", value: "18 Mar,18:22:08" },
    { symbol: collateral, title: "Collateral", value: "04 frxETH" },
    { symbol: coin, title: "Cycle Amount", value: "01 frxETH" },
    { symbol: cycle, title: "Total Cycles", value: "02" },
    { symbol: timeIcon, title: "Cycle Duration", value: "20 Days" },
    { symbol: deposit, title: "Deposit Window", value: "5 Days" },
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
