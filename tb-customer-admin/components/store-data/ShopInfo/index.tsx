import { ShopData } from '@/types/store'
import { formatDate, formatPlanName, formatAppName, getTimeSinceCreated } from '@/utils/storeUtils'
import { Badge, BlockStack, Box, Button, ButtonGroup, Card, Divider, Icon, InlineStack, Layout, Text, Toast, Tooltip } from '@shopify/polaris'
import { AppsIcon, AlertBubbleIcon } from '@shopify/polaris-icons'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import ConversationStore from '../ConversationStore'
import { storeDataApi } from '@/api-client'

interface ShopInfoProps {
    shopData: ShopData;
    handleSyncData: () => void;
}

export default function ShopInfo({ shopData, handleSyncData }: ShopInfoProps) {
    const [statusUpdated, setStatusUpdated] = useState({
        success: false,
        message: ''
    });
    const totalMount = useMemo(() => {
        if (shopData.orderStatistics?.totalOrders && shopData.orderStatistics?.averageOrderValue) {
            return shopData.orderStatistics?.totalOrders * shopData.orderStatistics?.averageOrderValue;
        }
    }, [shopData.orderStatistics?.totalOrders, shopData.orderStatistics?.averageOrderValue]);


    const handleSyncShopDetail = async () => {
        if(shopData.domain) {
           const response = await storeDataApi.updateShopDetail(shopData.domain);
           if(response.status === 200 && response.data) {
                handleSyncData();
                setStatusUpdated({
                    success: response.data.success,
                    message: response.data.message
                })
           }
        }
    }

    return (
        <BlockStack gap="400">
            <Layout>
                <Layout.Section>
                    <Card padding={"0"}>
                        <BlockStack gap="300">
                            <Box padding="400">
                                <BlockStack gap={"200"}>
                                <InlineStack align="space-between">
                                    <BlockStack>
                                        <Text as="h2" variant="headingLg">
                                            {shopData?.storeName}
                                        </Text>
                                    </BlockStack>
                                    <ButtonGroup>
                                        <Button variant='secondary' onClick={handleSyncShopDetail}>
                                            Sync
                                        </Button>
                                        <Button variant='primary' onClick={() => window.open(`https://partners.shopify.com/4217926/stores/${shopData?.shopId}`, '_blank')}>
                                            Open Partner
                                        </Button>
                                    </ButtonGroup>
                                </InlineStack>
                                    <InlineStack blockAlign='center' align='start' gap={"100"}>
                                        <Text as='p' variant="headingXs" tone='caution'>{formatDate(shopData?.shopCreatedAt)}</Text>
                                        <Badge tone="info">{String(getTimeSinceCreated(shopData?.shopCreatedAt))}</Badge>
                                    </InlineStack>
                                    {
                                        shopData.orderStatistics && shopData.orderStatistics?.orderDateRange &&
                                        <BlockStack gap={"200"}>
                                            <InlineStack align="start" blockAlign='center' gap="100">
                                                <Text as='h4' variant='headingMd'>
                                                    <Badge tone='info'>{String(shopData?.orderStatistics?.totalOrders)}</Badge>
                                                    {" "} x {" "}
                                                    <Badge tone='info'>{String(shopData?.orderStatistics?.averageOrderValue?.toLocaleString('en-US'))}</Badge>
                                                    {" "} = {" "}
                                                    <Badge tone='info'>{`${totalMount?.toLocaleString('en-US')} (${shopData?.orderStatistics.currencyCode})`}</Badge>
                                                </Text>
                                            </InlineStack>
                                            <InlineStack align="start" blockAlign='center' gap="100">
                                                <Text as='h3' variant='headingSm'>
                                                    From <Badge tone='info'>
                                                        {formatDate(shopData?.orderStatistics?.orderDateRange?.from ?? '')}
                                                    </Badge>
                                                    {" "} To {" "}
                                                    <Badge tone='info'>
                                                        {formatDate(shopData?.orderStatistics?.orderDateRange?.to ?? '')}
                                                    </Badge>
                                                </Text>
                                            </InlineStack>
                                        </BlockStack>
                                    }
                                </BlockStack>
                            </Box>
                            <Divider />
                            <ConversationStore domain={shopData?.domain} />

                        </BlockStack>
                    </Card>
                </Layout.Section>
                <Layout.Section variant="oneThird">
                    <BlockStack gap="200">
                        <Card>
                            <BlockStack gap="400">
                                <BlockStack gap="100">
                                    <InlineStack gap="200">
                                        <Text as="h4" variant="headingMd">
                                            {shopData?.storeName}
                                        </Text>
                                    </InlineStack>
                                    <Text as="p">
                                        <Link href={`https://${shopData?.domain}`} target="_blank" >{shopData?.domain}</Link>
                                    </Text>
                                </BlockStack>
                                <Divider />
                                <BlockStack gap="100">
                                    <Text as='h3' variant="headingMd">SHOPIFY PLAN</Text>
                                    <Text as='p' variant="headingXs" tone='subdued'>{formatPlanName(shopData?.planDisplayName)}</Text>
                                </BlockStack>
                                <Divider />
                                <BlockStack gap="100">
                                    <Text as='h3' variant="headingMd">SHOP INFORMATION</Text>
                                    <Text as='p' variant="headingXs" tone='subdued'>{shopData?.email}</Text>
                                    <InlineStack align='start' blockAlign='center' gap={"200"}>
                                        <Text as='p' variant="headingXs" tone='subdued'>{shopData?.country}</Text>
                                        <Tooltip content="Number of stores in this country">
                                            <Badge tone='info'>{String(shopData?.storeCountInSameCountry)}</Badge>
                                        </Tooltip>
                                    </InlineStack>
                                </BlockStack>
                            </BlockStack>
                        </Card>
                        <Card>
                            <BlockStack gap="200">
                                <InlineStack gap="200" align="start">
                                    <Text as="p"> <Icon source={AppsIcon} /></Text>
                                    <Text as="h3" variant="headingMd">
                                        APPS INSTALLED
                                    </Text>
                                </InlineStack>
                                {
                                    shopData?.apps?.map((app, index) => (
                                        <InlineStack key={index} gap="200" align="start">
                                            <Text as="p">
                                                {formatAppName(app)}
                                            </Text>
                                        </InlineStack>
                                    ))
                                }
                            </BlockStack>
                        </Card>

                    </BlockStack>
                </Layout.Section>
                <Layout.Section>
                    <Card>
                        <BlockStack gap="500">
                            <InlineStack gap="200" align="start">
                                <Tooltip content={
                                    <BlockStack gap="200">
                                        <Text as="p" variant="bodyMd" fontWeight="semibold">
                                            Category Statistics
                                        </Text>
                                        <Text as="p" variant="bodySm">
                                            The number next to each category shows how many stores in our database have that same product category.
                                        </Text>
                                    </BlockStack>
                                }>
                                    <Text as="p"><Icon source={AlertBubbleIcon} /></Text>
                                </Tooltip>
                                <Text as="h3" variant="headingMd">
                                    PRODUCT CATEGORIES
                                </Text>
                            </InlineStack>
                            <InlineStack gap="200" wrap>
                                {shopData?.productCategories?.map((category, index) => (
                                    <div
                                        key={index}
                                        className="bss-category-badge-container"
                                    >
                                        <Badge tone="new" size="medium">
                                            {category}
                                        </Badge>
                                        {shopData.categoryStoreStats?.[category] && (
                                            <div
                                                className={`bss-category-count-badge ${shopData.categoryStoreStats[category] > 10 ? 'pulse' : ''
                                                    }`}
                                            >
                                                {shopData.categoryStoreStats[category]}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </InlineStack>
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
            {statusUpdated.success && (
                <Toast
                    content={statusUpdated.message}
                    onDismiss={() => setStatusUpdated({ success: false, message: '' })}
                    duration={2000}
                    error={false}
                />
            )}
        </BlockStack>
    )
}
