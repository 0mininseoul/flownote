import { NextResponse } from "next/server";
import { getSlackAuthUrl } from "@/lib/services/slack";

// GET /api/auth/slack - Redirect to Slack OAuth
export async function GET() {
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/slack/callback`;
  const authUrl = getSlackAuthUrl(redirectUri);

  return NextResponse.redirect(authUrl);
}
