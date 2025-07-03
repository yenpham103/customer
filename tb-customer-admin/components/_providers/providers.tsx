'use client';

import type React from "react"
import { SWRConfig } from 'swr'
import { AuthProvider } from "@/components/_providers/auth-provider"
import { PolarisProvider } from "@/components/_providers/polaris-provider"
import axiosClient from "@/api-client/axios-client";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <SWRConfig
                value={{
                    fetcher: (url) => {
                        if (Array.isArray(url)) {
                            return axiosClient.get(url[0], { params: url[1] });
                        } else {
                            return axiosClient.get(url);
                        }
                    },
                    shouldRetryOnError: false,
                }}
            >
                <PolarisProvider>
                    {children}
                </PolarisProvider>
            </SWRConfig>
        </AuthProvider>
    )
}