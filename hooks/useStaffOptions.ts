import { useMemo} from 'react';
import useSWR from "swr";
import axiosClient from 'lib/axiosClient';


const fetcher = async ({ url, filters }) => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await axiosClient.get(url + "?" + queryParams);
  return response.data;
};

const defaultRender = (staffItems) => staffItems.map(({ id, first_name, last_name, department }) => {
  return {
    value: id,
    label: first_name + " " + last_name + " / " + department?.name,
  };
});


const useStaffOptions = (callback: (staff: unknown[]) => unknown[]= defaultRender) => {
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