import { NextResponse } from "next/server";
import { getNotionAuthUrl } from "@/lib/services/notion";

// GET /api/auth/notion - Redirect to Notion OAuth
export async function GET() {
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/notion/callback`;
  const authUrl = getNotionAuthUrl(redirectUri);

  return NextResponse.redirect(authUrl);
}
