'use client';

import { PagePermission, Role, RolePermissions } from '@/types/user-administration';
import {
    BlockStack,
    InlineStack,
    Button,
    Checkbox,
    Box,
    Divider,
    Text,
    Collapsible,
    Layout,
} from '@shopify/polaris';
import { ChevronDownIcon, ChevronUpIcon, ArrowLeftIcon } from '@shopify/polaris-icons';
import React, { useState, useCallback } from 'react';

const pages: PagePermission[] = [
    { id: 'dashboard', name: 'Dashboard', hasCollapsible: true },
    { id: 'conversations', name: 'Conversations', hasCollapsible: true },
    { id: 'operators', name: 'Operators', hasCollapsible: true },
    { id: 'store-data', name: 'Store Data', hasCollapsible: true },
    { id: 'user-administration', name: 'User Administration', hasCollapsible: true }
];

interface AuthorizationTableProps {
    roles: Role[];
    onBack: () => void;
    onSave: (permissions: RolePermissions) => void;
}

export function AuthorizationTable({ roles, onBack, onSave }: AuthorizationTableProps) {
    const [permissions, setPermissions] = useState<RolePermissions>({});
    const [expandedPages, setExpandedPages] = useState<{ [pageId: string]: boolean }>({});

    const handlePagePermissionChange = useCallback((roleId: string, pageId: string, checked: boolean) => {
        setPermissions(prev => {
            const newPermissions = { ...prev };
            if (!newPermissions[roleId]) {
                newPermissions[roleId] = {};
            }

            if (checked) {
                newPermissions[roleId] = {
                    ...newPermissions[roleId],
                    [pageId]: true,
                    [`${pageId}-view`]: true,
                    [`${pageId}-edit`]: true
                };
            } else {
                newPermissions[roleId] = {
                    ...newPermissions[roleId],
                    [pageId]: false,
                    [`${pageId}-view`]: false,
                    [`${pageId}-edit`]: false
                };
            }

            return newPermissions;
        });
    }, []);

    const handleSubPermissionChange = useCallback((
        roleId: string,
        pageId: string,
        type: 'view' | 'edit',
        checked: boolean
    ) => {
        setPermissions(prev => {
            const newPermissions = { ...prev };
            if (!newPermissions[roleId]) {
                newPermissions[roleId] = {};
            }

            const permissionKey = `${pageId}-${type}`;

            if (type === 'view') {
                newPermissions[roleId] = {
                    ...newPermissions[roleId],
                    [permissionKey]: checked
                };

                if (!checked) {
                    newPermissions[roleId][`${pageId}-edit`] = false;
                    newPermissions[roleId][pageId] = false;
                }
            } else if (type === 'edit') {
                if (checked) {
                    newPermissions[roleId] = {
                        ...newPermissions[roleId],
                        [`${pageId}-view`]: true,
                        [permissionKey]: true
                    };
                } else {
                    newPermissions[roleId] = {
                        ...newPermissions[roleId],
                        [permissionKey]: false,
                        [pageId]: false
                    };
                }
            }

            const hasView = newPermissions[roleId][`${pageId}-view`];
            const hasEdit = newPermissions[roleId][`${pageId}-edit`];
            newPermissions[roleId][pageId] = hasView && hasEdit;

            return newPermissions;
        });
    }, []);

    const handleExpandToggle = useCallback((pageId: string) => {
        setExpandedPages(prev => ({
            ...prev,
            [pageId]: !prev[pageId]
        }));
    }, []);

    const handleSave = useCallback(() => {
        onSave(permissions);
    }, [permissions, onSave]);

    const isPermissionChecked = (roleId: string, pageId: string): boolean => {
        return permissions[roleId]?.[pageId] || false;
    };

    return (
        <Layout sectioned>
            <Layout.Section>
                <BlockStack gap="200">
                    <Box padding="400">
                        <InlineStack align="space-between" blockAlign="center">
                            <InlineStack gap="300" blockAlign="center">
                                <Button
                                    icon={ArrowLeftIcon}
                                    variant="secondary"
                                    size='large'
                                    onClick={onBack}
                                />
                                <Text as="h2" variant="headingLg">
                                    Authorization Table
                                </Text>
                            </InlineStack>
                            <Button variant="primary" size='large' onClick={handleSave}>
                                Save
                            </Button>
                        </InlineStack>
                    </Box>

                    <Box padding="400">
                        <Box paddingBlockEnd="300">
                            <InlineStack gap="0">
                                <Box width="200px">
                                    <Text as="span" variant="headingXs" fontWeight="semibold">
                                        Role Permission
                                    </Text>
                                </Box>
                                {roles.map(role => (
                                    <Box key={role.id} width="120px">
                                        <InlineStack align="center">
                                            <Text as="span" variant="headingXs" fontWeight="semibold">
                                                {role.name}
                                            </Text>
                                        </InlineStack>
                                    </Box>
                                ))}
                                <Box width="60px">
                                    <InlineStack align="center">
                                        <Text as="span" variant="headingXs" fontWeight="semibold">
                                            +
                                        </Text>
                                    </InlineStack>
                                </Box>
                            </InlineStack>
                        </Box>

                        <Divider />

                        <BlockStack gap="0">
                            {pages.map((page, index) => {
                                const isExpanded = expandedPages[page.id];
                                const isLastPage = index === pages.length - 1;

                                return (
                                    <React.Fragment key={page.id}>
                                        <Box paddingBlock="300">
                                            <InlineStack gap="0" blockAlign="center">
                                                <Box width="200px">
                                                    <InlineStack gap="200" blockAlign="center">
                                                        <Text as="span" variant="bodyMd" fontWeight="medium">
                                                            {page.name}
                                                        </Text>
                                                        {page.hasCollapsible && (
                                                            <Button
                                                                variant="plain"
                                                                icon={isExpanded ? ChevronUpIcon : ChevronDownIcon}
                                                                onClick={() => handleExpandToggle(page.id)}
                                                                size="micro"
                                                            />
                                                        )}
                                                    </InlineStack>
                                                </Box>
                                                {roles.map(role => (
                                                    <Box key={role.id} width="120px">
                                                        <InlineStack align="center">
                                                            <Checkbox
                                                                label=""
                                                                checked={isPermissionChecked(role.id, page.id)}
                                                                onChange={(checked) => handlePagePermissionChange(role.id, page.id, checked)}
                                                            />
                                                        </InlineStack>
                                                    </Box>
                                                ))}
                                                <Box width="60px" />
                                            </InlineStack>
                                        </Box>
                                        <Collapsible
                                            open={isExpanded}
                                            id={`${page.id}-permissions`}
                                            transition={{ duration: '200ms', timingFunction: 'ease-in-out' }}
                                        >
                                                <BlockStack gap="300">
                                                    <InlineStack gap="0" blockAlign="center">
                                                        <Box width="200px">
                                                            <Box paddingInlineStart="200">
                                                                <Text as="span" variant="bodySm" tone="subdued">
                                                                    View
                                                                </Text>
                                                            </Box>
                                                        </Box>
                                                        {roles.map(role => (
                                                            <Box key={role.id} width="120px">
                                                                <InlineStack align="center">
                                                                    <Checkbox
                                                                        label=""
                                                                        checked={isPermissionChecked(role.id, `${page.id}-view`)}
                                                                        onChange={(checked) => handleSubPermissionChange(role.id, page.id, 'view', checked)}
                                                                    />
                                                                </InlineStack>
                                                            </Box>
                                                        ))}
                                                        <Box width="60px" />
                                                    </InlineStack>

                                                    <InlineStack gap="0" blockAlign="center">
                                                        <Box width="200px">
                                                            <Box paddingInlineStart="200">
                                                                <Text as="span" variant="bodySm" tone="subdued">
                                                                    Add/Edit
                                                                </Text>
                                                            </Box>
                                                        </Box>
                                                        {roles.map(role => (
                                                            <Box key={role.id} width="120px">
                                                                <InlineStack align="center">
                                                                    <Checkbox
                                                                        label=""
                                                                        checked={isPermissionChecked(role.id, `${page.id}-edit`)}
                                                                        onChange={(checked) => handleSubPermissionChange(role.id, page.id, 'edit', checked)}
                                                                    />
                                                                </InlineStack>
                                                            </Box>
                                                        ))}
                                                    </InlineStack>
                                                </BlockStack>
                                        </Collapsible>

                                        {!isLastPage && (
                                            <Box paddingBlock="200">
                                                <Divider />
                                            </Box>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </BlockStack>
                    </Box>
                </BlockStack>
            </Layout.Section>
        </Layout>
    );
}