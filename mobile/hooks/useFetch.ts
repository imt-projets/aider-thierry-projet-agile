import { useEffect, useState } from "react";

type FetchResult<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  status: number | null;
  refetch: () => void;
};

export function useFetch<T = any>(endpoint: string, options?: RequestInit): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [reloadIndex, setReloadIndex] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(endpoint, options);
        setStatus(response.status);
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result?.message || "Erreur réseau");
        }
        
        setData(result);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, options, reloadIndex]);

  const refetch = () => setReloadIndex(prev => prev + 1);

  return { data, loading, error, status, refetch };
}