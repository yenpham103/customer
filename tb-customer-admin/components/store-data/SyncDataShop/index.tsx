'use client';

import { Card, BlockStack, InlineStack, Text, Button, TextField, Form, FormLayout, Banner } from "@shopify/polaris";
import { RefreshIcon } from "@shopify/polaris-icons";
import { useState, useCallback } from "react";
import { storeDataApi } from "@/api-client";

interface SyncShopFormProps {
    domain: string;
    onSyncSuccess?: () => void;
}

interface SyncFormState {
    formData: {
        lockAccessToken: string;
        portalAccessToken: string;
        solutionAccessToken: string;
    };
    submissionState: {
        isLoading: boolean;
        errorMessage: string;
        successMessage: string;
    };
}

const APP_CONFIG = [
    { key: 'lockAccessToken', label: 'Lock Access Token', appName: 'lock' },
    { key: 'portalAccessToken', label: 'Portal Access Token', appName: 'portal' },
    { key: 'solutionAccessToken', label: 'Solution Access Token', appName: 'solution' }
] as const;

export default function SyncShopForm({ domain, onSyncSuccess }: SyncShopFormProps) {
    const [syncState, setSyncState] = useState<SyncFormState>({
        formData: {
            lockAccessToken: '',
            portalAccessToken: '',
            solutionAccessToken: ''
        },
        submissionState: {
            isLoading: false,
            errorMessage: '',
            successMessage: ''
        }
    });

    const updateFormData = useCallback((field: keyof SyncFormState['formData'], value: string) => {
        setSyncState(prev => ({
            ...prev,
            formData: {
                ...prev.formData,
                [field]: value
            }
        }));
    }, []);

    const updateSubmissionState = useCallback((updates: Partial<SyncFormState['submissionState']>) => {
        setSyncState(prev => ({
            ...prev,
            submissionState: {
                ...prev.submissionState,
                ...updates
            }
        }));
    }, []);

    const clearMessages = useCallback(() => {
        updateSubmissionState({
            errorMessage: '',
            successMessage: ''
        });
    }, [updateSubmissionState]);

    const resetForm = useCallback(() => {
        setSyncState({
            formData: {
                lockAccessToken: '',
                portalAccessToken: '',
                solutionAccessToken: ''
            },
            submissionState: {
                isLoading: false,
                errorMessage: '',
                successMessage: ''
            }
        });
    }, []);

    const getActiveTokens = useCallback(() => {
        const { lockAccessToken, portalAccessToken, solutionAccessToken } = syncState.formData;
        const activeTokens = [];

        if (lockAccessToken.trim()) {
            activeTokens.push({ token: lockAccessToken, app: 'lock' });
        }
        if (portalAccessToken.trim()) {
            activeTokens.push({ token: portalAccessToken, app: 'portal' });
        }
        if (solutionAccessToken.trim()) {
            activeTokens.push({ token: solutionAccessToken, app: 'solution' });
        }

        return activeTokens;
    }, [syncState.formData]);

    const handleSyncSubmission = useCallback(async () => {
        clearMessages();

        const activeTokens = getActiveTokens();

        if (activeTokens.length === 0) {
            updateSubmissionState({
                errorMessage: 'Please enter at least one access token to sync data'
            });
            return;
        }

        updateSubmissionState({ isLoading: true });

        const syncResults = [];
        const errorResults = [];

        for (const { token, app } of activeTokens) {
            try {
                const encodedAccessToken = btoa(token);
                const response = await storeDataApi.syncShopData(domain, app, encodedAccessToken);

                if (!response.data.success) {
                    throw new Error(`Error when sync app ${app}`);
                }

                syncResults.push(app);
            } catch (error) {
                errorResults.push(`${app}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }

        const success = syncResults.length > 0;
        const error = errorResults.length > 0;
        
        updateSubmissionState({
            successMessage: success ? `Sync successfully ${syncResults.join(', ')}` : '',
            errorMessage: error ? `Sync failed: ${errorResults.join('; ')}` : ''
        });

        if (success) {
            resetForm();
            onSyncSuccess?.();
        }

        updateSubmissionState({ isLoading: false });
    }, [domain, getActiveTokens, clearMessages, updateSubmissionState, resetForm, onSyncSuccess]);

    const { formData, submissionState } = syncState;
    
    return (
        <Card>
            <BlockStack gap="400">
                <InlineStack align="space-between">
                    <Text as="h2" variant="headingMd">
                        Sync Shop Data & List Orders
                    </Text>
                </InlineStack>

                <Text as="p" tone="subdued">
                    No data found for domain <strong>{domain}</strong>. You can sync data from Shopify using the form below.
                </Text>

                <Text as="p" tone="subdued">
                    Enter access token for the apps you want to sync. Only enter tokens for apps that are installed.
                </Text>

                <Form onSubmit={handleSyncSubmission}>
                    <FormLayout>
                        {APP_CONFIG.map(({ key, label }) => (
                            <TextField
                                key={key}
                                label={label}
                                value={formData[key]}
                                onChange={(value) => updateFormData(key, value)}
                                placeholder="Enter access token"
                                type="password"
                                autoComplete="off"
                            />
                        ))}

                        {submissionState.errorMessage && (
                            <Banner tone="critical">
                                <p>{submissionState.errorMessage}</p>
                            </Banner>
                        )}

                        <Text as="p" tone="critical">
                            Token will be encoded base64 when sent to server
                        </Text>

                        <InlineStack gap="200">
                            <Button
                                variant="primary"
                                submit
                                loading={submissionState.isLoading}
                                disabled={!Object.values(formData).some(token => token.trim() !== '')}
                                icon={RefreshIcon}
                            >
                                Sync Data
                            </Button>
                            <Button
                                onClick={resetForm}
                                disabled={submissionState.isLoading}
                            >
                                Clear
                            </Button>
                        </InlineStack>
                    </FormLayout>
                </Form>
            </BlockStack>
        </Card>
    );
}