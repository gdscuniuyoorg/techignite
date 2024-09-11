import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(req: any) {
  const hostname = req.headers.get("host");
  const subdomain = hostname.split(".")[0];

  if (subdomain === "ticket") {
    return NextResponse.rewrite(`/ticket/${req.nextUrl.pathname}`);
  }

  // Default behavior for the primary domain
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
