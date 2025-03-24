import Skeleton from "react-loading-skeleton";
import { Cycle } from "../../types";
import TagGray from "../low-level/TagGray";
import TagGreen from "../low-level/TagGreen";
import TagRed from "../low-level/TagRed";
import TagYellow from "../low-level/TagYellow";
import TextLoading from "../low-level/textLoading";

const PoolState = ({ state, currentCycle, totalCycles, positionsFilled, totalPositions }: { state: string | undefined, currentCycle: Cycle | undefined, totalCycles: number, positionsFilled: number, totalPositions: number }) => {
    const renderPoolState = () => {
        if (state === "WAITING") {
            return <TagYellow text={positionsFilled === totalPositions ? "Pool is filled" : `Waiting ${positionsFilled}/${totalPositions}`} />
        } else if (state === "DISCARDED") {
            return <TagRed text={"Pool Discarded"} />
        } else if (state === "LIVE") {
            return <TagGreen text={`Current cycle ${currentCycle?.count}/${totalCycles}`} />
        } else if (state === "ENDED") {
            return <TagGray text={"Pool is Ended"} />
        }
    }

    return state ? renderPoolState() : <TextLoading />

}

export default PoolState;