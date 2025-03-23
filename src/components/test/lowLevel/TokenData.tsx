import CopyText from "./CopyText";
import groupIcon from "../../assets/Icons/Group.svg"

const TokenData = () => {
    return ( 
        <div className="inline-flex justify-end items-center gap-3">
    <img src={groupIcon} alt="" />
    <div className="inline-flex flex-col justify-start items-start gap-1">
        <div className="justify-center text-neutral-200 text-xl font-medium font-['Outfit']">frxETH</div>
        <CopyText text={"0x5554443333333222"}/>
    </div>
</div>
     );
}
 
export default TokenData;