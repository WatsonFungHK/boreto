import { useMemo} from 'react';
import useSWR from "swr";
import axiosClient from 'lib/axiosClient';


const fetcher = async ({ url, filters }) => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await axiosClient.get(url + "?" + queryParams);
  return response.data;
};


const useStaffOptions = (callback) => {
  const {
    data: { total, items: staff } = { total: 0, items: [] },
    error,
    // isLoading,
  } = useSWR(
    {
      url: "/api/staff/all",
    },
    fetcher
  );
  const staffOptions = useMemo(() => {
    return callback(staff);
  }, [staff]);

  return staffOptions;
}

export default useStaffOptions