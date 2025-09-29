import { useState, useEffect } from "react";

export const useIsOnline = (url: string, intervalMs = 5000) => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  const checkOnline = async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(url, { method: "HEAD", signal: controller.signal });
      clearTimeout(timeout);

      setIsOnline(res.ok);
    } catch {
      setIsOnline(false);
    }
  };

  useEffect(() => {
    checkOnline(); // check on mount
    const interval = setInterval(checkOnline, intervalMs);
    return () => clearInterval(interval);
  }, [url]);

  return isOnline;
};
