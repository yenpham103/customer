'use client'
import UserPermission from '@/components/user-administraion/UserPermission';
import Users from '@/components/user-administraion/Users';
import { LegacyCard, LegacyTabs, Page } from '@shopify/polaris'
import React, { useCallback, useState } from 'react'

export default function UserAdministration() {
    const [selected, setSelected] = useState(0);

    const handleTabChange = useCallback(
        (selectedTabIndex: number) => setSelected(selectedTabIndex),
        [],
    );

    const tabs = [
        {
            id: 'users',
            content: 'Users',
            panelID: 'users',
        },
        {
            id: 'user-permission',
            content: 'User Permission',
            panelID: 'user-permission',
        },
    ];

    const renderTabContent = () => {
        switch (selected) {
            case 0:
                return <Users />;
            case 1:
                return <UserPermission />;
            default:
                return null;
        }
    }

    return (
        <Page title='User Administration'>
            <LegacyCard>
                <LegacyTabs
                    tabs={tabs}
                    selected={selected}
                    onSelect={handleTabChange}
                    fitted
                >
                    <LegacyCard.Section>
                        {renderTabContent()}
                    </LegacyCard.Section>
                </LegacyTabs>
            </LegacyCard>
        </Page>
    )
}
