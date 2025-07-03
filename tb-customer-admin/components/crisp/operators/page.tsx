/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client"

import { Avatar, Badge, Card, EmptySearchResult, IndexTable, Layout, Page } from "@shopify/polaris"
import { Session } from "next-auth"
import React, { useEffect, useState } from "react"

type PageOperatorsProps = {
    session: Session | null;
}

type Operators = {
    loading: boolean;
    data: Array<{
        _id: string;
        userId: string;
        status: string
        role: string;
        email: string;
        avatar: string | null;
    }>;
    error: any;
}

export default function PageOperators({ session }: PageOperatorsProps) {
    const [syncLoading, setSyncLoading] = useState(false);
    const [operators, setOperators] = useState<Operators>({
        loading: true,
        data: [],
        error: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            // Fetch data from the server
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crisp/operators`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            return data;
        }

        fetchData().then((data) => {
            setOperators({
                loading: false,
                data: data.data,
                error: null,
            });
        }).catch((error) => {
            setOperators({
                loading: false,
                data: [],
                error: error,
            });
        });
    }, []);

    const rowMarkup = operators?.data?.map((operator: any, index: number) => {
        return (
            <React.Fragment key={operator.userId}>
                <IndexTable.Row id={operator.userId} position={index}>
                    <IndexTable.Cell>
                        <Avatar
                            name={operator.name}
                            source={operator.avatar || ''}
                            size="xl"
                        />
                    </IndexTable.Cell>
                    <IndexTable.Cell>{operator.name}</IndexTable.Cell>
                    <IndexTable.Cell>{operator.email}</IndexTable.Cell>
                    <IndexTable.Cell>{
                        operator.status === 'active'
                            ? <Badge tone="success" progress="complete">Active</Badge>
                            : <Badge progress="complete">Inactive</Badge>
                    }</IndexTable.Cell>
                </IndexTable.Row>
            </React.Fragment>
        );
    });

    const emptyStateMarkup = (
        <EmptySearchResult
            title={'No operators yet'}
            description={'Try to sync the operators from the server'}
            withIllustration
        />
    );

    return (
        <Page
            title="Operators"
            subtitle="Manage your operators. Check carefully before syncing."
            primaryAction={{
                content: 'Sync',
                disabled: session?.user?.role !== 'admin' || syncLoading,
                loading: syncLoading,
                accessibilityLabel: 'Sync operators',
                onAction: () => {
                    const sync = async () => {
                        // Fetch data from the server
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crisp/operators/sync`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        });
                        const data = await response.json();
                        console.log(data);
                    }
                    setSyncLoading(true);
                    sync().catch(console.error).finally(() => {
                        setSyncLoading(false);
                    });
                },
            }}
        >
            <Layout>
                <Layout.Section>
                    <Card padding={'0'}>
                        <IndexTable
                            selectable={false}
                            itemCount={operators?.data?.length ?? 0}
                            loading={operators.loading}
                            resourceName={{ singular: 'operator', plural: 'operators' }}
                            emptyState={emptyStateMarkup}
                            headings={[
                                { title: '' },
                                { title: 'Name' },
                                { title: 'Email' },
                                { title: 'Status' },
                            ]}
                            pagination={{
                                hasNext: false,
                                hasPrevious: false,
                            }}
                        >
                            {rowMarkup}
                        </IndexTable>
                    </Card>
                </Layout.Section>
            </Layout>
            <br />
        </Page>
    )
}