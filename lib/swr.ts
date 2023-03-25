import useSWR from 'swr';
import axiosClient from './axiosClient';

export const fetcher = async ({ url, query }) => {
  const queryParams = new URLSearchParams(query).toString();
  const response = await axiosClient.get(url + "?" + queryParams);
  return response.data;
};


export const useItems = (url: string, query: any = {}) => {
  return useSWR({
    url,
    query
  }, fetcher)
}

export const getItem = async (url: string) => {
  const response = await axiosClient.get(url);
  return response.data;
};

export const upsertItem = async (url: string, item: any) => {
  const response = await axiosClient.post(url, item);
  return response.data;
};