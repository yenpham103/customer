/* eslint-disable  @typescript-eslint/no-explicit-any */
'use client';

import { BADGE_ROLE_STATUS } from '@/constants/admin/common-style';
import { User } from '@/types/user-administration';
import { usersApi } from '@/api-client';
import { 
    Avatar, 
    Badge, 
    BlockStack, 
    Button, 
    ButtonGroup, 
    ChoiceList, 
    EmptySearchResult, 
    IndexFilters, 
    IndexTable, 
    useIndexResourceState, 
    useSetIndexFiltersMode,
    Modal,
    Select,
    Toast
} from '@shopify/polaris';
import { DeleteIcon, EditIcon } from '@shopify/polaris-icons';
import React, { useCallback, useState } from 'react';
import { usePermissions } from '@/hooks/usePermissions';

interface UserTableProps {
    users: User[];
    roles: string[];
    onRefresh: () => void;
}

export default function UserTable({ users, roles, onRefresh }: UserTableProps) {
    const { canManageUsers, isRoot } = usePermissions();
    const [queryValue, setQueryValue] = useState('');
    const [roleFilter, setRoleFilter] = useState<string[]>(['all']);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ active: boolean; message: string; error?: boolean }>({
        active: false,
        message: ''
    });

    const { mode, setMode } = useSetIndexFiltersMode();

    const filteredUsers = users.filter(user => {
        const matchesQuery = user.name.toLowerCase().includes(queryValue.toLowerCase()) ||
            user.email.toLowerCase().includes(queryValue.toLowerCase());
        const matchesRole = roleFilter.includes('all') || 
            (user.role && roleFilter.includes(user.role)) ||
            (!user.role && roleFilter.includes('no-role'));

        return matchesQuery && matchesRole;
    });

    const resourceIDResolver = (user: User) => user._id;
    const { selectedResources, allResourcesSelected, handleSelectionChange } = 
        useIndexResourceState(filteredUsers, { resourceIDResolver });

    const handleAssignRole = useCallback((user: User) => {
        setSelectedUser(user);
        setSelectedRole(user.role || '');
        setIsAssignModalOpen(true);
    }, []);

    const handleDeleteUser = useCallback((user: User) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    }, []);

    const handleConfirmAssignRole = useCallback(async () => {
        if (!selectedUser || !selectedRole) return;

        setLoading(true);
        try {
            const response = await usersApi.updateUserRole(selectedUser._id, selectedRole);
            
            if (response.data.success) {
                setToast({
                    active: true,
                    message: response.data.message || 'Role assigned successfully'
                });
                onRefresh();
            }
        } catch (error: any) {
            setToast({
                active: true,
                message: error.response?.data?.error || 'Failed to assign role',
                error: true
            });
        } finally {
            setLoading(false);
            setIsAssignModalOpen(false);
            setSelectedUser(null);
            setSelectedRole('');
        }
    }, [selectedUser, selectedRole, onRefresh]);

    const handleConfirmDeleteUser = useCallback(async () => {
        if (!selectedUser) return;

        setLoading(true);
        try {
            const response = await usersApi.deleteUser(selectedUser._id);
            
            if (response.data.success) {
                setToast({
                    active: true,
                    message: response.data.message || 'User deleted successfully'
                });
                onRefresh();
            }
        } catch (error: any) {
            setToast({
                active: true,
                message: error.response?.data?.error || 'Failed to delete user',
                error: true
            });
        } finally {
            setLoading(false);
            setIsDeleteModalOpen(false);
            setSelectedUser(null);
        }
    }, [selectedUser, onRefresh]);

    const filters = [
        {
            key: 'role',
            label: 'Role',
            filter: (
                <ChoiceList
                    title="Role"
                    titleHidden
                    choices={[
                        { label: 'All', value: 'all' },
                        { label: 'No Role', value: 'no-role' },
                        ...roles.map(role => ({ label: role, value: role }))
                    ]}
                    selected={roleFilter}
                    onChange={setRoleFilter}
                />
            ),
        }
    ];

    const isRootUser = (user: User) => user.email === 'yenpx@bsscommerce.com';

    const rowMarkup = filteredUsers.map((user, index) => (
        <IndexTable.Row
            id={user._id}
            key={user._id}
            position={index}
            selected={selectedResources.includes(user._id)}
        >
            <IndexTable.Cell>
                <Avatar 
                    name={user.name} 
                    source={user.avatar || ''} 
                    size="sm" 
                />
            </IndexTable.Cell>
            <IndexTable.Cell>
                {user.name}
                {isRootUser(user) && (
                    <Badge tone="info" size="small">Root</Badge>
                )}
            </IndexTable.Cell>
            <IndexTable.Cell>{user.email}</IndexTable.Cell>
            <IndexTable.Cell>
                {user.role ? (
                    <Badge tone={user.role === 'root' ? 'success' : BADGE_ROLE_STATUS[user.role as keyof typeof BADGE_ROLE_STATUS] || 'info'}>
                        {user.role}
                    </Badge>
                ) : (
                    <Badge tone="warning">No Role</Badge>
                )}
            </IndexTable.Cell>
            <IndexTable.Cell>
                {new Date(user.createdAt).toLocaleDateString()}
            </IndexTable.Cell>
            <IndexTable.Cell>
                <div onClick={(e) => e.stopPropagation()}>
                    <ButtonGroup>
                        {canManageUsers && !isRootUser(user) && (
                            <Button
                                size="micro"
                                icon={EditIcon}
                                onClick={() => handleAssignRole(user)}
                                accessibilityLabel={`Edit ${user.name}`}
                            />
                        )}
                        {canManageUsers && !isRootUser(user) && (
                            <Button
                                size="micro"
                                icon={DeleteIcon}
                                tone="critical"
                                onClick={() => handleDeleteUser(user)}
                                accessibilityLabel={`Delete ${user.name}`}
                            />
                        )}
                        {isRootUser(user) && (
                            <Badge tone="info" size="small">Protected</Badge>
                        )}
                    </ButtonGroup>
                </div>
            </IndexTable.Cell>
        </IndexTable.Row>
    ));

    const emptyStateMarkup = (
        <EmptySearchResult
            title={'No users found'}
            description={'Try a different search term or adjust your filters.'}
            withIllustration
        />
    );

    const roleOptions = roles
        .filter(role => role !== 'root')
        .map(role => ({ label: role, value: role }));

    if (!canManageUsers) {
        return (
            <div>
                <p>You dont have permission to manage users. Only Root user can manage users.</p>
            </div>
        );
    }

    return (
        <>
            <BlockStack gap="400">
                <IndexFilters
                    queryValue={queryValue}
                    queryPlaceholder="Search users..."
                    onQueryChange={setQueryValue}
                    onQueryClear={() => setQueryValue('')}
                    filters={filters}
                    onClearAll={() => {
                        setQueryValue('');
                        setRoleFilter(['all']);
                    }}
                    mode={mode}
                    setMode={setMode}
                />

                <IndexTable
                    resourceName={{
                        singular: 'user',
                        plural: 'users',
                    }}
                    itemCount={filteredUsers.length}
                    selectedItemsCount={
                        allResourcesSelected ? 'All' : selectedResources.length
                    }
                    onSelectionChange={handleSelectionChange}
                    headings={[
                        { title: 'Avatar' },
                        { title: 'Name' },
                        { title: 'Email' },
                        { title: 'Role' },
                        { title: 'Created' },
                        { title: 'Actions' },
                    ]}
                    emptyState={emptyStateMarkup}
                >
                    {rowMarkup}
                </IndexTable>
            </BlockStack>

            <Modal
                open={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                title="Assign Role"
                primaryAction={{
                    content: 'Assign',
                    onAction: handleConfirmAssignRole,
                    loading: loading,
                    disabled: !selectedRole
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: () => setIsAssignModalOpen(false),
                    },
                ]}
            >
                <Modal.Section>
                    <BlockStack gap="400">
                        <p>
                            Assign role to <strong>{selectedUser?.name}</strong> ({selectedUser?.email})
                        </p>
                        <Select
                            label="Role"
                            options={roleOptions}
                            value={selectedRole}
                            onChange={setSelectedRole}
                            placeholder="Select a role"
                            helpText="Root role cannot be assigned to other users"
                        />
                    </BlockStack>
                </Modal.Section>
            </Modal>

            <Modal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete User"
                primaryAction={{
                    content: 'Delete',
                    onAction: handleConfirmDeleteUser,
                    loading: loading,
                    destructive: true
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: () => setIsDeleteModalOpen(false),
                    },
                ]}
            >
                <Modal.Section>
                    <p>
                        Are you sure you want to delete <strong>{selectedUser?.name}</strong>? 
                        This action cannot be undone.
                    </p>
                </Modal.Section>
            </Modal>

            {toast.active && (
                <Toast
                    content={toast.message}
                    onDismiss={() => setToast({ active: false, message: '' })}
                    error={toast.error}
                />
            )}
        </>
    );
}