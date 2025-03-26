const PopupNotification = ({ text ,icon}:{text:string,icon:string}) => {
  return <div className="bg-yellow-400">{icon}{text}</div>;
};

export default PopupNotification;
