import { useState, useCallback } from 'react';
import { parseApiError } from '../utils/errorHandler';

/**
 * Custom hook for making API calls with loading and error states
 * 
 * Usage:
 * const { data, loading, error, execute } = useApi(complaintService.getStudentComplaints);
 * 
 * useEffect(() => {
 *   execute(studentId);
 * }, [studentId, execute]);
 */
export const useApi = (apiFunction, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        const parsedError = parseApiError(err);
        setError(parsedError);
        throw parsedError;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  return {
    data,
    loading,
    error,
    execute,
    reset: () => {
      setData(null);
      setLoading(false);
      setError(null);
    },
  };
};
