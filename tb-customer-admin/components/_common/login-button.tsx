"use client"

import { signIn } from "next-auth/react"
import { Button } from "@shopify/polaris"

export function LoginButton() {
  return (
    <Button variant="primary" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
      Sign in with Google
    </Button>
  )
}
