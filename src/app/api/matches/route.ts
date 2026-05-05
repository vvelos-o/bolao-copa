import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
export async function GET() {
  const supabase = getServiceClient();
  const { data, error } = await supabase.from("matches").select("*").order("kickoff", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ matches: data });
}
