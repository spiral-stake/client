
const Input = ({name,placeholder,value,onChange,disabled,autoFocus,inputTokenSymbol}:{name:string,label:string,placeholder:string,value:string,onChange:()=>void,disabled:boolean,autoFocus:boolean,inputTokenSymbol:string}) => {
    return ( 
        <div className="w-full px-3 py-2.5 rounded outline outline-1 outline-offset-[-1px] outline-[#34383E] outline-opacity-20 inline-flex justify-start items-center gap-2 overflow-hidden">
    <div className="flex-1 flex justify-start items-center gap-2">
        <input value={value} placeholder={placeholder} name={name} className="flex-1 justify-start text-white text-sm font-normal font-['Outfit'] bg-transparent outline-none"/>
        <div className="flex-1 text-right justify-start text-stone-50 text-sm font-normal font-['Outfit']">frxETH</div>
    </div>
</div>
     );
}
 
export default Input;