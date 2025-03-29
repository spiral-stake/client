import { useEffect, useRef } from "react";

export const usePolling = (callback: () => void, intervalInSeconds: number) => {
  const callbackRef = useRef(callback);

  // Always point to latest callback without causing effect re-runs
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    const tick = () => callbackRef.current();
    const timer = setInterval(tick, intervalInSeconds * 1000);
    return () => clearInterval(timer);
  }, []);
};
