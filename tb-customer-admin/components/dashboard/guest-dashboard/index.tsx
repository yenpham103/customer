"use client"

import { Card, InlineStack, Page, Text, Banner, BlockStack, Button } from "@shopify/polaris"
import { useSession } from "next-auth/react"
import Image from "next/image"

export default function GuestDashboard() {
    const { data: session } = useSession()

    const handleRefresh = () => {
        window.location.reload()
    }

    return (
        <Page title="Guest Dashboard">
            <BlockStack gap="400">
                <Banner tone="warning">
                    <InlineStack>
                        <Text as="p">
                            Your account is pending role assignment. Please contact the Root administrator for access.
                        </Text>

                        <Button onClick={handleRefresh} variant="primary">
                            Check Access Again
                        </Button>
                    </InlineStack>
                </Banner>

                <Card>
                    <BlockStack gap="600">
                        <Text as="h1" variant="headingLg" alignment="center">
                            Welcome, {session?.user?.name}!
                        </Text>

                        <InlineStack align="center" blockAlign="center">
                            <Image
                                src="/images/dashboard.webp"
                                alt="dashboard"
                                width={222}
                                height={222}
                            />
                        </InlineStack>

                        <BlockStack gap="300">
                            <Text as="p" variant="headingSm" alignment="center">
                                You are currently a guest user.
                            </Text>
                            <Text as="p" alignment="center">
                                Your account has not been assigned a specific role yet. You need to wait for the Root administrator to approve and assign a role.
                            </Text>
                        </BlockStack>
                        <Card>
                            <BlockStack gap="300">
                                <Text as="h3" variant="headingMd">
                                    Need Help?
                                </Text>
                                <Text as="p">
                                    Contact the Root administrator at:
                                    <Text as="span" fontWeight="medium"> yenpx@bsscommerce.com</Text>
                                </Text>
                            </BlockStack>
                        </Card>

                    </BlockStack>
                </Card>
            </BlockStack>
        </Page>
    )
}