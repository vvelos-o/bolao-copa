import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import type { RankedUser } from "@/lib/types";
export async function GET() {
  const supabase = getServiceClient();
  const { data: users } = await supabase.from("users").select("id, full_name, golden_boot, golden_ball");
  const { data: predictions } = await supabase.from("predictions").select("*").not("points_awarded", "is", null);
  const { data: settings } = await supabase.from("settings").select("*").single();
  if (!users) return NextResponse.json({ rankings: [], totalUsers: 0 });
  const rankings: RankedUser[] = users.map((user) => {
    const userPreds = (predictions || []).filter((p) => p.user_id === user.id);
    let totalPoints = 0, exactScores = 0, correctOutcomes = 0;
    for (const pred of userPreds) { totalPoints += pred.points_awarded; if (pred.points_awarded === 25) exactScores++; else if (pred.points_awarded === 10) correctOutcomes++; }
    if (settings?.golden_boot_winner && user.golden_boot === settings.golden_boot_winner) totalPoints += 50;
    if (settings?.golden_ball_winner && user.golden_ball === settings.golden_ball_winner) totalPoints += 50;
    return { id: user.id, full_name: user.full_name, total_points: totalPoints, exact_scores: exactScores, correct_outcomes: correctOutcomes, predictions_made: userPreds.length };
  });
  rankings.sort((a, b) => b.total_points - a.total_points || b.exact_scores - a.exact_scores);
  return NextResponse.json({ rankings, totalUsers: users.length });
}
