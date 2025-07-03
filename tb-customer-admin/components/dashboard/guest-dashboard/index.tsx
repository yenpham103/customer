"use client"

import { Card, InlineStack, Page, Text } from "@shopify/polaris"
import { useSession } from "next-auth/react"
import Image from "next/image"

export default function GuestDashboard() {
    const { data: session } = useSession()
    return (
        <Page
            title="Dashboard"
        >
            <Card>
                <Text as="h1" variant="headingLg" alignment="center">Welcome to {session?.user?.name}</Text>
                <InlineStack align="center" blockAlign="center">
                    <Image src="/images/dashboard.webp" alt="dashboard" width={400} height={400} />
                </InlineStack>
                <Text as="p" variant="headingSm" alignment="center">You’re a guest user.</Text>
                <Text as="p" variant="headingSm" alignment="center">Your account have not been assign a specific role, you need to wait for the leader to approve and assign a role</Text>
            </Card>
        </Page>
    )
}