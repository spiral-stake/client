const Btn = ({ text, onClick, disabled }: { text: string | undefined, onClick: () => void, disabled?: boolean }) => {
  return (
    <button disabled={disabled} onClick={onClick} className="bg-spiral-blue text-xs text-white px-3 py-2 rounded-full outline-none ">
      {text}
    </button>
  );
};

export default Btn;
