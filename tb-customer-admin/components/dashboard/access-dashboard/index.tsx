'use client';
import { Card, LegacyStack, List, Page, Text } from '@shopify/polaris';
import Image from 'next/image';
import newFlowPic from '@/public/images/flow_customer.png';
import { useRouter } from 'next/navigation';

export default function AccessDashboard() {
    const router = useRouter();

    const handleOpenFlowImage = () => {
        router.push(newFlowPic.src);
    };

    return (
        <Page title="Dashboard">
            <Card padding="400">
                <LegacyStack vertical>
                    <Text as="p" variant="headingSm" alignment="center">
                        Welcome to SBC Team B - Customer, a powerful tool designed to support customers more effectively
                        and efficiently. This user guide will walk you through the features and functionalities of the
                        app, enabling you to provide exceptional customer support. Let&apos;s get started!
                    </Text>
                    <List type="number">
                        <List.Item>
                            <Text as='h2' variant="headingMd" fontWeight="semibold">
                                Installation and Setup:
                            </Text>
                            <Text as='p'>- This is the cloud app, no need to setup.</Text>
                            <Text as='p'>
                                - Admin will grant the necessary permissions for the app to access your store&apos;s
                                theme and app configuration.
                            </Text>
                        </List.Item>
                        <List.Item>
                            <Text as='h2' variant="headingMd" fontWeight="semibold">
                                Supporting Customers:
                            </Text>
                            <Text as='p'>
                                SBC Team B - Customer simplifies the customer support process, allowing you to provide
                                assistance quickly and conveniently. Previously, you needed access from the customer
                                support team to check the app configuration and theme. With SBC Team B - Customer, as
                                long as the customer installs the app, you can read their theme and app configuration
                                and proceed with necessary edits. This eliminates the need for additional access and
                                streamlines the support workflow.
                            </Text>
                        </List.Item>
                        <List.Item>
                            <Text as='h2' variant="headingMd" fontWeight="semibold">
                                User Guide Tab:
                            </Text>
                            <Text as='p'>
                                The User Guide tab within the SBC Team B - Customer provides comprehensive information on
                                how to utilize the app effectively. You can access this tab to explore additional
                                functionalities, tips, and best practices for using the app to its full potential.
                            </Text>
                        </List.Item>
                        <List.Item>
                            <Text as='h2' variant="headingMd" fontWeight="semibold">
                                Old Workflow vs. New Workflow:
                            </Text>
                            <Text as="p">
                                <Text as='h3' fontWeight="semibold">Old Workflow:</Text>
                                <List>
                                    <List.Item>Customer Support Team receives a help request from customers.</List.Item>
                                    <List.Item>Collaborator access request is sent to the customer.</List.Item>
                                    <List.Item>
                                        Customer support team accesses the store, checks the app configuration and
                                        theme.
                                    </List.Item>
                                    <List.Item>A PMS task is created to address the reported issue.</List.Item>
                                    <List.Item>
                                        The task is forwarded to the development team for checking and resolution.
                                    </List.Item>
                                    <List.Item>Support team recheck & contact customers.</List.Item>
                                </List>
                            </Text>
                            <Text as="p">
                                <br />
                                <Text as='h3' fontWeight="semibold">New Workflow:</Text>
                                <List>
                                    <List.Item>Customer Support Team receives a help request from customers.</List.Item>
                                    <List.Item>
                                        Customer support team creates a PMS task right away with the store domain of the
                                        customer & shares the store access with the dev.
                                    </List.Item>
                                    <List.Item>
                                        The developer can access the store directly within the SBC Team B - Customer.
                                    </List.Item>
                                    <List.Item>
                                        The developer promptly checks and fixes the reported issue & gets back to the
                                        customer support team if need any help for store access.
                                    </List.Item>
                                    <List.Item>
                                        Meanwhile, the customer can still send the collaborator request for additional
                                        access.
                                    </List.Item>
                                    <List.Item>
                                        The customer support team performs a double-check to ensure all necessary edits
                                        and fixes have been implemented.
                                    </List.Item>
                                </List>
                            </Text>
                            <Image
                                alt="new-flow"
                                src={newFlowPic}
                                style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                                onClick={handleOpenFlowImage}
                            />
                            <Text as='p' fontWeight="semibold" alignment="center">
                                Click image to view
                            </Text>
                        </List.Item>
                        <List.Item>
                            <Text as="h2" variant="headingMd" fontWeight="semibold">
                                {' '}
                                App Functionality:
                            </Text>
                            <Text as="p">
                                <Text fontWeight="semibold" as="span">
                                    Theme and Config Access:
                                </Text>
                                &nbsp;SBC Team B - Customer allows you to access and read the theme and configuration of
                                a customer&apos;s app effortlessly. This feature enables you to gain insights into their
                                working environment, customize the app as per their requirements, and provide effective
                                support.
                            </Text>
                            <Text as="p">
                                <Text fontWeight="semibold" as="span">
                                    Visual Editor:
                                </Text>
                                &nbsp;The app provides a user-friendly visual editor interface, allowing you to browse
                                through the resources of the customer&apos;s app and make necessary changes safely. You
                                can modify the app&apos;s theme, configuration, and other components easily, ensuring
                                the customer receives the best possible support.
                            </Text>
                            <Text as="p">
                                We hope this user guide helps you utilize SBC Team B - Customer efficiently to provide
                                excellent customer support. If you have any further questions or need assistance, please
                                refer to the User Guide tab or contact our support team.
                            </Text>
                        </List.Item>
                    </List>
                </LegacyStack>
            </Card>
        </Page>
    );
}
