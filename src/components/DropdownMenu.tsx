import BtnFull from "./low-level/BtnFull";
import bellIcon from "../assets/bell.svg";
import fraxIcon from "../assets/Icons/frax.svg";
import arrowIcon from "../assets/Icons/arrowDown.svg";
import close from "../assets/Icons/close.svg";
import ConnectWalletBtn from "./ConnectWalletButton";

const DropdownMenu = ({ showDropdown }: { showDropdown: (bool: boolean) => void }) => {
  return (
    // <div className="w-full self-stretch px-4 pt-4 pb-8 inline-flex flex-col items-center gap-6">
    <div className="self-stretch h-[100vh] relative flex flex-col justify-between items-center p-5 ">
      <div className="w-full flex flex-col justify-start items-start gap-4">
        <div className="w-full mb-10">
          <img src={close} alt="" onClick={() => showDropdown(false)} className="cursor-pointer" />
        </div>
        <div className="self-stretch pt-2 pb-4 border-b border-gray-200 border-opacity-10 flex flex-col justify-center items-start gap-3">
          <div className="self-stretch inline-flex justify-between items-center">
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-3">
              <div className="justify-center text-neutral-200 text-sm font-['Outfit'] cursor-pointer">
                Pools
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch pt-2 pb-4 border-b border-gray-200 border-opacity-10 flex flex-col justify-center items-start gap-3">
          <div className="self-stretch inline-flex justify-between items-center">
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-3">
              <div className="justify-center text-neutral-200 text-sm font-['Outfit'] cursor-pointer">
                Markets
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch pt-2 pb-4 border-b border-gray-200 border-opacity-10 flex flex-col justify-center items-start gap-3">
          <div className="self-stretch inline-flex justify-between items-center">
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-3">
              <div className="justify-center text-neutral-200 text-sm font-['Outfit'] cursor-pointer">
                Learn
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col  items-start gap-6">
        <div className="cursor-pointer self-stretch p-1 rounded-full inline-flex justify-center items-center gap-2 overflow-hidden">
          <div className="flex-1 flex justify-start items-center gap-2">
            <div className="w-5 h-5 relative overflow-hidden">
              <img src={bellIcon} alt="" />
            </div>
            <div className="flex-1 justify-start text-white text-sm font-normal font-['Outfit']">
              Notifications
            </div>
            <div className="w-7 h-4 relative -rotate-90 overflow-hidden">
              <img src={arrowIcon} alt="" />
            </div>
          </div>
        </div>
        <div className="cursor-pointer self-stretch p-1 rounded-full inline-flex justify-center items-center gap-2 overflow-hidden">
          <div className="flex-1 flex justify-start items-center gap-2">
            <div className="w-6 h-6 relative overflow-hidden">
              <img src={fraxIcon} alt="" />
            </div>
            <div className="flex-1 justify-start text-white text-sm font-normal font-['Outfit']">
              Fraxtal
            </div>
            <div className="w-7 h-4 relative -rotate-90 overflow-hidden">
              <img src={arrowIcon} alt="" />
            </div>
          </div>
        </div>
        <div className="w-full mb-3">
          <ConnectWalletBtn />
        </div>
      </div>
    </div>
    // </div>
  );
};

export default DropdownMenu;
