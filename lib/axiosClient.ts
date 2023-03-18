import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.API_URL,
});

axiosClient.defaults.headers.common = {
  'Content-Type': 'application/json',
};

export default axiosClient;