import { useMemo} from 'react';
import useSWR from "swr";
import axiosClient from '../lib/axiosClient';


const fetcher = async ({ url, filters }) => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await axiosClient.get(url + "?" + queryParams);
  return response.data;
};


const useProductOptions = (callback) => {
  const {
    data: { total, items: products } = { total: 0, items: [] },
    error,
    isLoading,
  } = useSWR(
    {
      url: "/api/product/all",
    },
    fetcher
  );
  const options = useMemo(() => {
    const _products = products.sort((a, b) => {
      const categoryNameA = a.category.name.toUpperCase();
      const categoryNameB = b.category.name.toUpperCase();
  
      if (categoryNameA < categoryNameB) {
        return -1;
      }
      if (categoryNameA > categoryNameB) {
        return 1;
      }
      return 0;
    });
    return callback(_products);
  }, [products]);

  return { options, isLoading, error};
}

export default useProductOptions