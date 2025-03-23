
import warningIcon from "../../assets/Icons/warning.svg" 
import WaitTab from "../low-level/WaitTab";

const PoolReedemTab = () => {
    return ( <>
    <WaitTab icon={warningIcon} title="You win!" msg={`Remaining YBT collateral - ${"hardcoded"}`} countdownTitle="Pool cycyle 2 is staring in" countdown={"2m:52s"}/>
    </> );
}
 
export default PoolReedemTab;