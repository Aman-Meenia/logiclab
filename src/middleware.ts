import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXT_AUTH_SECRET,
  });
  const url = request.nextUrl;

  if (
    (token && url.pathname === "/login") ||
    (token && url.pathname === "/signup") ||
    (!token && url.pathname === "/profile") ||
    (!token && url.pathname === "/submissions")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}
