import useSWR from 'swr';
import api from './api';

type Response<T> = {
  data: T | undefined;
  error: any;
  isLoading: boolean;
  mutate: any;
};

const useAPI = <T>(url: string | null, options?: any): Response<T> => {
  const fetcher = async (url: string) => (await api.get<T>(url)).data;

  const { data, error, mutate } = useSWR(url, fetcher, options);

  return {
    data,
    error,
    isLoading: !data && !error,
    mutate,
  };
};

export default useAPI;
