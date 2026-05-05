import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServiceClient } from "@/lib/supabase";
export async function POST(req: NextRequest) {
  const { full_name, pin } = await req.json();
  if (!full_name || !pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) return NextResponse.json({ error: "Nome completo e PIN de 4 dígitos são obrigatórios." }, { status: 400 });
  const supabase = getServiceClient();
  const normalizedName = full_name.trim().toLowerCase();
  const { data: existing } = await supabase.from("users").select("*").eq("normalized_name", normalizedName).single();
  if (existing) {
    const valid = await bcrypt.compare(pin, existing.pin_hash);
    if (!valid) return NextResponse.json({ error: "PIN incorreto para este nome." }, { status: 401 });
    return NextResponse.json({ user: existing });
  }
  const { data: firstMatch } = await supabase.from("matches").select("kickoff").order("kickoff", { ascending: true }).limit(1).single();
  if (firstMatch) { const lockTime = new Date(firstMatch.kickoff).getTime() - 24 * 60 * 60 * 1000; if (Date.now() >= lockTime) return NextResponse.json({ error: "Registros encerrados. O prazo expirou." }, { status: 403 }); }
  const pin_hash = await bcrypt.hash(pin, 10);
  const { data: newUser, error } = await supabase.from("users").insert({ full_name: full_name.trim(), normalized_name: normalizedName, pin_hash }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ user: newUser, isNew: true });
}
