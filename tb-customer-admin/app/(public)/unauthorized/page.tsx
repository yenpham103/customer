'use client'

import {  Card, Text, BlockStack, Button, InlineStack, Banner } from '@shopify/polaris'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Unauthorized() {
    const { data: session } = useSession()
    const router = useRouter()

    const handleGoBack = () => {
        router.back()
    }

    const handleGoHome = () => {
        if (session?.user?.role) {
            router.push('/dashboard')
        } else {
            router.push('/guest-dashboard')
        }
    }

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' })
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{ maxWidth: '500px', width: '100%' }}>
                <Card>
                    <BlockStack gap="600">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: '#fee',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                                fontSize: '32px'
                            }}>
                                🚫
                            </div>

                            <Text as="h1" variant="headingLg">
                                Access Denied
                            </Text>
                        </div>

                        <Banner tone="critical">
                            <Text as="p">
                                You don't have permission to access this page.
                            </Text>
                        </Banner>

                        <Card>
                            <BlockStack gap="400">
                                <Text as="h2" variant="headingMd" tone="critical">
                                    Insufficient Permissions
                                </Text>

                                <Text as="p">
                                    Your current role <Text as="span" fontWeight="bold">({session?.user?.role || 'No Role'})</Text>
                                    {" "}doesn't include the required permissions to access this page.
                                </Text>

                                <Text as="p" variant="bodySm" tone="subdued">
                                    If you believe this is an error, please contact the Root administrator.
                                </Text>
                            </BlockStack>
                        </Card>

                        <Card>
                            <BlockStack gap="300">
                                <Text as="h3" variant="headingMd">
                                    Contact Information
                                </Text>

                                <Text as="p" variant="bodySm">
                                    Root Administrator: <Text as="span" fontWeight="medium">yenpx@bsscommerce.com</Text>
                                </Text>
                            </BlockStack>
                        </Card>

                        <InlineStack gap="200" align="center">
                            <Button variant="secondary" onClick={handleGoBack}>
                                Go Back
                            </Button>

                            <Button onClick={handleGoHome}>
                                {session?.user?.role ? 'Dashboard' : 'Guest Dashboard'}
                            </Button>

                            <Button variant="primary" tone="critical" onClick={handleSignOut}>
                                Sign Out
                            </Button>
                        </InlineStack>
                    </BlockStack>
                </Card>
            </div>
        </div>
    )
}