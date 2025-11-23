import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?message=${encodeURIComponent(error.message)}`
      );
    }

    if (!data.session) {
      console.error("No session returned after code exchange");
      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?message=No session created`
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Check if user exists in our users table
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 is "not found" error, which is expected for new users
        console.error("Error fetching user:", fetchError);
      }

      // If user doesn't exist, create them
      if (!existingUser) {
        const { error: insertError } = await supabase.from("users").insert({
          id: user.id,
          email: user.email!,
          google_id: user.user_metadata.sub,
        });

        if (insertError) {
          console.error("Error creating user:", insertError);
          return NextResponse.redirect(
            `${origin}/auth/auth-code-error?message=${encodeURIComponent("Failed to create user profile")}`
          );
        }
      }
    }

    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";

    if (isLocalEnv) {
      return NextResponse.redirect(`${origin}${next}`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`);
    } else {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error?message=No authorization code provided`);
}
