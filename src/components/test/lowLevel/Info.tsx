const Info = ({url}:{url:string}) => {
    return ( 
        <div className="w-36 inline-flex flex-col justify-center items-start gap-2">
    <div className="justify-start text-neutral-200 text-xl font-medium font-['Outfit'] leading-normal">18 Mar, 18:22:08</div>
    <div className="inline-flex justify-start items-center gap-2">
        <div className="w-4 h-4 relative overflow-hidden">
            <img src={url} alt="" />
        </div>
        <div className="justify-start text-neutral-400 text-sm font-normal font-['Outfit']">Start Time</div>
    </div>
</div>
     );
}
 
export default Info;