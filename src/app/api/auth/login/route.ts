import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import wixClient from "@/lib/wixClient";
import { setOAuthDataCookie } from "@/lib/wixAuthCookies";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const next = url.searchParams.get("next") || "/";

  const redirectUri = `${url.origin}/api/auth/callback`;

  const oauthData = wixClient.auth.generateOAuthData(redirectUri, next);
  const cookieStore = await cookies();
  setOAuthDataCookie(cookieStore, {
    ...oauthData,
    originalUri: next,
    redirectUri,
    createdAt: Date.now(),
  });

  const { authUrl } = await wixClient.auth.getAuthUrl(oauthData, {
    prompt: "login",
    responseMode: "query",
  });

  return NextResponse.redirect(authUrl);
}
