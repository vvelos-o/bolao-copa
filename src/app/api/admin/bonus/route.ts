import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
export async function POST(req: NextRequest) {
  const { password, golden_boot_winner, golden_ball_winner } = await req.json();
  if (password !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: "Acesso negado." }, { status: 401 });
  const supabase = getServiceClient();
  const updates: Record<string, string> = {};
  if (golden_boot_winner) updates.golden_boot_winner = golden_boot_winner;
  if (golden_ball_winner) updates.golden_ball_winner = golden_ball_winner;
  const { error } = await supabase.from("settings").update(updates).eq("id", 1);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
