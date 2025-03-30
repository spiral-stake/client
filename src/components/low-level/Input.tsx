import TextLoading from "./TextLoading";

const Input = ({
  name,
  placeholder,
  value,
  onChange,
  disabled,
  autoFocus,
  inputTokenSymbol,
}: {
  name: string;
  placeholder?: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  inputTokenSymbol?: string;
}) => {
  return (
    <div className="w-full px-3 py-2.5 rounded outline outline-1 outline-offset-[-1px] outline-[#34383E] outline-opacity-20 inline-flex justify-start items-center gap-2 overflow-hidden">
      <div className="flex-1 flex justify-start items-center gap-2">
        {disabled && !value ? (
          <TextLoading width={21} />
        ) : (
          <input
            autoFocus={autoFocus}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            name={name}
            className="flex-1 justify-start text-white text-sm font-normal font-['Outfit'] bg-transparent outline-none"
          />
        )}
        <div className="text-right justify-start text-stone-50 text-sm font-normal font-['Outfit']">
          {inputTokenSymbol}
        </div>
      </div>
    </div>
  );
};

export default Input;
