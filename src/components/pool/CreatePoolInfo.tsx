const CreatePoolInfo = () => {
  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-4">
      <div className="self-stretch flex flex-col justify-start items-start gap-2">
        <div className="self-stretch inline-flex justify-between items-start">
          <div className="justify-start text-white text-opacity-80 text-xs font-normal font-['Outfit']">
            Token
          </div>
          <div className="flex justify-start items-center gap-1">
            <div className="w-3 h-3 bg-white rounded-[30px]" />
            <div className="text-right justify-start text-white text-xs font-normal font-['Outfit']">
              frxETH
            </div>
          </div>
        </div>
        <div className="self-stretch inline-flex justify-between items-start">
          <div className="justify-start text-white text-opacity-80 text-xs font-normal font-['Outfit']">
            Cycle Amount
          </div>
          <div className="justify-start text-white text-xs font-normal font-['Outfit']">
            01 frxETH
          </div>
        </div>
        <div className="self-stretch inline-flex justify-between items-start">
          <div className="justify-start text-white text-opacity-80 text-xs font-normal font-['Outfit']">
            Total Cycle
          </div>
          <div className="justify-start text-white text-xs font-normal font-['Outfit']">04</div>
        </div>
        <div className="self-stretch inline-flex justify-between items-start">
          <div className="justify-start text-white text-opacity-80 text-xs font-normal font-['Outfit']">
            Cycle Duration
          </div>
          <div className="justify-start text-white text-xs font-normal font-['Outfit']">
            20 Days
          </div>
        </div>
        <div className="self-stretch inline-flex justify-between items-start">
          <div className="justify-start text-white text-opacity-80 text-xs font-normal font-['Outfit']">
            Cycle Deposit and Bid Duration
          </div>
          <div className="justify-start text-white text-xs font-normal font-['Outfit']">2 min</div>
        </div>
        <div className="self-stretch inline-flex justify-between items-start">
          <div className="justify-start text-white text-opacity-80 text-xs font-normal font-['Outfit']">
            Starting time
          </div>
          <div className="justify-start text-white text-xs font-normal font-['Outfit']">
            2 min (18:56:00)
          </div>
        </div>
      </div>
      <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-zinc-900"></div>
      <div className="self-stretch inline-flex justify-between items-start">
        <div className="justify-start text-white text-opacity-80 text-xs font-normal font-['Outfit']">
          Approx collateral
        </div>
        <div className="justify-start text-white text-xs font-normal font-['Outfit']">
          ~4 frxETH
        </div>
      </div>
    </div>
  );
};

export default CreatePoolInfo;
