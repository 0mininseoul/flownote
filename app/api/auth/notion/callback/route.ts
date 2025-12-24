import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { exchangeNotionCode } from "@/lib/services/notion";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Parse returnTo and selectDb from state
  let returnTo = "/onboarding";
  let selectDb = false;
  if (state) {
    try {
      const parsed = JSON.parse(state);
      returnTo = parsed.returnTo || returnTo;
      selectDb = parsed.selectDb === "true";
    } catch (e) {
      console.error("Failed to parse state:", e);
    }
  }

  if (error) {
    return NextResponse.redirect(
      `${appUrl}${returnTo}?error=notion_auth_failed`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${appUrl}${returnTo}?error=no_code`
    );
  }

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(`${appUrl}/`);
    }

    // Exchange code for access token
    // IMPORTANT: The redirect_uri must match exactly what was used in the initial auth request
    const redirectUri = process.env.NOTION_REDIRECT_URI || `${appUrl}/api/auth/notion/callback`;
    console.log("[Notion Callback] Using redirect URI:", redirectUri);

    const { access_token } = await exchangeNotionCode(code, redirectUri);
    console.log("[Notion Callback] Got access token, updating DB for user:", user.id);

    // Update user with Notion credentials
    const { error: updateError } = await supabase
      .from("users")
      .update({
        notion_access_token: access_token,
        // notion_database_id: will be set later when user selects
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("[Notion Callback] DB update error:", updateError);
      return NextResponse.redirect(
        `${appUrl}${returnTo}?error=db_update_failed`
      );
    }

    console.log("[Notion Callback] Successfully saved token to DB");

    const redirectUrl = new URL(`${appUrl}${returnTo}`);
    redirectUrl.searchParams.set("notion", "connected");
    if (selectDb) {
      redirectUrl.searchParams.set("selectDb", "true");
    }
    return NextResponse.redirect(redirectUrl.toString());
  } catch (err) {
    console.error("Notion OAuth error:", err);
    return NextResponse.redirect(
      `${appUrl}${returnTo}?error=notion_exchange_failed`
    );
  }
}
