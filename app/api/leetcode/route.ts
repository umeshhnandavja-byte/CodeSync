import { NextResponse } from "next/server"
import { getLeetCodeUserStats } from "@/lib/leetcode"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username") || "Umeshh_Nanda"

  try {
    const stats = await getLeetCodeUserStats(username)
    return NextResponse.json({ ok: true, data: stats })
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, message: error.message || "Failed to fetch" },
      { status: 500 }
    )
  }
}
