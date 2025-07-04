import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const BASE_URl = process.env.NEXT_PUBLIC_API_URL
const axiosClient = axios.create({
    baseURL: BASE_URl,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

axiosClient.interceptors.request.use(
    async (config) => {
        try {
            if (typeof window !== 'undefined') {
                const session = await getSession();
                if (session?.user?.email) {
                    config.headers['x-user-email'] = session.user.email;
                    config.headers['x-user-name'] = session.user.name;
                    config.headers['x-user-role'] = session.user.role;
                } else {
                    console.warn('⚠️ No session found');
                }
            } else {
                console.warn('⚠️ Server-side request, skipping session injection');
            }
        } catch (error) {
            console.error('❌ Error getting session:', error);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;

        if (status === 401) {
            if (typeof window !== 'undefined') {
                await signOut({ callbackUrl: '/' });
            }
            return Promise.reject(error);
        }

        if (status === 403) {
            if (typeof window !== 'undefined') {
                window.location.href = '/unauthorized';
            }
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);
export default axiosClient;