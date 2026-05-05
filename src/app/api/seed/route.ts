import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { GROUP_STAGE_MATCHES } from "@/data/matches";
export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: "Acesso negado." }, { status: 401 });
  const supabase = getServiceClient();
  const { data: existing } = await supabase.from("matches").select("id").limit(1);
  if (existing && existing.length > 0) return NextResponse.json({ error: "Jogos já foram inseridos." }, { status: 400 });
  const { data, error } = await supabase.from("matches").insert(GROUP_STAGE_MATCHES.map((m) => ({ group_label: m.group_label, stage: m.stage, home_team: m.home_team, away_team: m.away_team, home_flag: m.home_flag, away_flag: m.away_flag, venue: m.venue, kickoff: m.kickoff }))).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, inserted: data?.length });
}
