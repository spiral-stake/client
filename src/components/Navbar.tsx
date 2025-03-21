

import { useChainId } from "wagmi"
import logo from "../assets/logo.svg"
import { chainConfig } from "../config/chainConfig"
import bell from "../assets/bell.svg"

function Navbar() {
  const appChainId = useChainId();

  return (
    <div className="w-full px-16 py-4 border-b-[0.72px] border-white border-opacity-10 inline-flex justify-between items-center">
      <div className="flex-1 flex justify-between items-center">
        <div className="w-[627.50px] flex justify-start items-center gap-28">
          <div className="flex justify-center items-center gap-2">
            <img className="w-10 h-12" src={logo} alt="" />
            <div className="justify-start text-white text-xl font-bold font-['Outfit'] leading-normal">Spiral Stake</div>
          </div>
          <div className="flex justify-start items-center gap-8">
            <div className="flex justify-start items-center gap-1">
              <div className="text-center justify-center text-white text-base font-medium font-['Outfit']">Pools</div>
            </div>
            <div className="flex justify-start items-center gap-1">
              <div className="text-center justify-center text-white text-base font-normal font-['Outfit']">Markets</div>
            </div>
            <div className="text-center justify-center text-white text-base font-normal font-['Outfit']">Learn</div>
          </div>
        </div>
        <div className="flex justify-start items-center gap-3">
          <div className="rounded-full flex justify-center items-center gap-2 overflow-hidden">
            <div className="flex justify-start items-center gap-1">
              <div className="w-5 h-5 relative overflow-hidden">
                <img src={chainConfig[appChainId].logo} alt="" />
              </div>
              <div className="justify-start text-white text-sm font-normal font-['Outfit']">Fraxtal</div>
              <div className="w-4 h-4 ml-2 relative overflow-hidden">
                <img src={bell} alt="" />
              </div>
            </div>
          </div>
          <div data-property-1="Default" className="h-8 p-2 rounded-full flex justify-start items-center gap-1.5 overflow-hidden">
            <div className="inline-flex flex-col justify-start items-start overflow-hidden">
              <div className="bg-white" />
            </div>
          </div>
          <div data-size="Medium" data-state="Default" data-type="Primary" className="h-9 px-4 py-2.5 bg-blue-800 rounded-full flex justify-center items-center gap-2 overflow-hidden">
            <div className="text-center justify-start text-white text-sm font-normal font-['Outfit']">Connect Wallet</div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Navbar
