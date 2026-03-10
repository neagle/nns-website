import type { Tokens } from "@wix/sdk";
import type { cookies } from "next/headers";

// NOTE: This is a POC cookie format. It is NOT encrypted.
// For production: encrypt/sign + rotate + keep payload minimal.

export const WIX_TOKENS_COOKIE = "wix_tokens";
export const WIX_OAUTH_DATA_COOKIE = "wix_oauth_data";
export const ADMIN_FLAG_COOKIE = "is_admin";

export type CookieStore = Awaited<ReturnType<typeof cookies>>;

export type OAuthDataCookie = {
  codeVerifier: string;
  codeChallenge: string;
  state: string;
  originalUri: string;
  redirectUri: string;
  createdAt: number;
};

export type TokensCookie = {
  accessToken: { value: string; expiresAt: number };
  refreshToken: { value: string; role: string };
  createdAt: number;
  // Optional convenience fields
  email?: string;
  memberId?: string;
};

function encode(obj: unknown) {
  return Buffer.from(JSON.stringify(obj), "utf8").toString("base64url");
}

function decode<T>(value: string): T {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T;
}

export function setOAuthDataCookie(
  cookieStore: CookieStore,
  data: OAuthDataCookie,
) {
  cookieStore.set(WIX_OAUTH_DATA_COOKIE, encode(data), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60, // 10 minutes
  });
}

export function readOAuthDataCookie(
  cookieStore: CookieStore,
): OAuthDataCookie | null {
  const raw = cookieStore.get(WIX_OAUTH_DATA_COOKIE)?.value;
  if (!raw) return null;
  try {
    return decode<OAuthDataCookie>(raw);
  } catch {
    return null;
  }
}

export function clearOAuthDataCookie(cookieStore: CookieStore) {
  cookieStore.set(WIX_OAUTH_DATA_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function setTokensCookie(
  cookieStore: CookieStore,
  tokens: Tokens,
  extra?: { email?: string; memberId?: string },
) {
  const payload: TokensCookie = {
    accessToken: {
      value: tokens.accessToken.value,
      expiresAt: tokens.accessToken.expiresAt,
    },
    refreshToken: {
      value: tokens.refreshToken.value,
      role: tokens.refreshToken.role,
    },
    createdAt: Date.now(),
    ...(extra?.email ? { email: extra.email } : {}),
    ...(extra?.memberId ? { memberId: extra.memberId } : {}),
  };

  cookieStore.set(WIX_TOKENS_COOKIE, encode(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export function readTokensCookie(
  cookieStore: CookieStore,
): TokensCookie | null {
  const raw = cookieStore.get(WIX_TOKENS_COOKIE)?.value;
  if (!raw) return null;
  try {
    return decode<TokensCookie>(raw);
  } catch {
    return null;
  }
}

export function clearTokensCookie(cookieStore: CookieStore) {
  cookieStore.set(WIX_TOKENS_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function setAdminFlagCookie(cookieStore: CookieStore, isAdmin: boolean) {
  cookieStore.set(ADMIN_FLAG_COOKIE, isAdmin ? "1" : "0", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export function readAdminFlagCookie(cookieStore: CookieStore): boolean {
  return cookieStore.get(ADMIN_FLAG_COOKIE)?.value === "1";
}

export function clearAdminFlagCookie(cookieStore: CookieStore) {
  cookieStore.set(ADMIN_FLAG_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
