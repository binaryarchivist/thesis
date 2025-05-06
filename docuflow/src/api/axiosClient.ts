import axios from 'axios';
import {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
} from '../contexts/AuthContext';
import AuthApi from './AuthApi';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
console.log("BASE_URL: ", BASE_URL)
const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// attach token
client.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers!['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// handle 401 → try refresh
const onFulfilled = (res: any) => {
  return res;
};
const onRejected = async (err: any) => {
  const orig = err.config;

  if (err.response?.status !== 401 || orig._retry) {
    return Promise.reject(err);
  }

  orig._retry = true;
  const { data } = await AuthApi.refresh(getRefreshToken()!);
  setAccessToken(data.access);
  orig.headers['Authorization'] = `Bearer ${data.access}`;
  return client(orig);
};

client.interceptors.response.use(onFulfilled, onRejected);

export default client;
