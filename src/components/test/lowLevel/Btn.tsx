const Btn = ({ text }: { text: string }) => {
  return (
    <button className="bg-spiral-blue text-xs text-white px-3 py-2 rounded-full outline-none ">
      {text}
    </button>
  );
};

export default Btn;
