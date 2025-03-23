const TagGreen = ({text}:{text:string}) => {
    return ( 
        <div className="px-2.5 py-1 bg-stone-900 rounded-[33.78px] inline-flex justify-start items-center gap-1.5">
    <div className="w-[5px] h-[5px] bg-green-600 rounded-full outline outline-1 outline-green-800 outline-opacity-40" />
    <div className="justify-start text-green-400 text-sm font-normal font-['Outfit']">{text}</div>
</div>
     );
}
 
export default TagGreen;