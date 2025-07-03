import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

// Extend the User type to include 'role'
declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: User;
  }
}

export const config = {
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isPrivate = nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/conversations") ||
        nextUrl.pathname.startsWith("/operators") ||
        nextUrl.pathname.startsWith("/store-data")

      if (isPrivate) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return true
      }
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        if (session.user.email === "dangnm@bsscommerce.com" || session.user.email === "yenpx@bsscommerce.com") {
          session.user.role = "admin";
        }
      }
      return session
    },
  },
} satisfies NextAuthConfig

export const { auth, signIn, signOut, handlers } = NextAuth(config)
