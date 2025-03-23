import BtnFull from "../low-level/BtnFull";
import Input from "../low-level/Input";
import infoIcon from "../../../assets/Icons/infoIcon.svg";

const PoolDepositTab = () => {
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          <span>Cycles Deposit</span>
          <img src={infoIcon} alt="" className="w-4 h-4 text-gray-400" />
        </div>
        <div className="px-2.5 py-2 bg-neutral-800 rounded-[33.78px] inline-flex justify-start items-center gap-1.5">
          <div className="justify-start text-neutral-300 text-xs font-normal font-['Outfit'] leading-none">
            Time left: 00:01:24
          </div>
        </div>
      </div>
      <div className="mt-3 mb-4">
        <Input />
      </div>
      <div>
        <BtnFull text="Approve and deposit" />
      </div>
    </div>
  );
};

export default PoolDepositTab;
