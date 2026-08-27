import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const { error } = await supabase.from("users").select("id").limit(1)

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          connected: true,
          message: "Reached Supabase, but the query failed. Run the SQL in supabase/schema.sql if the tables are missing.",
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      ok: true,
      connected: true,
      message: "Supabase connection successful.",
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        connected: false,
        message: "Could not reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
