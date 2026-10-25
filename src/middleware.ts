import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.globalRole === "PLATFORM_ADMIN";
  const hasCompany = !!req.auth?.user?.activeCompanyId;

  if (pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      const url = new URL("/connexion", req.nextUrl.origin);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    if (!hasCompany && !isAdmin) {
      return NextResponse.redirect(new URL("/compte", req.nextUrl.origin));
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const url = new URL("/connexion", req.nextUrl.origin);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
  }

  if (isLoggedIn && (pathname === "/connexion" || pathname === "/inscription")) {
    if (hasCompany) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
    }
    return NextResponse.redirect(new URL("/compte", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/connexion", "/inscription"],
};
