"use client";

import { BlockStack, Card, InlineStack, Page, Tag, Text, TextField } from "@shopify/polaris";
// import { Session } from "next-auth";
import { useEffect, useState } from "react";

// type IgnorePageProps = {
//     session: Session | null;
// }

export default function IgnorePage() {
    const [originalIgnores, setOriginalIgnores] = useState<string[]>([]);
    const [ignores, setIgnores] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | boolean | undefined>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        const fetchIgnores = async () => {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store-data/ignores`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setIgnores(data.data);
                setOriginalIgnores(data.data);
                setLoading(false);
            } else {
                console.error("Failed to fetch ignores");
                setLoading(false);
            }
        }
        if (!loading) {
            fetchIgnores();
        }
    }, [refresh]);

    return (
        <Page
            title="Manage ignored nicknames"
            subtitle="The nicknames of the conversations you want to ignore."
            narrowWidth
            primaryAction={
                {
                    content: "Save",
                    onAction: () => {
                        const saveIgnores = async () => {
                            setLoading(true);
                            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store-data/ignores`, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ ignoreNicknames: ignores }),
                            });
                            if (response.ok) {
                                setLoading(false);
                                setRefresh(refresh + 1);
                            } else {
                                console.error("Failed to save ignores");
                                setLoading(false);
                            }
                        }
                        saveIgnores();
                    },
                    loading: loading,
                    disabled: loading || originalIgnores.length === ignores.length && originalIgnores.every((ignore, index) => ignore === ignores[index]),
                }
            }
        >
            <Card>
                <BlockStack gap={"400"}>
                    <InlineStack gap={"200"}>

                        <div onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                if (inputValue.trim() !== "") {
                                    const trimmedValue = inputValue.trim();
                                    if (ignores.includes(trimmedValue)) {
                                        setError("This nickname is already ignored.");
                                    } else {
                                        setError(false);
                                        setIgnores([...ignores, trimmedValue]);
                                        setInputValue("");
                                    }
                                }
                            }
                        }} style={{ flex: "1 1 auto" }}>
                            <TextField
                                label="Ignored Nickname"
                                labelHidden={true}
                                value={inputValue}
                                onChange={(value) => setInputValue(value)}
                                autoComplete="off"
                                placeholder="Enter a nickname to ignore"
                                error={error}
                            />
                        </div>
                    </InlineStack>
                    <Text variant="bodyMd" as="p" fontWeight="bold">
                        There {ignores.length < 2 ? "is" : "are"} {ignores.length} ignored nickname{ignores.length === 1 ? "" : "s"}.
                    </Text>
                    {ignores.length === 0 ? (
                        <p>No ignored nicknames.</p>
                    ) : (
                        loading ? (
                            <p>Loading...</p>
                        ) : (
                            <InlineStack gap={"200"} wrap={true}>
                                {ignores.map((ignore, index) => (
                                    <div
                                        key={`${index}-${ignore}`}
                                        style={(inputValue && ignore.includes(inputValue.trim())) ? {
                                            borderRadius: "var(--p-border-radius-200)",
                                            border: "2px solid var(--p-color-bg-fill-critical)",
                                            color: "var(--p-color-bg-fill-critical)"
                                        } : {}}>

                                        <Tag
                                            key={index}
                                            onRemove={() => {
                                                setIgnores(ignores.filter((i) => i !== ignore));
                                            }}>{ignore}</Tag>
                                    </div>
                                ))}
                            </InlineStack>
                        )

                    )}
                </BlockStack>
            </Card>
        </Page>
    )
}
