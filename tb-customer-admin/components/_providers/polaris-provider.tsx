"use client"

import type React from "react"

import { useEffect } from "react"
import { AppProvider } from "@shopify/polaris"
import "@shopify/polaris/build/esm/styles.css"
import enTranslations from "@shopify/polaris/locales/en.json"

export function PolarisProvider({ children }: { children: React.ReactNode }) {
  // Fix Polaris styles in Next.js
  useEffect(() => {
    document.body.classList.add("p-0", "m-0")
  }, [])

  return <AppProvider i18n={enTranslations}>{children}</AppProvider>
}
