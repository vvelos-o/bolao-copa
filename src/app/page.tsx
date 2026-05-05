"use client";
import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";
import MatchCard from "@/components/MatchCard";
import ProgressBar from "@/components/ProgressBar";
import { Match, Prediction, User } from "@/lib/types";
import { Star } from "lucide-react";
export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [error, setError] = useState("");
  const [goldenBoot, setGoldenBoot] = useState("");
  const [goldenBall, setGoldenBall] = useState("");
  const [bonusSaved, setBonusSaved] = useState(false);
  const [filterGroup, setFilterGroup] = useState<string>("all");
  const loadData = useCallback(async (userId: string) => {
    const [matchRes, predRes] = await Promise.all([fetch("/api/matches"), fetch(`/api/predictions?user_id=${userId}`)]);
    const matchData = await matchRes.json(); const predData = await predRes.json();
    setMatches(matchData.matches || []); setPredictions(predData.predictions || []);
  }, []);
  useEffect(() => { const stored = localStorage.getItem("bolao_user"); if (stored) { const u = JSON.parse(stored); setUser(u); setGoldenBoot(u.golden_boot || ""); setGoldenBall(u.golden_ball || ""); loadData(u.id); } }, [loadData]);
  async function handleLogin(name: string, pin: string) {
    setError("");
    const res = await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ full_name: name, pin }) });
    const data = await res.json();
    if (!res.ok) { setError(data.error); return; }
    localStorage.setItem("bolao_user", JSON.stringify(data.user)); setUser(data.user); setGoldenBoot(data.user.golden_boot || ""); setGoldenBall(data.user.golden_ball || ""); loadData(data.user.id);
  }
  function handleLogout() { localStorage.removeItem("bolao_user"); setUser(null); setMatches([]); setPredictions([]); }
  async function handleSavePrediction(matchId: string, homeScore: number, awayScore: number) {
    if (!user) return;
    const res = await fetch("/api/predictions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id: user.id, match_id: matchId, home_score: homeScore, away_score: awayScore }) });
    if (res.ok) { const data = await res.json(); setPredictions((prev) => [...prev.filter((p) => p.match_id !== matchId), data.prediction]); }
  }
  async function handleSaveBonus() {
    if (!user) return;
    const res = await fetch("/api/bonus-picks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id: user.id, golden_boot: goldenBoot, golden_ball: goldenBall }) });
    if (res.ok) { setBonusSaved(true); setTimeout(() => setBonusSaved(false), 3000); }
  }
  if (!user) return (<><Header /><LoginForm onLogin={handleLogin} error={error} /></>);
  const uniqueGroups: string[] = [];
  matches.forEach((m) => { if (m.group_label && uniqueGroups.indexOf(m.group_label) === -1) uniqueGroups.push(m.group_label); });
  uniqueGroups.sort();
  const filteredMatches = filterGroup === "all" ? matches : matches.filter((m) => m.group_label === filterGroup || (filterGroup === "knockout" && !m.group_label));
  return (
    <>
      <Header userName={user.full_name} onLogout={handleLogout} />
      <div className="mb-6"><h2 className="text-lg font-semibold text-slate-200 mb-1">Olá, <span className="text-gold-400">{user.full_name}</span>!</h2><p className="text-sm text-slate-500">Faça seus palpites antes do início de cada jogo.</p></div>
      <ProgressBar predicted={predictions.length} total={matches.length} />
      <div className="card mt-4">
        <div className="flex items-center gap-2 mb-3"><Star className="w-5 h-5 text-gold-400" /><h3 className="font-semibold text-gold-400">Palpites Bônus</h3></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><label className="text-xs text-slate-400 block mb-1">Artilheiro (Chuteira de Ouro)</label><input type="text" value={goldenBoot} onChange={(e) => setGoldenBoot(e.target.value)} placeholder="Nome do jogador" className="input-field w-full text-sm" /></div>
          <div><label className="text-xs text-slate-400 block mb-1">Melhor Jogador (Bola de Ouro)</label><input type="text" value={goldenBall} onChange={(e) => setGoldenBall(e.target.value)} placeholder="Nome do jogador" className="input-field w-full text-sm" /></div>
        </div>
        <button onClick={handleSaveBonus} className="btn-primary mt-3 text-sm py-2">{bonusSaved ? "Salvo!" : "Salvar Bônus"}</button>
      </div>
      <div className="mt-6 mb-4 flex flex-wrap gap-2">
        <button onClick={() => setFilterGroup("all")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterGroup === "all" ? "bg-gold-500 text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>Todos</button>
        {uniqueGroups.map((g) => (<button key={g} onClick={() => setFilterGroup(g)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterGroup === g ? "bg-gold-500 text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>{g}</button>))}
        {matches.some((m) => !m.group_label) && (<button onClick={() => setFilterGroup("knockout")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterGroup === "knockout" ? "bg-gold-500 text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>Mata-Mata</button>)}
      </div>
      <div className="grid gap-4">{filteredMatches.map((match) => (<MatchCard key={match.id} match={match} prediction={predictions.find((p) => p.match_id === match.id)} onSave={handleSavePrediction} />))}</div>
    </>
  );
}
