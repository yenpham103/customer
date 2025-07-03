import { validateDomain } from '@/utils/storeUtils';
import { Autocomplete, BlockStack, Button, Card, Icon, Text } from '@shopify/polaris'
import { SearchIcon, StoreFilledIcon } from '@shopify/polaris-icons';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'

interface SearchStoreProps {
    isLoading: boolean;
    setShouldFetch: React.Dispatch<React.SetStateAction<boolean>>;
    selectedDomain: string;
    setSelectedDomain: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchStore({ isLoading, setShouldFetch, selectedDomain, setSelectedDomain }: SearchStoreProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialDomain = searchParams.get('domain') || '';
    const [inputValue, setInputValue] = useState(initialDomain);
    const [validationError, setValidationError] = useState('');
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    useEffect(() => {
        if (initialDomain) {
            if (validateDomain(initialDomain)) {
                setSelectedDomain(initialDomain);
                setShouldFetch(true);
                setValidationError('');
            } else {
                setValidationError('Invalid domain format. Please use “my-store.myshopify.com”');
            }
        }
    }, [initialDomain]);

    const handleInputChange = useCallback((value: string) => {
        setInputValue(value);
        setValidationError('');
    }, []);

    const updateSelection = useCallback((selected: string[]) => {
        setSelectedOptions(selected);
        if (selected.length > 0) {
            setInputValue(selected[0]);
        }
    }, []);
    
    const handleSubmit = useCallback(() => {
        const formattedDomain = inputValue.trim();

        if (formattedDomain === selectedDomain) {
            setValidationError('Please enter a different domain');
            return;
        }

        if (!formattedDomain) {
            setValidationError('Please enter a domain');
            return;
        }

        if (!validateDomain(formattedDomain)) {
            setValidationError('Invalid domain format. Please use “my-store.myshopify.com”');
            return;
        }

        setSelectedDomain(formattedDomain);
        setShouldFetch(true);
        setValidationError('');

        const params = new URLSearchParams();
        params.set('domain', formattedDomain);
        router.push(`/store-data/store?${params.toString()}`);

    }, [inputValue, router, selectedDomain]);


    const textField = (
        <Autocomplete.TextField onChange={handleInputChange} label="" value={inputValue} placeholder="Enter domain (e.g., my-store.myshopify.com)" prefix={<Icon source={StoreFilledIcon} />}
            autoComplete="off"
            connectedRight={
                <div style={{ display: 'flex' }}>
                    <Button variant="primary" icon={SearchIcon} loading={isLoading} onClick={handleSubmit} disabled={!inputValue.trim()}>
                        Search
                    </Button>
                </div>
            }
            error={validationError ? true : false}
        />
    );

    return (
        <Card>
            <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                    Search Store
                </Text>
                <BlockStack gap="200">
                    <Autocomplete options={[]} selected={selectedOptions} onSelect={updateSelection} textField={textField} />
                    {validationError && (
                        <Text as="p" tone="critical">
                            {validationError}
                        </Text>
                    )}
                </BlockStack>
            </BlockStack>
        </Card>
    )
}