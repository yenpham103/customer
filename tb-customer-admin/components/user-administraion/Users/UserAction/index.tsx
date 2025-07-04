import { BlockStack, Box, Button, ButtonGroup, InlineStack } from '@shopify/polaris'
import { PersonAddIcon } from '@shopify/polaris-icons'
import React, { useCallback } from 'react'

export default function UserAction() {
    const handleRestore = useCallback(() => {
        console.log('Restore');
    }, []);

    const handleRequest = useCallback(() => {
        console.log('handleRequest');
    }, []);

    const handleImport = useCallback(() => {
        console.log('handleImport');
    }, []);

    const handleAddUser = useCallback(() => {
        console.log('Add user clicked');
    }, []);
    
    return (
        <BlockStack gap="0">
            <Box padding="200" paddingBlockStart="400">
                <InlineStack align="end" blockAlign="end" gap="400">
                    <ButtonGroup>
                        <Button variant='plain' onClick={handleRestore}>
                            Restore
                        </Button>
                        <Button variant='tertiary' onClick={handleRequest}>
                            Request
                        </Button>
                        <Button onClick={handleImport}>
                            Import
                        </Button>
                        <Button icon={PersonAddIcon} variant="primary" onClick={handleAddUser}>
                            Add User
                        </Button>
                    </ButtonGroup>
                </InlineStack>
            </Box>
        </BlockStack>
    )
}
