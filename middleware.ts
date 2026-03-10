import { NextResponse, type NextRequest } from "next/server";

const TOKENS_COOKIE = "wix_tokens";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const isProtectedArea =
    pathname.startsWith("/admin") || pathname.startsWith("/house");

  if (!isProtectedArea) {
    return NextResponse.next();
  }

  // Allow the callback endpoints even if not logged in
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const hasTokens = Boolean(req.cookies.get(TOKENS_COOKIE)?.value);
  if (!hasTokens) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/house/:path*"],
};
