import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// PUT /api/user/notion-database - Update user's Notion database ID
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { databaseId } = await request.json();

    if (!databaseId) {
      return NextResponse.json(
        { error: "Database ID is required" },
        { status: 400 }
      );
    }

    await supabase
      .from("users")
      .update({ notion_database_id: databaseId })
      .eq("id", user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update Notion database ID:", error);
    return NextResponse.json(
      { error: "Failed to update database ID" },
      { status: 500 }
    );
  }
}
