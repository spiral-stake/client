import { toast } from "react-hot-toast";

export const toastError = (message: string) => {
  return toast.error(message, {
    position: "top-left",
  });
};

export const toastSuccess = (message: string) => {
  return toast.success(message, {
    position: "top-left",
    duration: 400,
  });
};

export const toastInfo = (message: string) => {
  toast(message, {
    position: "top-left",
  });
};
