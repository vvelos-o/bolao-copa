import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { calculatePoints } from "@/lib/scoring";
export async function POST(req: NextRequest) {
  const { password, match_id, home_score, away_score } = await req.json();
  if (password !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: "Acesso negado." }, { status: 401 });
  if (!match_id || home_score == null || away_score == null) return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
  const supabase = getServiceClient();
  const { error: matchError } = await supabase.from("matches").update({ home_score, away_score, is_completed: true }).eq("id", match_id);
  if (matchError) return NextResponse.json({ error: matchError.message }, { status: 500 });
  const { data: predictions } = await supabase.from("predictions").select("*").eq("match_id", match_id);
  if (predictions && predictions.length > 0) { for (const pred of predictions) { const points = calculatePoints(pred.home_score, pred.away_score, home_score, away_score); await supabase.from("predictions").update({ points_awarded: points }).eq("id", pred.id); } }
  return NextResponse.json({ success: true, updated: predictions?.length || 0 });
}
