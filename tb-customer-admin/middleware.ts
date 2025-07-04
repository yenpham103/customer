import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const hasPermission = (permissions: Record<string, boolean>, page: string, action: 'view' | 'edit') => {
  if (!permissions) return false;

  let pageName = page;
  if (page === 'store-data') pageName = 'storeData';
  if (page === 'admin') pageName = 'userAdministration';
  if (page === 'ignored-nicknames') pageName = 'ignoredNicknames';

  const permissionKey = `${pageName}${action.charAt(0).toUpperCase() + action.slice(1)}`;
  return permissions[permissionKey] === true;
};

export async function middleware(request: NextRequest) {
  const session = await auth();

  const protectedRoutes = [
    "/dashboard",
    "/conversations",
    "/operators",
    "/store-data",
    "/admin"
  ];

  const guestDashboardRoute = "/guest-dashboard";
  const unauthorizedRoute = "/unauthorized";

  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  const isGuestDashboard = request.nextUrl.pathname.startsWith(guestDashboardRoute);
  const isUnauthorizedPage = request.nextUrl.pathname.startsWith(unauthorizedRoute);

  if (isUnauthorizedPage) {
    return NextResponse.next();
  }

  if (isProtectedRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (!session.user.role) {
      return NextResponse.redirect(new URL("/guest-dashboard", request.url));
    }

    const pathSegments = request.nextUrl.pathname.split('/').filter(Boolean);
    const page = pathSegments[0];
    if (session.user.role === 'root') {
      return NextResponse.next();
    }

    if (session.user.permissions) {
      const hasViewPermission = hasPermission(session.user.permissions, page, 'view');

      if (!hasViewPermission) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } else {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
  }

  if (isGuestDashboard) {
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (session.user.role) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}