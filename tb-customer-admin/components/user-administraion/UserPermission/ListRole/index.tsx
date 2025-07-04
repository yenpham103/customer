'use client';

import { Role } from '@/types/user-administration';
import { formatDate } from '@/utils/storeUtils';
import {
    InlineStack,
    Button,
    IndexTable,
    IndexFilters,
    useSetIndexFiltersMode,
    useIndexResourceState,
    Badge,
    EmptySearchResult,
    Layout,
    Box,
} from '@shopify/polaris';
import { DeleteIcon } from '@shopify/polaris-icons';
import React, { useState, useCallback } from 'react';

interface ListRoleProps {
    roles: Role[];
    onCreateEditRole: () => void;
    onDeleteRole: (roleId: string) => void;
}

export function ListRole({ roles, onCreateEditRole, onDeleteRole }: ListRoleProps) {
    const [queryValue, setQueryValue] = useState('');
    const { mode, setMode } = useSetIndexFiltersMode();

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(queryValue.toLowerCase())
    );

    const resourceIDResolver = (role: Role) => role.id;

    const { selectedResources } = useIndexResourceState(filteredRoles, { resourceIDResolver });

    const handleDeleteRole = useCallback((roleId: string) => {
        onDeleteRole(roleId);
    }, [onDeleteRole]);

    const rowMarkup = filteredRoles.map((role, index) => (
        <IndexTable.Row
            id={role.id}
            key={role.id}
            position={index}
        >
            <IndexTable.Cell>{index + 1}</IndexTable.Cell>
            <IndexTable.Cell>{role.name}</IndexTable.Cell>
            <IndexTable.Cell>
                <Badge tone="info">
                    {role.assignedTo} users
                </Badge>
            </IndexTable.Cell>
            <IndexTable.Cell>{formatDate(role.createdAt)}</IndexTable.Cell>
            <IndexTable.Cell>
                <div onClick={(e) => {
                    e.stopPropagation();
                }}>
                    <Button
                        size="micro"
                        icon={DeleteIcon}
                        tone="critical"
                        onClick={() => handleDeleteRole(role.id)}
                        accessibilityLabel={`Delete ${role.name}`}
                    />

                </div>
            </IndexTable.Cell>
        </IndexTable.Row>
    ));
    const emptyStateMarkup = (
        <EmptySearchResult
            title={'No roles found'}
            description={'Try a different search term or create a new role.'}
            withIllustration
        />
    );
    const bulkActions = [
        {
            content: 'Delete selected roles',
            onAction: () => {
                selectedResources.forEach(roleId => {
                    onDeleteRole(roleId);
                });
            },
        },
    ];

    return (
        <Layout>
            <Layout.Section>
                <InlineStack align="end" blockAlign="center">
                    <Box padding="400" paddingBlockEnd="0">
                        <Button variant="primary" size='large' onClick={onCreateEditRole}>
                            Create/Edit Role
                        </Button>
                    </Box>
                </InlineStack>
                <IndexFilters
                    mode={mode}
                    setMode={setMode}
                    queryValue={queryValue}
                    queryPlaceholder="Search roles by name"
                    onQueryChange={setQueryValue}
                    onQueryClear={() => setQueryValue('')}
                    filters={[]}
                    onClearAll={() => {
                        setQueryValue('');
                    }}
                    tabs={[]}
                    selected={0}
                />

                <IndexTable
                    selectable={false}
                    resourceName={{ singular: 'role', plural: 'roles' }}
                    itemCount={filteredRoles.length ?? 0}
                    emptyState={emptyStateMarkup}
                    headings={[
                        { title: 'No.' },
                        { title: 'Role name' },
                        { title: 'Assigned to' },
                        { title: 'Created at' },
                        { title: 'Actions' }
                    ]}
                    bulkActions={bulkActions}
                    pagination={{
                        hasNext: false,
                        hasPrevious: false,
                        onNext: () => { },
                        onPrevious: () => { },
                    }}
                >
                    {rowMarkup}
                </IndexTable>
            </Layout.Section>
        </Layout>
    );
}