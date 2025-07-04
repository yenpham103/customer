/* eslint-disable  @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"
import { authApi } from "./api-client";

// Extend the User type to include 'role'
declare module "next-auth" {
  interface User {
    role?: string | null;
    permissions?: Record<string, boolean> | null;
  }
  interface Session {
    user: User & {
      id: string;
      role?: string | null;
      permissions?: Record<string, boolean> | null;
    };
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
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isPrivate = nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/conversations") ||
        nextUrl.pathname.startsWith("/operators") ||
        nextUrl.pathname.startsWith("/store-data")

      if (isPrivate) {
        if (isLoggedIn) {
          if (!auth.user.role && !nextUrl.pathname.startsWith("/guest-dashboard")) {
            return Response.redirect(new URL("/guest-dashboard", nextUrl));
          }
          return true;
        }
        return false
      } else if (isLoggedIn) {
        return true
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        try {
          let result = null;
          try {
            const response = await authApi.getUserByEmail(token.email as string);
            result = response.data;
          } catch (error: any) {
            if (error.response?.status === 404 || !result) {
              const createResponse = await authApi.createUser({
                email: token.email as string,
                name: token.name as string,
                avatar: token.picture as string
              });

              if (createResponse.data?.success) {
                result = {
                  success: true,
                  data: {
                    user: createResponse.data.data.user,
                    permissions: null
                  }
                };
              }
            }
          }

          if (result?.success && result?.data?.user) {
            try {
              await authApi.updateUserLastLogin(result.data.user._id);
            } catch (error) {
              console.error('Update last login error:', error);
            }
            session.user.id = result.data.user._id;
            session.user.role = result.data.user.role;
            session.user.permissions = result.data.permissions;
          }

        } catch (error) {
          console.error('Session callback error:', error);
          session.user.role = null;
          session.user.permissions = null;
        }
      }
      return session
    },
  },
} satisfies NextAuthConfig

export const { auth, signIn, signOut, handlers } = NextAuth(config)
