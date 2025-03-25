const BtnFull = ({
  text,
  onClick,
  disabled,
}: {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="bg-spiral-blue text-xs text-white px-3 py-2 rounded-full outline-none w-full disabled:bg-neutral-700 disabled:bg-opacity-50 disabled:text-zinc-500"
    >
      {text}
    </button>
  );
};

export default BtnFull;
