/* eslint-disable  @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { Page, Card, BlockStack, SkeletonBodyText, Banner } from '@shopify/polaris';
import { usersApi, rolesApi } from '@/api-client';
import { User } from '@/types/user-administration';
import { usePermissions } from '@/hooks/usePermissions';
import UserTable from './UserTable';

export default function Users() {
    const { canViewPage, canManageUsers } = usePermissions();
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const [usersResponse, rolesResponse] = await Promise.all([
                usersApi.getUsers({ page: 1, limit: 100 }),
                rolesApi.getRoles()
            ]);

            if (usersResponse.data.success) {
                setUsers(usersResponse.data.data.users);
            }

            if (rolesResponse.data.success) {
                setRoles(rolesResponse.data.data);
            }

        } catch (err: any) {
            console.error('Fetch users/roles error:', err);
            setError(err.response?.data?.error || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (canViewPage('user-administration')) {
            fetchUsers();
        }
    }, [refreshKey, canViewPage]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    if (!canViewPage('user-administration')) {
        return (
            <Page title="Users">
                <Banner tone="critical">
                    <p>You do not have permission to view this page.</p>
                </Banner>
            </Page>
        );
    }

    if (loading) {
        return (
            <Page title="Users">
                <Card>
                    <BlockStack gap="400">
                        <SkeletonBodyText lines={10} />
                    </BlockStack>
                </Card>
            </Page>
        );
    }

    if (error) {
        return (
            <Page title="Users">
                <Banner tone="critical">
                    <p>{error}</p>
                </Banner>
            </Page>
        );
    }

    return (
        <Page title="Users">
            {!canManageUsers && (
                <Banner tone="info">
                    <p>View-only mode. Only Root user can manage users.</p>
                </Banner>
            )}
            <Card>
                <UserTable 
                    users={users} 
                    roles={roles}
                    onRefresh={handleRefresh}
                />
            </Card>
        </Page>
    );
}