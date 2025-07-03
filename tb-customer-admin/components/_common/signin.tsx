'use client';
import { LoginButton } from "@/components/_common/login-button"
import { Page, Card, Text, BlockStack } from "@shopify/polaris"

export default function PageSignIn() {
    return (
        <Page narrowWidth>
            <Card>
                <BlockStack gap="400">
                    <Text as="h1" variant="headingLg">
                        Welcome to the App
                    </Text>
                    <Text as="p">Please sign in to access the dashboard</Text>
                    <LoginButton />
                </BlockStack>
            </Card>
        </Page>
    )
}