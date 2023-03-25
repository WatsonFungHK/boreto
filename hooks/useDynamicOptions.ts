import { useMemo} from 'react';
import useSWR from "swr";
import axiosClient from '../lib/axiosClient';


const fetcher = async ({ url, filters }) => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await axiosClient.get(url + "?" + queryParams);
  return response.data;
};


const useDynamicOptions = (type: string, callback: Function) => {
  const {
    data: { total, items } = { total: 0, items: [] },
    error,
    // isLoading,
  } = useSWR(
    {
      url: `/api/${type}/all`,
    },
    fetcher
  );
  const options = useMemo(() => {
    return callback(items);
  }, [items]);

  return options;
}

export default useDynamicOptions