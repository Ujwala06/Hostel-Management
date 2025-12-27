// hooks/useAsync.js
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  const execute = useCallback(async (...args) => {
    setStatus('pending');
    try {
      const res = await asyncFunction(...args);
      setData(res);
      setStatus('success');
      return res;
    } catch (err) {
      setError(err);
      setStatus('error');
      throw err;
    }
  }, [asyncFunction]);
  
  useEffect(() => {
    if (immediate) execute();
  }, [execute, immediate]);
  
  return { execute, status, data, error };
};
