/* eslint-disable  @typescript-eslint/no-explicit-any */
import axiosClient from './axios-client';

export const permissionsApi = {
    getPermissions: () => {
        return axiosClient.get('/permissions');
    },

    getPermissionByRole: (role: string) => {
        return axiosClient.get(`/permissions/${role}`);
    },

    createPermission: (permissionData: any) => {
        return axiosClient.post('/permissions', permissionData);
    },

    updatePermission: (role: string, permissionData: any) => {
        return axiosClient.put(`/permissions/${role}`, permissionData);
    },

    deletePermission: (role: string) => {
        return axiosClient.delete(`/permissions/${role}`);
    },

    batchUpdatePermissions: (permissionsData: any) => {
        return axiosClient.patch('/permissions/batch', permissionsData);
    }
};