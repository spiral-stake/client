const TagGray = ({ text }: { text: string }) => {
    return (
        <div className="px-2.5 py-1 bg-zinc-400 bg-opacity-20 rounded-[33.78px] inline-flex justify-start items-center gap-1.5">
            <div className="w-[5px] h-[5px] bg-neutral-400 rounded-full outline outline-1 outline-neutral-700 outline-opacity-40" />
            <div className="justify-start text-neutral-500 text-sm font-normal font-['Outfit']">{text}</div>
        </div>
    );
}

export default TagGray;