import axiosClient from './axios-client';

export const rolesApi = {
    getRoles: () => {
        return axiosClient.get('/roles');
    }
};