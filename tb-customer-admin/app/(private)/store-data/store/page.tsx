'use client';

import SearchStore from "@/components/store-data/SearchStore";
import ShopInfo from "@/components/store-data/ShopInfo";
import SyncShopForm from "@/components/store-data/SyncDataShop";
import { ShopData } from "@/types/store";
import { Page, Card, BlockStack, SkeletonBodyText, SkeletonDisplayText, Banner } from "@shopify/polaris";
import { useState, useCallback } from "react";
import useSWR from "swr";

export default function StoreDashboard() {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('');

  const { data: response, isLoading, error, mutate } = useSWR(
    shouldFetch && selectedDomain ? `/store-data/shop?domain=${selectedDomain}` : null,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false
    }
  );

  const shopData: ShopData | null = response?.data?.data || null;

  const handleSyncData = useCallback(() => {
    mutate();
  }, [mutate]);

  const renderLoading = () => (
    <Card>
      <BlockStack gap="400">
        <SkeletonDisplayText size="medium" />
        <SkeletonBodyText lines={20} />
      </BlockStack>
    </Card>
  );

  const renderError = () => (
    <Banner tone="critical">
      <p>An error occurred while fetching data. Please try again.</p>
    </Banner>
  );

  const renderShopInfo = () => (
    <ShopInfo shopData={shopData!} handleSyncData={handleSyncData} />
  );

  const renderSyncForm = () => (
    <SyncShopForm
      domain={selectedDomain}
      onSyncSuccess={handleSyncData}
    />
  );

  const renderContent = () => {
    if (isLoading) return renderLoading();
    if (error) return renderError();
    if (shopData) return renderShopInfo();
    return renderSyncForm();
  };

  return (
    <Page title="Store Lookup">
      <BlockStack gap="400">
        <SearchStore
          isLoading={isLoading}
          setShouldFetch={setShouldFetch}
          selectedDomain={selectedDomain}
          setSelectedDomain={setSelectedDomain}
        />

        {shouldFetch && (
          <BlockStack gap="400">
            {renderContent()}
          </BlockStack>
        )}
      </BlockStack>
    </Page>
  );
}