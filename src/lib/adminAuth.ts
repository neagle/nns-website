import { cookies } from "next/headers";
import { readTokensCookie } from "@/lib/wixAuthCookies";

export type MemberRole = "none" | "house" | "admin";

const ROLE_ORDER: Record<MemberRole, number> = {
  none: 0,
  house: 1,
  admin: 2,
};

export async function isLoggedIn() {
  const cookieStore = await cookies();
  const tokens = readTokensCookie(cookieStore);
  return Boolean(tokens?.refreshToken?.value);
}

export async function isAdmin() {
  return hasRole("admin");
}

export async function hasRole(requiredRole: Exclude<MemberRole, "none">) {
  const cookieStore = await cookies();
  const tokens = readTokensCookie(cookieStore);
  const role = resolveMemberRole({
    email: tokens?.email,
    memberId: tokens?.memberId,
  });

  return ROLE_ORDER[role] >= ROLE_ORDER[requiredRole];
}

export async function requireAdmin() {
  return requireRole("admin");
}

export async function requireRole(requiredRole: Exclude<MemberRole, "none">) {
  const cookieStore = await cookies();
  const tokens = readTokensCookie(cookieStore);
  const loggedIn = Boolean(tokens?.refreshToken?.value);
  const role: MemberRole = loggedIn
    ? resolveMemberRole({
        email: tokens?.email,
        memberId: tokens?.memberId,
      })
    : "none";

  const authorized = ROLE_ORDER[role] >= ROLE_ORDER[requiredRole];
  return { loggedIn, role, authorized };
}

export function getAdminAllowlist(): string[] {
  const raw = process.env.ADMIN_EMAIL_ALLOWLIST || "";
  const parts = raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  return Array.from(new Set(parts));
}

export function getAdminMemberIdAllowlist(): string[] {
  const raw = process.env.ADMIN_MEMBER_ID_ALLOWLIST || "";
  const parts = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return Array.from(new Set(parts));
}

export function getHouseAllowlist(): string[] {
  const raw = process.env.HOUSE_EMAIL_ALLOWLIST || "";
  const parts = raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  return Array.from(new Set(parts));
}

export function getHouseMemberIdAllowlist(): string[] {
  const raw = process.env.HOUSE_MEMBER_ID_ALLOWLIST || "";
  const parts = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return Array.from(new Set(parts));
}

export function computeAdminAccess({
  email,
  memberId,
}: {
  email?: string | null;
  memberId?: string | null;
}): boolean {
  const emailAllowlist = getAdminAllowlist();
  const memberIdAllowlist = getAdminMemberIdAllowlist();

  const normalizedEmail = typeof email === "string" ? email.toLowerCase() : "";
  const normalizedMemberId = typeof memberId === "string" ? memberId : "";

  const emailAllowed =
    Boolean(normalizedEmail) && emailAllowlist.includes(normalizedEmail);
  const memberIdAllowed =
    Boolean(normalizedMemberId) &&
    memberIdAllowlist.includes(normalizedMemberId);

  return emailAllowed || memberIdAllowed;
}

export function computeHouseAccess({
  email,
  memberId,
}: {
  email?: string | null;
  memberId?: string | null;
}): boolean {
  const emailAllowlist = getHouseAllowlist();
  const memberIdAllowlist = getHouseMemberIdAllowlist();

  const normalizedEmail = typeof email === "string" ? email.toLowerCase() : "";
  const normalizedMemberId = typeof memberId === "string" ? memberId : "";

  const emailAllowed =
    Boolean(normalizedEmail) && emailAllowlist.includes(normalizedEmail);
  const memberIdAllowed =
    Boolean(normalizedMemberId) &&
    memberIdAllowlist.includes(normalizedMemberId);

  return emailAllowed || memberIdAllowed;
}

export function resolveMemberRole({
  email,
  memberId,
}: {
  email?: string | null;
  memberId?: string | null;
}): MemberRole {
  if (computeAdminAccess({ email, memberId })) {
    return "admin";
  }

  if (computeHouseAccess({ email, memberId })) {
    return "house";
  }

  return "none";
}
