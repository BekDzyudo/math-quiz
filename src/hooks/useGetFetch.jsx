import { useEffect, useState, useCallback } from "react";

export function useGetFetch(url) {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 soniya

    const fetchData = async () => {
      setIsPending(true);
      setError(null);
      try {
        const req = await fetch(url, { signal: controller.signal });
        if (!req.ok) {
          throw new Error(req.statusText);
        }
        const data = await req.json();
        setData(data);
      } catch (err) {
        if (err.name === "AbortError") {
          setError("Internet sust yoki serverga ulanib bo'lmadi. Sahifani yangilang.");
        } else if (!navigator.onLine) {
          setError("Internet aloqasi yo'q. Ulanishni tekshiring.");
        } else {
          setError(err.message);
        }
        console.log(err.message);
      } finally {
        clearTimeout(timeoutId);
        setIsPending(false);
      }
    };
    fetchData();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [url, refreshKey]);

  const refetch = useCallback(() => setRefreshKey(k => k + 1), []);

  return { data, isPending, error, refetch };
}
