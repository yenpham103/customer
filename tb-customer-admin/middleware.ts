import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const session = await auth()

  // Check if the user is trying to access a protected route
  if (
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/conversations") ||
    request.nextUrl.pathname.startsWith("/operators") ||
    request.nextUrl.pathname.startsWith("/store-data")
  ) {
    if (!session) {
      // Redirect to the home page if not authenticated
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
