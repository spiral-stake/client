import Tag from "./Tag";
import TextLoading from "./TextLoading";
import BtnFull from "./BtnFull";

const WaitTab = ({
  icon,
  title,
  msg,
  countdown,
  countdownTitle,
  btnText,
  btnOnClick,
  btnDisabled,
}: {
  icon?: string;
  title: string;
  msg: string | undefined;
  countdown?: string;
  countdownTitle?: string;
  btnText?: string;
  btnOnClick?: () => void;
  btnDisabled?: boolean;
}) => {
  return (
    <div className="self-stretch p-1 inline-flex flex-col justify-start items-start gap-5">
      <div className="self-stretch p-3 bg-gradient-to-b from-slate-900 to-gray-950 min-h-[250px] rounded-xl flex flex-col justify-center items-center gap-8">
        <div className="self-stretch inline-flex justify-center items-center">
          <div className="flex-1 inline-flex flex-col justify-start items-center gap-3">
            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <div className="flex-1 h-0" />
              <img src={icon} alt="" />
              <div className="flex-1 inline-flex flex-col justify-start items-start gap-2" />
            </div>
            <div className="self-stretch flex flex-col justify-start items-center gap-6">
              <div className="self-stretch flex flex-col justify-start items-center gap-2">
                <div className="self-stretch text-center justify-start text-white text-base font-medium font-['Outfit'] leading-normal">
                  {title}
                </div>

                <div className="w-64 text-center justify-start">
                  <span className="text-white text-opacity-70 text-xs font-normal font-['Outfit'] leading-none">
                    {msg ? msg : <TextLoading lineCount={2} />}
                  </span>
                </div>
              </div>
              {btnText && btnOnClick && (
                <BtnFull text={btnText} onClick={btnOnClick} disabled={btnDisabled} />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch p-2 rounded-xl inline-flex justify-between items-center">
        {countdown && countdownTitle && (
          <div className="flex-1 flex justify-center items-center gap-2.5">
            <div className="flex-1 justify-start text-white text-sm font-medium font-['Outfit'] leading-tight">
              {countdownTitle}
            </div>

            <Tag color="green" text={countdown.toString()} />
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitTab;
