import axiosClient from "./axios-client";

export const usersApi = {
    getUsers: (params: {
        page?: number;
        limit?: number;
        role?: string;
        search?: string;
    } = {}) => {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.set('page', params.page.toString());
        if (params.limit) queryParams.set('limit', params.limit.toString());
        if (params.role) queryParams.set('role', params.role);
        if (params.search) queryParams.set('search', params.search);

        return axiosClient.get(`/users?${queryParams}`);
    },

    getUserById: (userId: string) => {
        return axiosClient.get(`/users/${userId}`);
    },

    updateUserRole: (userId: string, role: string) => {
        return axiosClient.patch(`/users/${userId}/role`, { role });
    },

    deleteUser: (userId: string) => {
        return axiosClient.delete(`/users/${userId}`);
    }
};
