import axiosClient from './axios-client';

export const authApi = {
    getUserByEmail: (email: string) => {
        return axiosClient.get(`/auth/users/${encodeURIComponent(email)}`);
    },

    createUser: (userData: {
        email: string;
        name: string;
        avatar?: string;
    }) => {
        return axiosClient.post('/auth/users', userData);
    },

    updateUserLastLogin: (userId: string) => {
        return axiosClient.patch(`/auth/users/${userId}/last-login`);
    }
};