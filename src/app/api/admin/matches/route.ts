import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
export async function POST(req: NextRequest) {
  const { password, stage, home_team, away_team, home_flag, away_flag, venue, kickoff } = await req.json();
  if (password !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: "Acesso negado." }, { status: 401 });
  const supabase = getServiceClient();
  const { data, error } = await supabase.from("matches").insert({ stage, home_team, away_team, home_flag: home_flag || "🏳️", away_flag: away_flag || "🏳️", venue, kickoff, group_label: null }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ match: data });
}
