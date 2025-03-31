import { Cycle } from "../../types";
import Tag from "./Tag";

const CycleGlobe = ({currentCycle}:{currentCycle:Cycle|undefined}) => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 w-[1783px] h-[1783px] rounded-full transition-transform duration-1000 flex justify-around items-start">
  
  {/* Marker for 10:30 position */}
  <div className="absolute top-1/2 left-1/2 origin-center flex flex-col items-center gap-2"
       style={{ transform: 'translateX(-520px) translateY(-762px)' }}>
       <div className={`w-6 h-6 p-1 bg-${currentCycle?.count==1?"blue":"gray"}-600 rounded-full bg-opacity-15`}><div className={`w-4 h-4 bg-${currentCycle?.count==1?"blue":"gray"}-600 rounded-full`}></div></div>
       <div className="w-full text-center">Cycle 1</div>
       <div className="w-full"><Tag color={`${currentCycle?.count==1?"green":"gray"}`} dot={false} text={`${currentCycle?.count==1?currentCycle.endTime:"00:00:00"}`}/></div>
  </div>
  
  {/* Marker for 1:30 position */}
  <div className="absolute top-1/2 left-1/2 origin-center flex flex-col items-center gap-2"
       style={{ transform: 'translateX(440px) translateY(-762px)' }}>
       <div className="w-6 h-6 p-1 bg-blue-600 rounded-full bg-opacity-15"><div className="w-4 h-4 bg-blue-600 rounded-full"></div></div>
       <div className="w-full text-center">Cycle 2</div>
       <div className="w-full"><Tag color={`${currentCycle?.count==2?"green":"gray"}`} dot={false} text={`${currentCycle?.count==2?currentCycle.endTime:"00:00:00"}`}/></div>
  </div>
</div>
  );
};

export default CycleGlobe;
