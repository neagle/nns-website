import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  clearAdminFlagCookie,
  clearTokensCookie,
} from "@/lib/wixAuthCookies";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const next = url.searchParams.get("next") || "/";

  const cookieStore = await cookies();
  clearTokensCookie(cookieStore);
  clearAdminFlagCookie(cookieStore);

  return NextResponse.redirect(new URL(next, url.origin));
}
