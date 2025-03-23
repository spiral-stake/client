const TokenInput = ({}) => {
    return ( 
        <div className="self-stretch px-3 py-2.5 rounded outline outline-1 outline-offset-[-1px] outline-[#34383E] outline-opacity-20 inline-flex justify-start items-center gap-2 overflow-hidden">
    <div className="flex-1 flex justify-start items-center gap-2">
        <input value={3.5} className="flex-1 justify-start text-white text-sm font-normal font-['Outfit'] bg-transparent outline-none"/>
        <div className="flex-1 text-right justify-start text-stone-50 text-sm font-normal font-['Outfit']">frxETH</div>
    </div>
</div>
     );
}
 
export default TokenInput;