import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { isMatchLocked } from "@/lib/scoring";
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id");
  if (!userId) return NextResponse.json({ error: "user_id required" }, { status: 400 });
  const supabase = getServiceClient();
  const { data, error } = await supabase.from("predictions").select("*").eq("user_id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ predictions: data });
}
export async function POST(req: NextRequest) {
  const { user_id, match_id, home_score, away_score } = await req.json();
  if (!user_id || !match_id || home_score == null || away_score == null) return NextResponse.json({ error: "Todos os campos são obrigatórios." }, { status: 400 });
  if (home_score < 0 || away_score < 0 || home_score > 20 || away_score > 20) return NextResponse.json({ error: "Placar inválido." }, { status: 400 });
  const supabase = getServiceClient();
  const { data: match } = await supabase.from("matches").select("kickoff").eq("id", match_id).single();
  if (!match) return NextResponse.json({ error: "Jogo não encontrado." }, { status: 404 });
  if (isMatchLocked(match.kickoff)) return NextResponse.json({ error: "Palpites encerrados para este jogo." }, { status: 403 });
  const { data, error } = await supabase.from("predictions").upsert({ user_id, match_id, home_score, away_score }, { onConflict: "user_id,match_id" }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ prediction: data });
}
