import BtnFull from "../low-level/BtnFull";
import Input from "../low-level/Input";

const PoolJoinTab = () => {
  return (
    <div className="w-full">
      <span className="text-xl">YBT Collateral</span>
      {/* <div className="w-full mt-3 mb-2 flex outline outline-1 outline-offset-[-1px] outline-gray-600 outline-opacity-20 py-3 px-3 rounded-md">
            <input type="text" className="flex-grow bg-transparent outline-none text-white text-sm font-normal font-['Outfit'] leading-tight"/>
            <span className="text-sm">frxETH</span>
        </div> */}
      <div className="w-full mt-3 mb-2">
        <Input />
      </div>
      <div className="flex justify-between text-xs font-thin">
        <span>Approx YBT Collateral</span>
        <span>-4.00 frxETH</span>
      </div>
      <div className="w-full mt-4">
        <BtnFull text="Approve and Join" />
      </div>
    </div>
  );
};

export default PoolJoinTab;
