"use client";
import { Clock, Lock, Check } from "lucide-react";
import { Match, Prediction } from "@/lib/types";
import { isMatchLocked } from "@/lib/scoring";
import { useState } from "react";
interface MatchCardProps { match: Match; prediction?: Prediction; onSave: (matchId: string, home: number, away: number) => void; }
export default function MatchCard({ match, prediction, onSave }: MatchCardProps) {
  const locked = isMatchLocked(match.kickoff);
  const [home, setHome] = useState<string>(prediction?.home_score?.toString() ?? "");
  const [away, setAway] = useState<string>(prediction?.away_score?.toString() ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(!!prediction);
  const kickoffDate = new Date(match.kickoff);
  const dateStr = kickoffDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  const timeStr = kickoffDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  async function handleSave() { const h = parseInt(home); const a = parseInt(away); if (isNaN(h) || isNaN(a) || h < 0 || a < 0) return; setSaving(true); await onSave(match.id, h, a); setSaving(false); setSaved(true); }
  return (
    <div className={`card relative ${locked ? "opacity-60" : ""} ${saved ? "border-emerald-800" : ""}`}>
      {locked && <div className="absolute top-3 right-3"><Lock className="w-4 h-4 text-red-400" /></div>}
      {saved && !locked && <div className="absolute top-3 right-3"><Check className="w-4 h-4 text-emerald-400" /></div>}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
        <Clock className="w-3 h-3" /><span>{dateStr} às {timeStr}</span>
        {match.group_label && <span className="ml-auto bg-slate-800 px-2 py-0.5 rounded text-gold-400 font-medium">Grupo {match.group_label}</span>}
        {match.stage !== "group" && <span className="ml-auto bg-gold-500/20 px-2 py-0.5 rounded text-gold-400 font-medium text-xs">{match.stage === "round16" && "Oitavas"}{match.stage === "quarter" && "Quartas"}{match.stage === "semi" && "Semi"}{match.stage === "third" && "3º Lugar"}{match.stage === "final" && "Final"}</span>}
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 text-right"><span className="text-2xl mr-2">{match.home_flag}</span><span className="font-medium text-sm">{match.home_team}</span></div>
        <div className="flex items-center gap-2">
          {match.is_completed ? (
            <div className="flex items-center gap-1"><span className="score-input flex items-center justify-center bg-emerald-900/50 border-emerald-700">{match.home_score}</span><span className="text-slate-500 font-bold">x</span><span className="score-input flex items-center justify-center bg-emerald-900/50 border-emerald-700">{match.away_score}</span></div>
          ) : (
            <><input type="number" min="0" max="20" value={home} onChange={(e) => { setHome(e.target.value); setSaved(false); }} disabled={locked} className="score-input" placeholder="-" /><span className="text-slate-500 font-bold">x</span><input type="number" min="0" max="20" value={away} onChange={(e) => { setAway(e.target.value); setSaved(false); }} disabled={locked} className="score-input" placeholder="-" /></>
          )}
        </div>
        <div className="flex-1 text-left"><span className="font-medium text-sm">{match.away_team}</span><span className="text-2xl ml-2">{match.away_flag}</span></div>
      </div>
      {!locked && !match.is_completed && home !== "" && away !== "" && !saved && (<button onClick={handleSave} disabled={saving} className="mt-3 w-full btn-primary text-sm py-2">{saving ? "Salvando..." : "Salvar Palpite"}</button>)}
      {match.is_completed && prediction && (<div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs"><span className="text-slate-400">Seu palpite: {prediction.home_score} x {prediction.away_score}</span><span className={`font-bold ${prediction.points_awarded === 25 ? "text-gold-400" : prediction.points_awarded === 10 ? "text-emerald-400" : "text-red-400"}`}>+{prediction.points_awarded ?? 0} pts</span></div>)}
      <p className="text-xs text-slate-600 mt-2 truncate">{match.venue}</p>
    </div>
  );
}
