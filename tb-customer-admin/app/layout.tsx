import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/_providers/providers"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Customers Service | SBC Team B",
  description: "An internal tool for managing customers by SBC Team B",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
