import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { isRegistrationOpen } from "@/lib/scoring";
export async function POST(req: NextRequest) {
  const { user_id, golden_boot, golden_ball } = await req.json();
  if (!user_id) return NextResponse.json({ error: "user_id required" }, { status: 400 });
  const supabase = getServiceClient();
  const { data: firstMatch } = await supabase.from("matches").select("kickoff").order("kickoff", { ascending: true }).limit(1).single();
  if (firstMatch && !isRegistrationOpen(firstMatch.kickoff)) return NextResponse.json({ error: "Prazo para palpites bônus encerrado." }, { status: 403 });
  const { data, error } = await supabase.from("users").update({ golden_boot, golden_ball }).eq("id", user_id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ user: data });
}
