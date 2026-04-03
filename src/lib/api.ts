import axios from 'axios';
import { toast } from '@/lib/toast';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status !== 401) {
      const message = error.response?.data?.message || error.message || '오류가 발생했습니다.';
      toast.error(message);
    }
    return Promise.reject(error);
  }
);
