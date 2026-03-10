import Link from "next/link";
import { cookies } from "next/headers";
import { readTokensCookie } from "@/lib/wixAuthCookies";
import {
  computeHouseAccess,
  computeAdminAccess,
  getAdminAllowlist,
  getAdminMemberIdAllowlist,
  getHouseAllowlist,
  getHouseMemberIdAllowlist,
  resolveMemberRole,
} from "@/lib/adminAuth";

export default async function ForbiddenPage() {
  const cookieStore = await cookies();
  const tokens = readTokensCookie(cookieStore);
  const email = tokens?.email || null;
  const memberId = tokens?.memberId || null;
  const loggedIn = Boolean(tokens?.refreshToken?.value);
  const role = resolveMemberRole({ email, memberId });
  const isHouse = computeHouseAccess({ email, memberId });
  const isAdmin = computeAdminAccess({ email, memberId });
  const adminEmailAllowlist = getAdminAllowlist();
  const adminMemberIdAllowlist = getAdminMemberIdAllowlist();
  const houseEmailAllowlist = getHouseAllowlist();
  const houseMemberIdAllowlist = getHouseMemberIdAllowlist();

  return (
    <div className="p-4 md:p-6 xl:p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-2">403</h1>
      <p className="opacity-80 mb-4">You don’t have access to this page.</p>
      <div className="flex gap-3">
        <Link className="btn btn-primary" href="/">
          Go home
        </Link>
        <a className="btn" href="/api/auth/logout?next=/">
          Log out
        </a>
      </div>

      {process.env.NODE_ENV !== "production" && (
        <div className="mt-6 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm">
          <h2 className="font-semibold mb-2">Auth Debug (dev only)</h2>
          <pre className="whitespace-pre-wrap break-all">
            {JSON.stringify(
              {
                loggedIn,
                role,
                isHouse,
                isAdmin,
                email,
                memberId,
                adminEmailAllowlist,
                adminMemberIdAllowlist,
                houseEmailAllowlist,
                houseMemberIdAllowlist,
              },
              null,
              2,
            )}
          </pre>
        </div>
      )}
    </div>
  );
}
