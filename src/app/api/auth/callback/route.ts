import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import wixClient from "@/lib/wixClient";
import {
  clearOAuthDataCookie,
  readOAuthDataCookie,
  setAdminFlagCookie,
  setTokensCookie,
} from "@/lib/wixAuthCookies";
import { getAdminAllowlist, getAdminMemberIdAllowlist } from "@/lib/adminAuth";

async function getTokenInfo(token: string) {
  const res = await fetch("https://www.wixapis.com/oauth2/token-info", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) {
    throw new Error(`token-info failed: ${res.status}`);
  }
  return (await res.json()) as any;
}

async function getCurrentMember(token: string) {
  const res = await fetch("https://www.wixapis.com/members/v1/members/my", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`members/my failed: ${res.status}`);
  }

  return (await res.json()) as any;
}

function firstEmailCandidate(candidates: unknown[]): string | undefined {
  for (const value of candidates) {
    if (typeof value !== "string") continue;
    const normalized = value.trim();
    if (!normalized.includes("@")) continue;
    return normalized;
  }
  return undefined;
}

function extractEmail(payload: any): string | undefined {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  return firstEmailCandidate([
    payload?.email,
    payload?.memberEmail,
    payload?.loginEmail,
    payload?.member?.email,
    payload?.member?.memberEmail,
    payload?.member?.loginEmail,
    payload?.member?.profile?.email,
    payload?.member?.contact?.email,
    payload?.profile?.email,
    payload?.contact?.email,
    payload?.contact?.primaryEmail,
    Array.isArray(payload?.contact?.emails)
      ? payload.contact.emails[0]
      : undefined,
  ]);
}

function extractMemberId(tokenInfo: any, memberInfo: any): string | undefined {
  const candidates = [
    tokenInfo?.subjectId,
    tokenInfo?.memberId,
    memberInfo?.member?.id,
    memberInfo?.member?._id,
    memberInfo?.member?.memberId,
  ];

  for (const value of candidates) {
    if (typeof value !== "string") continue;
    const normalized = value.trim();
    if (!normalized) continue;
    return normalized;
  }

  return undefined;
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const cookieStore = await cookies();

  const oauthData = readOAuthDataCookie(cookieStore);
  clearOAuthDataCookie(cookieStore);

  if (!oauthData) {
    return NextResponse.redirect(new URL("/login", url.origin));
  }

  const parsed = wixClient.auth.parseFromUrl(url.toString(), "query");
  if (parsed.error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(parsed.error)}`, url.origin),
    );
  }

  const tokens = await wixClient.auth.getMemberTokens(
    parsed.code,
    parsed.state,
    {
      codeVerifier: oauthData.codeVerifier,
      codeChallenge: oauthData.codeChallenge,
      state: oauthData.state,
      originalUri: oauthData.originalUri,
      redirectUri: oauthData.redirectUri,
    },
  );

  // Try token-info first; if missing, fallback to members/my.
  let email: string | undefined;
  let emailSource: "token-info" | "members-my" | "none" = "none";
  let memberId: string | undefined;
  let tokenInfo: any;
  let memberInfo: any;

  try {
    tokenInfo = await getTokenInfo(tokens.accessToken.value);
    email = extractEmail(tokenInfo);
    if (email) {
      emailSource = "token-info";
    }
  } catch {
    // ignore; fallback below
  }

  if (!email) {
    try {
      memberInfo = await getCurrentMember(tokens.accessToken.value);
      email = extractEmail(memberInfo);
      if (email) {
        emailSource = "members-my";
      }
    } catch {
      // ignore
    }
  }

  memberId = extractMemberId(tokenInfo, memberInfo);

  setTokensCookie(cookieStore, tokens, { email, memberId });

  const emailAllowlist = getAdminAllowlist();
  const memberIdAllowlist = getAdminMemberIdAllowlist();

  const emailAllowed = email
    ? emailAllowlist.includes(email.toLowerCase())
    : false;

  const memberIdAllowed = memberId
    ? memberIdAllowlist.includes(memberId)
    : false;

  const isAdmin = emailAllowed || memberIdAllowed;
  setAdminFlagCookie(cookieStore, isAdmin);

  if (process.env.NODE_ENV !== "production") {
    console.log("[auth/callback] Admin evaluation", {
      email: email || null,
      emailSource,
      memberId: memberId || null,
      isAdmin,
      emailAllowlist,
      memberIdAllowlist,
      emailAllowed,
      memberIdAllowed,
      tokenInfoKeys:
        tokenInfo && typeof tokenInfo === "object"
          ? Object.keys(tokenInfo)
          : null,
      memberInfoKeys:
        memberInfo && typeof memberInfo === "object"
          ? Object.keys(memberInfo)
          : null,
      memberPayloadKeys:
        memberInfo?.member && typeof memberInfo.member === "object"
          ? Object.keys(memberInfo.member)
          : null,
      redirectTo: oauthData.originalUri || "/",
    });
  }

  const dest = oauthData.originalUri || "/";
  return NextResponse.redirect(new URL(dest, url.origin));
}
