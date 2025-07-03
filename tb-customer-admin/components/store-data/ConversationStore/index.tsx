"use client";

import { storeDataApi } from "@/api-client";
import { Conversations } from "@/types/conversation";
import { Badge, BlockStack, Box, Button, ButtonGroup, EmptySearchResult, Icon, IndexTable, InlineStack, Text, Toast } from "@shopify/polaris";
import { AlertTriangleIcon, ChatIcon, DeleteIcon, DuplicateIcon } from "@shopify/polaris-icons";
import React, { useEffect, useMemo, useState } from "react";

interface ConversationStoreProps {
    domain: string;
}

export default function ConversationStore({ domain }: ConversationStoreProps) {
    const [conversations, setConversations] = useState<Conversations>({
        loading: true,
        data: [],
        total: 0,
        totalPages: 0,
        error: null,
    });
    const [toast, setToast] = useState({ active: false, message: '' });

    const conversationEachCount = useMemo(() => {
        const counts: { [key: string]: number } = {};
        conversations.data.forEach(conversation => {
            counts[conversation.nickname] = (counts[conversation.nickname] || 0) + 1;
        });
        return counts;
    }, [conversations.data]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await storeDataApi.getConversationsByDomain(domain);

                if(response.status === 200  && response.data) {
                    const data = response.data.data || [];
                    setConversations({
                        loading: false,
                        data: data,
                        error: null,
                        total: response.data.total || data.length,
                        totalPages: response.data.totalPages || 1,
                    });
                } else {
                    setConversations({
                        loading: false,
                        data: [],
                        total: 0,
                        totalPages: 0,
                        error: 'Request not successful',
                    });
                }

            } catch (error) {
                setConversations({
                    loading: false,
                    data: [],
                    total: 0,
                    totalPages: 0,
                    error: error,
                });
            }
        };

        if (domain) {
            fetchData();
        }
    }, [domain]);

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setToast({ active: true, message: `${type} đã được copy!` });
    };

    const handleDeleteConversation = async (conversationId: string) => {
        if (!confirm("Are you sure you want to delete this conversation? This action cannot be undone.")) {
            return;
        }

        try {
            await storeDataApi.deleteConversation(conversationId);
            setConversations(prev => ({
                ...prev,
                data: prev.data.filter(conv => conv._id !== conversationId),
                total: prev.total - 1
            }));
        } catch (error) {
            console.error("Error deleting conversation:", error);
        }
    };

    if (conversations.loading) {
        return (
            <Box padding={'400'}>
                <BlockStack gap="200">
                    <Text as="h3" variant="headingMd">
                        Conversations for this store
                    </Text>
                    <Text as="p" tone="subdued">Loading...</Text>
                </BlockStack>
            </Box>
        );
    }

    if (conversations.data.length === 0) {
        return (
            <Box padding={'400'}>
                <BlockStack gap="200">
                    <Text as="h3" variant="headingMd">
                        Conversations for this store
                    </Text>
                    <Text as="p" tone="subdued">No conversations found for this domain.</Text>
                </BlockStack>
            </Box>
        );
    }

    return (
        <BlockStack gap="400">
            <Box paddingInlineStart={"400"}>
                <Text as="h3" variant="headingMd">
                    Conversations for this store: <Badge tone="info">{conversations?.total?.toString()}</Badge>
                </Text>
            </Box>
            <IndexTable
                itemCount={conversations.data.length}
                headings={[
                    { title: "Email", alignment: "start" },
                    { title: "Operator", alignment: "center" },
                    { title: "Actions", alignment: "center" },
                ]}
                selectable={false}
                emptyState={
                    <EmptySearchResult
                        title="No conversations found"
                        description="No conversations found for this domain."
                    />
                }
                loading={conversations.loading}
                resourceName={{ singular: "conversation", plural: "conversations" }}
                hasZebraStriping={true}
            >
                {conversations.data.map((conversation, index) => (
                    <IndexTable.Row
                        id={conversation._id}
                        position={index}
                        key={conversation._id}
                    >
                        <IndexTable.Cell>
                            <InlineStack gap="200" align="start">
                                {conversationEachCount[conversation.nickname] > 1 && (
                                    <Icon source={AlertTriangleIcon} tone="warning" />
                                )}
                                {conversation.sessionEmail}
                                <Button
                                    size="micro"
                                    variant="plain"
                                    icon={DuplicateIcon}
                                    onClick={() => copyToClipboard(conversation.sessionEmail, "Email")}
                                />
                            </InlineStack>
                        </IndexTable.Cell>

                        <IndexTable.Cell>
                            <InlineStack align="center">
                                <Badge
                                    tone={
                                        conversation.assignedOperator === "Ghost Operator" ? "attention" :
                                            conversation.assignedOperator === "None assigned" ? "info" :
                                                "success"
                                    }
                                >
                                    {conversation.assignedOperator}
                                </Badge>
                            </InlineStack>
                        </IndexTable.Cell>

                        <IndexTable.Cell>
                            <InlineStack align="center">
                                <ButtonGroup>
                                    <Button
                                        onClick={() => {
                                            window.open(`https://app.crisp.chat/website/9f64b5a9-1a02-4190-93b8-8ef56b19f740/inbox/${conversation.sessionId}/`, "_blank");
                                        }}
                                        icon={ChatIcon}
                                        size="slim"
                                    >
                                    </Button>
                                    <Button
                                        icon={DeleteIcon}
                                        tone="critical"
                                        size="slim"
                                        onClick={() => handleDeleteConversation(conversation._id)}
                                    >
                                    </Button>
                                </ButtonGroup>
                            </InlineStack>
                        </IndexTable.Cell>
                    </IndexTable.Row>
                ))}
            </IndexTable>

            {toast.active && (
                <Toast
                    content={toast.message}
                    onDismiss={() => setToast({ active: false, message: '' })}
                    duration={2000}
                />
            )}
        </BlockStack>
    );
}