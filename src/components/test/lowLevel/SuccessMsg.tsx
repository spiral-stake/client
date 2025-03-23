import checkIcon from "../../assets/Icons/check.svg"

const SuccesMsg = () => {
    return ( 
        <div className="self-stretch px-3 py-4 bg-gradient-to-b from-gray-950 to-slate-900 rounded-xl inline-flex justify-center items-center gap-2.5">
    <div className="self-stretch flex justify-start items-center gap-2">
        <div className="w-8 h-8 p-2 bg-blue-800 bg-opacity-10 rounded-[88px] flex justify-center items-center gap-2">
            <div className="w-5 h-5 px-3.5 py-2 bg-blue-800 rounded-[88px] inline-flex flex-col justify-center items-center gap-2">
                <div className="w-2.5 h-2.5 relative overflow-hidden">
                    <img src={checkIcon} className="w-2 h-1.5 left-[1.62px] top-[2.66px] absolute text-white" />
                </div>
            </div>
        </div>
    </div>
    <div className="flex-1 inline-flex flex-col justify-start items-center gap-1">
        <div className="self-stretch justify-start text-white text-sm font-medium font-['Outfit'] leading-tight">02 frxETH deposited successfully.</div>
        <div className="self-stretch justify-start text-white text-opacity-70 text-xs font-normal font-['Outfit'] leading-none">You have successfully deposited in this cycle 2.</div>
    </div>
</div>
     );
}
 
export default SuccesMsg;