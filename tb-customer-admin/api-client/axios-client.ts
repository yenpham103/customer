import axios from 'axios';
import { signOut } from 'next-auth/react';

const BASE_URl = process.env.NEXT_PUBLIC_API_URL
const axiosClient = axios.create({
    baseURL: BASE_URl,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await signOut({ callbackUrl: '/' });
            return Promise.reject(error);
        }

        if (error.response?.status === 403) {
            if (typeof window !== 'undefined') {
                window.location.href = '/dashboard';
            }
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default axiosClient;