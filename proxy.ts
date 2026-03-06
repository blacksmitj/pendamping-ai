import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/participants/:path*",
        "/logbooks/:path*",
        "/outputs/:path*",
        "/admin/:path*",
        "/supervisor/:path*",
        "/super/:path*",
        "/settings/:path*",
        "/account/:path*",
        "/login",
        "/register",
    ],
};

export function proxy(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    const { pathname } = request.nextUrl;

    // Redirect authenticated users away from auth pages
    if (sessionCookie && ["/login", "/register"].includes(pathname)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Redirect unauthenticated users to login
    const protectedPrefixes = [
        "/dashboard", "/participants", "/logbooks", "/outputs",
        "/admin", "/supervisor", "/super", "/settings", "/account",
    ];
    if (!sessionCookie && protectedPrefixes.some((p) => pathname.startsWith(p))) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}
