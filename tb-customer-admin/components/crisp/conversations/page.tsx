/* eslint-disable  @typescript-eslint/no-explicit-any */

"use client";

import { Badge, BlockStack, Button, ButtonGroup, Card, ChoiceList, EmptySearchResult, Icon, IndexFilters, IndexFiltersProps, IndexTable, InlineStack, Page, Text, useIndexResourceState, useSetIndexFiltersMode, Toast } from "@shopify/polaris";
import { AlertTriangleIcon, ChatIcon, DeleteIcon, RefreshIcon, StoreFilledIcon, DuplicateIcon } from "@shopify/polaris-icons";
// import { Session } from "next-auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

// type PageConversationsProps = {
//     session: Session | null;
// }

type Conversation = {
    _id: string;
    nickname: string;
    sessionId: string;
    sessionEmail: string;
    assignedOperator: string;
    hasShopData: boolean;
}

type Conversations = {
    loading: boolean;
    data: Array<Conversation>;
    total: number;
    totalPages: number;
    error: any;
}


export default function PageConversations() {
    const [refresh, setRefresh] = useState<string>("loading");
    const searchParams = useSearchParams();
    const router = useRouter();
    const [page, setPage] = useState<number>(parseInt(searchParams.get("page") || "1", 10) || 1);
    const [queryValue, setQueryValue] = useState("");
    const [queryOperator, setQueryOperator] = useState(["all"]);
    const [queryNickname, setQueryNickname] = useState(["all"]);
    const [selected, setSelected] = useState(0);
    const [debouncedQueryValue, setDebouncedQueryValue] = useState("");
    const [toast, setToast] = useState({ active: false, message: '' });

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQueryValue(queryValue.trim());
            if (queryValue.trim() !== debouncedQueryValue.trim()) {
                setConversations({
                    loading: true,
                    data: [],
                    total: 0,
                    totalPages: 0,
                    error: null,
                });
                setRefresh("loading");
            }
        }, 1500); // Adjust the delay as needed

        return () => clearTimeout(timer);
    }, [queryValue]);

    const [conversations, setConversations] = useState<Conversations>({
        loading: true,
        data: [],
        total: 0,
        totalPages: 0,
        error: null,
    });

    const conversationEachCount = useMemo(() => {
        const counts: { [key: string]: number } = {};
        conversations.data.forEach(conversation => {
            counts[conversation.nickname] = (counts[conversation.nickname] || 0) + 1;
        });
        return counts;
    }, [conversations.data]);

    useEffect(() => {
        const fetchData = async (page: number = 1, q = "") => {
            // Fetch data from the server
            const url = `${process.env.NEXT_PUBLIC_API_URL}/crisp/conversations`;
            const params = new URLSearchParams();
            params.set("page", page.toString());
            if (q) {
                params.set("q", q);
            }
            if (queryOperator) {
                params.set("operator", queryOperator[0]);
            }

            if (queryNickname) {
                params.set("nickname", queryNickname[0]);
            }

            const response = await fetch(`${url}?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            return data;
        }

        if (conversations.loading && refresh !== "idle") {
            fetchData(refresh === "refresh" ? 1 : page, refresh === "refresh" ? "" : debouncedQueryValue).then((data) => {
                setConversations({
                    loading: false,
                    data: data.data,
                    error: null,
                    total: data.total || 0,
                    totalPages: data.totalPages || 0,
                });
            }).catch((error) => {
                setConversations({
                    loading: false,
                    data: [],
                    total: 0,
                    totalPages: 0,
                    error: error,
                });
            }).finally(() => {
                setRefresh("idle");
            });
        }
    }, [refresh, page, debouncedQueryValue, queryOperator, queryNickname]);

    const { mode, setMode } = useSetIndexFiltersMode();

    const resourceIDResolver = (c: Conversation) => c._id;

    const { selectedResources, allResourcesSelected, handleSelectionChange, clearSelection } =
        useIndexResourceState(conversations.data, {
            resourceIDResolver
        });

    const filters = [
        {
            key: 'domain',
            label: 'Domain',
            filter: (
                <ChoiceList
                    title="Domain"
                    titleHidden
                    choices={[
                        { label: "Valid domain", value: "valid" },
                        { label: "Invalid domain", value: "invalid" },
                    ]}
                    onChange={(value: string[]) => {
                        setQueryNickname(value);
                        setConversations({
                            loading: true,
                            data: [],
                            total: 0,
                            totalPages: 0,
                            error: null,
                        });
                        setRefresh("loading");
                    }}
                    selected={queryNickname}
                />
            ),
        },
        {
            key: 'operator',
            label: 'Operator',
            filter: (
                <ChoiceList
                    title="Missing operator"
                    titleHidden
                    choices={[
                        { label: "Ghost Operator", value: "Ghost Operator" },
                        { label: "None assigned", value: "None assigned" },
                        { label: "Jonas N.", value: "Jonas N." },
                        { label: "Emma C.", value: "Emma C." },
                        { label: "Raymond T.", value: "Raymond T." },
                        { label: "Louis N.", value: "Louis N." },
                        { label: "Hill T.", value: "Hill T." },
                        { label: "Mida N.", value: "Mida N." },

                    ]}
                    onChange={(value: string[]) => {
                        setQueryOperator(value);
                        setConversations({
                            loading: true,
                            data: [],
                            total: 0,
                            totalPages: 0,
                            error: null,
                        });
                        setRefresh("loading");
                    }}
                    selected={queryOperator}
                />
            ),
            shortcut: true,
        }
    ];

    const appliedFilters: IndexFiltersProps['appliedFilters'] = [];

    if (queryOperator.length > 0 && queryOperator[0] !== "all") {
        appliedFilters.push({
            key: 'operator',
            label: `Operator: ${queryOperator.join(', ')}`,
            onRemove: () => {
                setQueryOperator(["all"]);
                setConversations({
                    loading: true,
                    data: [],
                    total: 0,
                    totalPages: 0,
                    error: null,
                });
                setRefresh("loading");
            },
        });
    }
    if (queryNickname.length > 0 && queryNickname[0] !== "all") {
        appliedFilters.push({
            key: 'domain',
            label: `Domain: ${queryNickname.join(', ')}`,
            onRemove: () => {
                setQueryNickname(["all"]);
                setConversations({
                    loading: true,
                    data: [],
                    total: 0,
                    totalPages: 0,
                    error: null,
                });
                setRefresh("loading");
            },
        });
    }

    // function
    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setToast({ active: true, message: `${type} đã được copy!` });
    };

    return (
        <Page
            title="Conversations"
            subtitle="Manage conversations with customers. Only fetched conversations are shown here. Go to Store data > Ignore nicknames to manage ignored nicknames."
            primaryAction={{
                icon: RefreshIcon,
                onAction: () => {
                    setConversations({
                        loading: true,
                        data: [],
                        total: 0,
                        totalPages: 0,
                        error: null,
                    });
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("page", "1");
                    router.push(`/crisp/conversations?${params.toString()}`);
                    setRefresh("refresh");
                    setPage(1);
                }
            }}
        >

            <BlockStack gap={"400"}>
                <InlineStack>
                    <Text as="p" variant="headingMd" fontWeight="bold">
                        There {conversations.total < 2 ? "is" : "are"} {conversations.total} conversation{conversations.total < 2 ? "" : "s"} found in {conversations.totalPages} page{conversations.totalPages < 2 ? "" : "s"}.
                    </Text>
                </InlineStack>
                <Card padding={"0"}>
                    <IndexFilters
                        mode={mode}
                        setMode={setMode}
                        selected={selected}
                        onSelect={setSelected}
                        queryValue={queryValue}
                        tabs={[]}
                        appliedFilters={appliedFilters}
                        filters={filters}
                        queryPlaceholder="Search conversations by nickname or email"
                        loading={conversations.loading}
                        disabled={conversations.loading}
                        onQueryChange={(value) => {
                            setQueryValue(value);
                            const params = new URLSearchParams(searchParams.toString());
                            params.set("query", value);
                            params.set("page", "1");
                            router.push(`/crisp/conversations?${params.toString()}`);
                        }}
                        onQueryClear={() => {
                            setQueryValue("");
                            const params = new URLSearchParams(searchParams.toString());
                            params.delete("query");
                            params.set("page", "1");
                            router.push(`/crisp/conversations?${params.toString()}`);
                        }}
                        onClearAll={() => {
                            const params = new URLSearchParams(searchParams.toString());
                            params.delete("query");
                            params.set("page", "1");
                            router.push(`/crisp/conversations?${params.toString()}`);
                            setQueryOperator(["all"]);
                            if (queryValue.trim() === "") {
                                setConversations({
                                    loading: true,
                                    data: [],
                                    total: 0,
                                    totalPages: 0,
                                    error: null,
                                })
                                setRefresh("loading");
                            } else {
                                setQueryValue("");
                            }
                        }}
                    />
                    <IndexTable
                        itemCount={conversations.data.length}
                        headings={[
                            { title: "Nickname", alignment: "start", hidden: false },
                            { title: "Attention", alignment: "center", hidden: true },
                            { title: "Email", alignment: "start", hidden: false },
                            { title: "Operator", alignment: "center", hidden: true },
                            { title: "Actions", alignment: "center", hidden: true },
                        ]}
                        selectable={true}
                        emptyState={
                            <EmptySearchResult
                                title="No conversations found"
                                description="Try adjusting your search or filter to find what you’re looking for."
                            />
                        }
                        loading={conversations.loading}
                        resourceName={{ singular: "conversation", plural: "conversations" }}
                        pagination={{
                            hasNext: page < conversations.totalPages,
                            hasPrevious: page > 1,
                            onNext: () => {
                                setPage(page + 1);
                                const params = new URLSearchParams(searchParams.toString());
                                params.set("page", (page + 1).toString());
                                router.push(`/crisp/conversations?${params.toString()}`);
                                setConversations({
                                    loading: true,
                                    data: [],
                                    total: 0,
                                    totalPages: 0,
                                    error: null,
                                })
                                setRefresh("next");
                            },
                            onPrevious: () => {
                                setPage(page - 1);
                                const params = new URLSearchParams(searchParams.toString());
                                params.set("page", (page - 1).toString());
                                router.push(`/crisp/conversations?${params.toString()}`);
                                setConversations({
                                    loading: true,
                                    data: [],
                                    total: 0,
                                    totalPages: 0,
                                    error: null,
                                })
                                setRefresh("previous");
                            }
                        }}
                        bulkActions={[]}
                        onSelectionChange={handleSelectionChange}
                        selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
                        hasZebraStriping={true}
                        hasMoreItems={true}
                    >
                        {conversations.data.map((conversation, index) => (
                            <React.Fragment key={`row-${conversation._id}`}>
                                <IndexTable.Row
                                    id={conversation._id}
                                    position={index}
                                    key={conversation._id}
                                    selected={selectedResources.includes(conversation._id)}
                                >
                                    <IndexTable.Cell>
                                        <InlineStack gap="200" align="start">
                                            {conversation.nickname}
                                            <Button
                                                size="micro"
                                                variant="plain"
                                                icon={DuplicateIcon}
                                                onClick={() => copyToClipboard(conversation.nickname, "Nickname")}
                                            />
                                        </InlineStack>
                                    </IndexTable.Cell>
                                    <IndexTable.Cell>
                                        {conversationEachCount[conversation.nickname] > 1 ? (
                                            <Icon source={AlertTriangleIcon} tone="warning" />
                                        ) : (
                                            ""
                                        )}
                                    </IndexTable.Cell>
                                    <IndexTable.Cell>
                                        <InlineStack gap="200" align="start">
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
                                        <Badge
                                            tone={
                                                conversation.assignedOperator === "Ghost Operator" ? "attention" :
                                                    conversation.assignedOperator === "None assigned" ? "info" :
                                                        "success"
                                            }
                                        >
                                            {conversation.assignedOperator}
                                        </Badge>
                                    </IndexTable.Cell>

                                    <IndexTable.Cell>
                                        <ButtonGroup>
                                            <Button onClick={() => {
                                                window.open(`https://app.crisp.chat/website/9f64b5a9-1a02-4190-93b8-8ef56b19f740/inbox/${conversation.sessionId}/`, "_blank");
                                            }} icon={ChatIcon}>
                                            </Button>
                                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                                <Button
                                                    icon={StoreFilledIcon}
                                                    disabled={!/^[a-z0-9-]+\.myshopify\.com$/i.test(conversation.nickname)}
                                                    onClick={() => {
                                                        router.push(`/store-data/store/?domain=${conversation.nickname}`);
                                                    }}
                                                >
                                                </Button>
                                                {/^[a-z0-9-]+\.myshopify\.com$/i.test(conversation.nickname) &&
                                                    conversation.hasShopData && (
                                                        <div className="bss-store-data_btn" />
                                                    )}
                                            </div>  
                                            <Button disabled={selectedResources.length > 0} icon={DeleteIcon} tone="critical" onClick={() => {
                                                if (confirm("Are you sure you want to delete this conversation? This action cannot be undone.")) {
                                                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/crisp/conversations/${conversation._id}`, {
                                                        method: 'DELETE',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                        }
                                                    }).then(() => {
                                                        setConversations({
                                                            loading: true,
                                                            data: [],
                                                            total: 0,
                                                            totalPages: 0,
                                                            error: null,
                                                        });
                                                        setRefresh("loading");
                                                        clearSelection();
                                                    }).catch((error) => {
                                                        console.error("Error deleting conversation:", error);
                                                    });
                                                }
                                            }}></Button>
                                        </ButtonGroup>
                                    </IndexTable.Cell>
                                </IndexTable.Row>
                            </React.Fragment>
                        ))}
                    </IndexTable>
                </Card>
            </BlockStack>
            {toast.active && (
                <Toast
                    content={toast.message}
                    onDismiss={() => setToast({ active: false, message: '' })}
                    duration={2000}
                    error={false}
                />
            )}
        </ Page>
    )
}
