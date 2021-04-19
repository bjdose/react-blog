import { useState, useEffect } from 'react';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchData = async () => {
      const response = await fetch(url, { signal: abortCont.signal });
      if (!response.ok) throw new Error('Fetch request failed');
      const data = await response.json();
      setData(data);
    };

    const timeout = setTimeout(() => {
      fetchData()
        .then(() => {
          setIsPending(false);
          setError(null);
        })
        .catch((error) => {
          if (error.name !== 'AbortError') {
            setIsPending(false);
            setError(error.message);
          }
        })
        .finally(() => {
          clearTimeout(timeout);
        });
    }, 1000);

    return () => abortCont.abort();
  }, [url]);

  return { data, isPending, error };
};

export default useFetch;
