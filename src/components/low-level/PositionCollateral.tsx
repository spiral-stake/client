import infoIcon from "../../assets/icons/infoIcon.svg"

const PositionCollaretal = () => {
    return ( 
        <div className="self-stretch px-3 py-2 bg-white bg-opacity-10 rounded-xl inline-flex flex-col justify-start items-start gap-3">
    <div className="self-stretch inline-flex justify-start items-center gap-2">
        <div className="inline-flex justify-start items-center gap-1">
            <div>My Collateral</div>
            <div className="inline-flex flex-col justify-start items-start overflow-hidden">
                <img src={infoIcon} alt="" className="w-3 h-3"/>
            </div>
        </div>
    </div>
    <div className="self-stretch inline-flex justify-start items-center gap-3">
        <div className="flex-1 inline-flex flex-col justify-center items-start">
            <div className="justify-start text-neutral-200 text-xs font-medium font-['Outfit'] leading-normal">04 frxETH</div>
            <div className="text-xs inline-flex justify-start items-center gap-1 text-neutral-400 font-light">
                Deposited
            </div>
        </div>
        <div className="w-6 h-0 origin-top -rotate-90 outline outline-1 outline-offset-[-0.50px] outline-gray-800"></div>
        <div className="flex-1 inline-flex flex-col justify-center items-start">
            <div className="justify-start text-neutral-200 text-xs font-medium font-['Outfit'] leading-normal">02 frxETH</div>
            <div className="text-xs inline-flex justify-start items-center gap-1 text-neutral-400 font-light">
                Remaining
            </div>
        </div>
        <div className="w-6 h-0 origin-top -rotate-90 outline outline-1 outline-offset-[-0.50px] outline-gray-800"></div>
        <div className="flex-1 inline-flex flex-col justify-center items-start">
            <div className="justify-start text-neutral-200 text-xs font-medium font-['Outfit'] leading-normal">02 frxETH</div>
            <div className="text-xs inline-flex justify-start items-center gap-1 text-neutral-400 font-light">
                Widthdrawn
            </div>
        </div>
    </div>
</div>
     );
}
 
export default PositionCollaretal;