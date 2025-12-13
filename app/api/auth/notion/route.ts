import { NextRequest, NextResponse } from "next/server";
import { getNotionAuthUrl } from "@/lib/services/notion";

// GET /api/auth/notion - Redirect to Notion OAuth
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const returnTo = searchParams.get("returnTo");
  const selectDb = searchParams.get("selectDb");

  // Use environment variable for redirect URI to ensure consistency with Notion developer console
  const redirectUri = process.env.NOTION_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/notion/callback`;

  console.log("[Notion Auth] Using redirect URI:", redirectUri);

  const state = returnTo ? JSON.stringify({ returnTo, selectDb }) : undefined;
  const authUrl = getNotionAuthUrl(redirectUri, state);

  return NextResponse.redirect(authUrl);
}
