import { toast } from "react-hot-toast";
import PopupNotification from "../components/low-level/PopupNotification";

export const toastError = (message: string) => {
  return toast.error(message, {
    position: "top-left",
  });
};

export const toastSuccess = (message: string) => {
  return toast.custom((t)=>(
   <PopupNotification text={message}/>
  ))
};

export const toastInfo = (message: string) => {
  toast(message, {
    position: "top-left",
  });
};
