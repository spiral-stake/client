import closeIcon from "../../assets/Icons/close.svg"
import checkIcon from "../../assets/Icons/check.svg"

const Loading = () => {
    return ( 
        <div className="w-96 px-4 pt-4 pb-6 bg-gradient-to-b from-slate-900 to-gray-950 rounded-xl outline outline-1 outline-offset-[-1px] outline-gray-800 inline-flex flex-col justify-start items-center gap-6">
    <div className="self-stretch rounded-full inline-flex justify-center items-center gap-2 overflow-hidden">
        <div className="flex-1 flex justify-start items-center gap-2">
            <div className="flex-1 justify-start text-white text-xl font-normal font-['Outfit']">Create a Spiral Pool</div>
            <img src={closeIcon} alt="" />
        </div>
    </div>
    <div className="self-stretch flex flex-col justify-start items-start gap-6">
        <div className="self-stretch inline-flex justify-center items-center">
            <div className="flex-1 inline-flex flex-col justify-start items-center gap-1">
                <div className="self-stretch inline-flex justify-start items-center">
                    <div className="flex-1 self-stretch"/>
                    <div className="w-8 h-8 p-2 bg-blue-800 bg-opacity-10 rounded-[88px] flex justify-center items-center gap-2">
                        <div className="w-5 h-5 px-3.5 py-2 bg-blue-800 rounded-[88px] inline-flex flex-col justify-center items-center gap-2">
                                <img src={checkIcon} alt="" />
                        </div>
                    </div>
                    <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch h-0 outline outline-2 outline-offset-[-1px] outline-blue-800" />
                    </div>
                </div>
                <div className="self-stretch text-center justify-start text-white text-xs font-medium font-['Outfit'] leading-none">Creating Pool</div>
            </div>
            <div className="flex-1 inline-flex flex-col justify-start items-center gap-1">
                <div className="self-stretch inline-flex justify-start items-center">
                    <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch h-0 outline outline-2 outline-offset-[-1px] outline-gray-700" />
                    </div>
                    <div className="w-8 h-8 p-2 rounded-[88px] flex justify-center items-center gap-2">
                        <div className="w-7 h-7 px-3.5 py-2 rounded-[88px] outline outline-1 outline-offset-[-0.89px] outline-gray-700 inline-flex flex-col justify-center items-center gap-2">
                            <div className="w-2 h-2 bg-gray-700 rounded-[88px]" />
                        </div>
                    </div>
                    <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch h-0 outline outline-2 outline-offset-[-1px] outline-gray-700" />
                    </div>
                </div>
                <div className="self-stretch text-center justify-start text-white text-opacity-70 text-xs font-normal font-['Outfit'] leading-none">Sign Request</div>
            </div>
            <div className="flex-1 inline-flex flex-col justify-start items-center gap-1">
                <div className="self-stretch inline-flex justify-start items-center">
                    <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch h-0 outline outline-2 outline-offset-[-1px] outline-gray-700" />
                    </div>
                    <div className="w-8 h-8 p-2 rounded-[88px] flex justify-center items-center gap-2">
                        <div className="w-7 h-7 px-3.5 py-2 rounded-[88px] outline outline-1 outline-offset-[-0.89px] outline-gray-700 inline-flex flex-col justify-center items-center gap-2">
                            <div className="w-2 h-2 bg-gray-700 rounded-[88px]" />
                        </div>
                    </div>
                    <div className="flex-1 inline-flex flex-col justify-start items-start gap-2" />
                </div>
                <div className="self-stretch text-center justify-start text-white text-opacity-70 text-xs font-normal font-['Outfit'] leading-none">Completed</div>
            </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch inline-flex justify-between items-start">
                    <div className="justify-start text-white text-opacity-80 text-xs font-normal font-['Outfit']">Token</div>
                    <div className="flex justify-start items-center gap-1">
                        <div className="w-3 h-3 bg-white rounded-[30px]" />
                        <div className="text-right justify-start text-white text-xs font-normal font-['Outfit']">frxETH</div>
                    </div>
                </div>
                <div className="self-stretch inline-flex justify-between items-start">
                    <div className="justify-start text-white text-opacity-80 text-xs font-normal font-['Outfit']">Cycle Amount</div>
                    <div className="justify-start text-white text-xs font-normal font-['Outfit']">01 frxETH</div>
                </div>
                <div className="self-stretch inline-flex justify-between items-start">
                    <div className="justify-start text-white text-opacity-80 text-xs font-normal font-['Outfit']">Total Cycle</div>
                    <div className="justify-start text-white text-xs font-normal font-['Outfit']">04</div>
                </div>
                <div className="self-stretch inline-flex justify-between items-start">
                    <div className="justify-start text-white text-opacity-80 text-xs font-normal font-['Outfit']">Cycle Duration</div>
                    <div className="justify-start text-white text-xs font-normal font-['Outfit']">20 Days</div>
                </div>
                <div className="self-stretch inline-flex justify-between items-start">
                    <div className="justify-start text-white text-opacity-80 text-xs font-normal font-['Outfit']">Cycle Deposit and Bid Duration</div>
                    <div className="justify-start text-white text-xs font-normal font-['Outfit']">2 min</div>
                </div>
                <div className="self-stretch inline-flex justify-between items-start">
                    <div className="justify-start text-white text-opacity-80 text-xs font-normal font-['Outfit']">Starting time</div>
                    <div className="justify-start text-white text-xs font-normal font-['Outfit']">2 min (18:56:00)</div>
                </div>
            </div>
            <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-zinc-900"></div>
            <div className="self-stretch inline-flex justify-between items-start">
                <div className="justify-start text-white text-opacity-80 text-xs font-normal font-['Outfit']">Approx collateral</div>
                <div className="justify-start text-white text-xs font-normal font-['Outfit']">~4 frxETH</div>
            </div>
        </div>
    </div>
</div>
     );
}
 
export default Loading;