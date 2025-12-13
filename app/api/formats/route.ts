import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const MAX_FORMATS = 3;

// GET /api/formats - List custom formats
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: formats, error } = await supabase
      .from("custom_formats")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ formats });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/formats - Create custom format
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, prompt, is_default } = await request.json();

    if (!name || !prompt) {
      return NextResponse.json(
        { error: "Name and prompt are required" },
        { status: 400 }
      );
    }

    // Check current format count
    const { count } = await supabase
      .from("custom_formats")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (count !== null && count >= MAX_FORMATS) {
      return NextResponse.json(
        { error: "Maximum format limit reached" },
        { status: 400 }
      );
    }

    // If setting as default, clear existing default
    if (is_default) {
      await supabase
        .from("custom_formats")
        .update({ is_default: false })
        .eq("user_id", user.id);
    }

    const { data: format, error } = await supabase
      .from("custom_formats")
      .insert({
        user_id: user.id,
        name,
        prompt,
        is_default: is_default || false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ format });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/formats - Update format or set as default
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name, prompt, is_default } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Format ID is required" },
        { status: 400 }
      );
    }

    // If setting as default, clear existing default first
    if (is_default) {
      await supabase
        .from("custom_formats")
        .update({ is_default: false })
        .eq("user_id", user.id);
    }

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (prompt) updateData.prompt = prompt;
    if (typeof is_default === "boolean") updateData.is_default = is_default;

    const { data: format, error } = await supabase
      .from("custom_formats")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ format });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/formats - Delete a format
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Format ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("custom_formats")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
