import copyIcon from "../../assets/Icons/copy.svg";

const CopyText = ({ text }: { text: string }) => {
  return (
    <div className="flex items-center">
      <span className="text-xs text-spiral-light-gray">{text}</span>
      <img src={copyIcon} alt="copy" className="ml-1"/>
    </div>
  );
};

export default CopyText;
