import { toast } from "react-hot-toast";
import PopupNotification from "../components/low-level/PopupNotification";
import errorIcon from "../assets/icons/errorSmall.svg"

export const toastError = (message: string) => {
  return toast.custom(()=> (
    <PopupNotification icon={errorIcon} link="" text={message} title="010 sfrxETH 03"/>
  ));
};

export const toastSuccess = (message: string) => {
  return toast.custom(()=>(
    <PopupNotification icon={errorIcon} link="" text={message} title="010 sfrxETH 03"/>
  ))
};

export const toastInfo = (message: string) => {
  return toast.custom(()=>(
    <PopupNotification icon={errorIcon} link="" text={message} title="010 sfrxETH 03"/>
  ))
};
