import { Link } from "react-router-dom";
import BtnFull from "./BtnFull";
import Tag from "./Tag";

const CycleFinalzedTab = ({
  icon,
  title,
  msg,
  tokenAmount,
  txLink,
  btnText,
  btnOnClick,
  btnDisabled,
  countdownMsg,
  countdown,
}: {
  tokenAmount: string;
  msg: string;
  title: string;
  icon: string;
  txLink?: string;
  btnText?: string;
  btnOnClick?: () => void;
  btnDisabled?: boolean;
  countdownMsg: string;
  countdown: string;
}) => {
  return (
    <div className="w-full flex flex-col gap-8 bg-gradient-to-b from-slate-900 to-gray-950 rounded-xl p-1">
      <div className="flex flex-col items-center gap-4 p-6">
        <img src={icon} alt="" className="w-24 h-24" />
        <div className="flex flex-col gap-6 py-3">
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold mb-3">{title}</span>
            <span className="text-xs font-light">{msg}</span>
            <span className="text-md text-green-600">{tokenAmount}</span>
          </div>
          <div className="">
            {btnText && btnOnClick && (
              <BtnFull
                text={btnText}
                onClick={btnOnClick}
                disabled={btnDisabled}
              />
            )}
            {txLink && (
              <Link target="blank" to={txLink}>
                <div className="cursor-pointer text-center">{txLink}</div>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6 p-2">
        <span>{countdownMsg}</span>
        <Tag color="green" text={countdown} />
      </div>
    </div>
  );
};

export default CycleFinalzedTab;
