import { toastError, toastSuccess } from "./toastWrapper";

export const handleAsync = (fn, setLoading) => {
  return async (...args) => {
    setLoading(true); // Start loading state before the async function
    try {
      const result = await fn(...args);
      return result;
    } catch (error) {
      console.log(error); // Need to remove before production
      toastError(error.shortMessage || "Something went wrong");
    } finally {
      setLoading(false); // End loading state after function completion or error
    }
  };
};
