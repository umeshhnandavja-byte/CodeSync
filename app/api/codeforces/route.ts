import { NextResponse } from "next/server"
import { getCodeforcesUserStats } from "@/lib/codeforces"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const handle = searchParams.get("handle") || "tourist" // Default fallback handle

  try {
    const stats = await getCodeforcesUserStats(handle)
    return NextResponse.json({ ok: true, data: stats })
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, message: error.message || "Failed to fetch" },
      { status: 500 }
    )
  }
}