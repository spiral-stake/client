import logo from "../../../assets/logo.svg";

const Position = ({winningCycle}:{winningCycle:number}) => {
  return (
    <div className="inline-flex flex-col">
    <div
      data-size="sm"
      data-type="Closed"
      className="inline-flex flex-col justify-start items-center  gap-2 outline outline-1 outline-offset-1 outline-gray-700 rounded-lg"
    >
      <div className="self-stretch p-2.5 bg-gradient-to-b from-zinc-900 to-gray-950 rounded-md outline outline-[0.62px] outline-offset-[-0.62px] outline-gray-950 inline-flex justify-start items-center gap-2 overflow-hidden">
        <div className="text-xs">
          <span>Position NFT</span>
          <div className="px-3 py-0.5 bg-white bg-opacity-10 rounded-[20.72px] inline-flex justify-center items-center gap-2 overflow-hidden ml-1">
            <div className="text-xs">You</div>
          </div>
          <div className="w-full flex justify-center items-center my-8 px-12">
            <img src={logo} alt="" className="h-14 w-14 opacity-50"/>
          </div>
          <div className="flex flex-col gap-2">
            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <div className="text-center justify-center text-white text-opacity-60 text-[10px] font-normal font-['Outfit'] leading-none">
                ID : 02
              </div>
            </div>
            <div className="self-stretch inline-flex justify-start items-center gap-[3.07px]">
              <div className="text-center justify-center text-white text-opacity-60 text-[10px] font-normal font-['Outfit'] leading-none">
                Owner : -
              </div>
            </div>
            <div className="self-stretch justify-center text-white text-opacity-60 text-[10px] font-normal font-['Outfit'] leading-none">
              YBT Yield : 0 frxETH
            </div>
            <div className="self-stretch justify-center text-white text-opacity-60 text-[10px] font-normal font-['Outfit'] leading-none">
              Spiral Yield : 0 frxETH
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="text-center mt-3 text-xs">
      <span className="">{winningCycle?`Winner of Cycle ${winningCycle}`:"NF"}</span>
    </div>

    </div>

  );
};

export default Position;
