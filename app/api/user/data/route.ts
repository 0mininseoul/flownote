import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// DELETE /api/user/data - Delete all user data
export async function DELETE() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all recordings
    const { data: recordings } = await supabase
      .from("recordings")
      .select("audio_file_path")
      .eq("user_id", user.id);

    // Delete all audio files
    if (recordings && recordings.length > 0) {
      const filePaths = recordings.map((r) => r.audio_file_path);
      await supabase.storage.from("recordings").remove(filePaths);
    }

    // Delete all recordings (cascade will handle this, but explicit is better)
    await supabase.from("recordings").delete().eq("user_id", user.id);

    // Delete all custom formats
    await supabase.from("custom_formats").delete().eq("user_id", user.id);

    // Reset user data
    await supabase
      .from("users")
      .update({
        notion_access_token: null,
        notion_database_id: null,
        slack_access_token: null,
        slack_channel_id: null,
        monthly_minutes_used: 0,
      })
      .eq("id", user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
