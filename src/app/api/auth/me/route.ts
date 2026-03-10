import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  computeAdminAccess,
  computeHouseAccess,
  isLoggedIn,
  resolveMemberRole,
} from "@/lib/adminAuth";
import { readTokensCookie } from "@/lib/wixAuthCookies";

export async function GET() {
  const cookieStore = await cookies();
  const tokens = readTokensCookie(cookieStore);
  const email = tokens?.email || null;
  const memberId = tokens?.memberId || null;

  return NextResponse.json({
    loggedIn: await isLoggedIn(),
    role: resolveMemberRole({ email, memberId }),
    isAdmin: computeAdminAccess({ email, memberId }),
    isHouse: computeHouseAccess({ email, memberId }),
    email,
    memberId,
  });
}
