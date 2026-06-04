import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE = "admin_session";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Login page is always accessible
  if (pathname === "/admin/login") return NextResponse.next();

  const session = req.cookies.get(ADMIN_COOKIE);
  if (!session || session.value !== "1") {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
