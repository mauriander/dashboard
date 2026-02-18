import { useEffect } from "react";

export function usePolling(callback, intervalMs, enabled = true) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    callback();
    const interval = setInterval(callback, intervalMs);

    return () => {
      clearInterval(interval);
    };
  }, [callback, intervalMs, enabled]);
}
