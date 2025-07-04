/* eslint-disable  @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useCallback } from 'react';
import { ListRole } from './ListRole';
import { AuthorizationTable } from './AuthorizationTable';
import { Role } from '@/types/user-administration';

const mockRoles: Role[] = [
    {
        id: 'admin',
        name: 'Admin',
        assignedTo: 5,
        createdAt: 'Jun 18, 2025'
    },
    {
        id: 'pma',
        name: 'PMA',
        assignedTo: 3,
        createdAt: 'Jun 18, 2025'
    },
    {
        id: 'developer',
        name: 'Developer',
        assignedTo: 15,
        createdAt: 'Jun 18, 2025'
    },
    {
        id: 'cse',
        name: 'CSE',
        assignedTo: 4,
        createdAt: 'Jun 18, 2025'
    },
    {
        id: 'ctv',
        name: 'CTV',
        assignedTo: 5,
        createdAt: 'Jun 18, 2025'
    },
];

export default function UserPermission() {
    const [currentView, setCurrentView] = useState<'list' | 'authorization'>('list');
    const [roles, setRoles] = useState<Role[]>(mockRoles);

    const handleShowAuthorization = useCallback(() => {
        setCurrentView('authorization');
    }, []);

    const handleBackToList = useCallback(() => {
        setCurrentView('list');
    }, []);

    const handleDeleteRole = useCallback((roleId: string) => {
        setRoles(prev => prev.filter(role => role.id !== roleId));
    }, []);

    const handleSavePermissions = useCallback((permissions: any) => {
        console.log('Saving permissions:', permissions);
        setCurrentView('list');
    }, []);

    if (currentView === 'authorization') {
        return (
            <AuthorizationTable
                roles={roles}
                onBack={handleBackToList}
                onSave={handleSavePermissions}
            />
        );
    }

    return (
        <ListRole
            roles={roles}
            onCreateEditRole={handleShowAuthorization}
            onDeleteRole={handleDeleteRole}
        />
    );
}