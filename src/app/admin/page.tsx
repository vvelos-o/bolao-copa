"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Shield, Trophy, Plus, CheckCircle } from "lucide-react";
import { Match } from "@/lib/types";
export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [message, setMessage] = useState("");
  const [newStage, setNewStage] = useState("round16");
  const [newHome, setNewHome] = useState("");
  const [newAway, setNewAway] = useState("");
  const [newVenue, setNewVenue] = useState("");
  const [newKickoff, setNewKickoff] = useState("");
  const [bootWinner, setBootWinner] = useState("");
  const [ballWinner, setBallWinner] = useState("");
  useEffect(() => { if (authenticated) { fetch("/api/matches").then((r) => r.json()).then((data) => setMatches(data.matches || [])); } }, [authenticated]);
  function handleAuth(e: React.FormEvent) { e.preventDefault(); setAuthenticated(true); }
  async function handleSubmitResult(e: React.FormEvent) {
    e.preventDefault(); setMessage("");
    const res = await fetch("/api/admin/results", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password, match_id: selectedMatch, home_score: parseInt(homeScore), away_score: parseInt(awayScore) }) });
    const data = await res.json();
    if (res.ok) { setMessage(`Resultado salvo! ${data.updated} palpites atualizados.`); setHomeScore(""); setAwayScore(""); const refreshed = await fetch("/api/matches").then((r) => r.json()); setMatches(refreshed.matches || []); } else { setMessage(data.error || "Erro ao salvar."); }
  }
  async function handleAddMatch(e: React.FormEvent) {
    e.preventDefault(); setMessage("");
    const res = await fetch("/api/admin/matches", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password, stage: newStage, home_team: newHome, away_team: newAway, venue: newVenue, kickoff: newKickoff }) });
    const data = await res.json();
    if (res.ok) { setMessage("Jogo adicionado!"); setNewHome(""); setNewAway(""); setNewVenue(""); setNewKickoff(""); const refreshed = await fetch("/api/matches").then((r) => r.json()); setMatches(refreshed.matches || []); } else { setMessage(data.error || "Erro ao adicionar."); }
  }
  async function handleSetBonus(e: React.FormEvent) {
    e.preventDefault(); setMessage("");
    const res = await fetch("/api/admin/bonus", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password, golden_boot_winner: bootWinner || undefined, golden_ball_winner: ballWinner || undefined }) });
    if (res.ok) { setMessage("Vencedores bônus atualizados!"); } else { const data = await res.json(); setMessage(data.error || "Erro."); }
  }
  if (!authenticated) return (
    <><Header /><div className="card max-w-md mx-auto"><div className="flex items-center gap-3 mb-4"><Shield className="w-6 h-6 text-red-400" /><h2 className="text-xl font-bold">Admin</h2></div><form onSubmit={handleAuth} className="space-y-3"><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha do administrador" className="input-field w-full" required /><button type="submit" className="btn-primary w-full">Entrar</button></form></div></>
  );
  const pendingMatches = matches.filter((m) => !m.is_completed);
  return (
    <><Header /><h2 className="text-2xl font-bold text-gold-400 mb-6">Painel Admin</h2>
      {message && <div className="card border-emerald-800 bg-emerald-950/30 mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-400" /><span className="text-sm text-emerald-300">{message}</span></div>}
      <div className="space-y-6">
        <div className="card"><h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-gold-400" />Registrar Resultado</h3><form onSubmit={handleSubmitResult} className="space-y-3"><select value={selectedMatch} onChange={(e) => setSelectedMatch(e.target.value)} className="input-field w-full" required><option value="">Selecione o jogo...</option>{pendingMatches.map((m) => (<option key={m.id} value={m.id}>{m.home_team} vs {m.away_team} ({new Date(m.kickoff).toLocaleDateString("pt-BR")})</option>))}</select><div className="flex gap-3"><input type="number" min="0" value={homeScore} onChange={(e) => setHomeScore(e.target.value)} className="input-field flex-1" placeholder="Gols casa" required /><input type="number" min="0" value={awayScore} onChange={(e) => setAwayScore(e.target.value)} className="input-field flex-1" placeholder="Gols fora" required /></div><button type="submit" className="btn-primary w-full">Salvar Resultado</button></form></div>
        <div className="card"><h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-emerald-400" />Adicionar Jogo (Mata-Mata)</h3><form onSubmit={handleAddMatch} className="space-y-3"><select value={newStage} onChange={(e) => setNewStage(e.target.value)} className="input-field w-full"><option value="round16">Oitavas de Final</option><option value="quarter">Quartas de Final</option><option value="semi">Semifinal</option><option value="third">3º Lugar</option><option value="final">Final</option></select><div className="grid grid-cols-2 gap-3"><input type="text" value={newHome} onChange={(e) => setNewHome(e.target.value)} className="input-field" placeholder="Time da casa" required /><input type="text" value={newAway} onChange={(e) => setNewAway(e.target.value)} className="input-field" placeholder="Time visitante" required /></div><input type="text" value={newVenue} onChange={(e) => setNewVenue(e.target.value)} className="input-field w-full" placeholder="Local" required /><input type="datetime-local" value={newKickoff} onChange={(e) => setNewKickoff(e.target.value)} className="input-field w-full" required /><button type="submit" className="btn-primary w-full">Adicionar Jogo</button></form></div>
        <div className="card"><h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-gold-400" />Definir Vencedores Bônus</h3><form onSubmit={handleSetBonus} className="space-y-3"><input type="text" value={bootWinner} onChange={(e) => setBootWinner(e.target.value)} className="input-field w-full" placeholder="Artilheiro (Chuteira de Ouro)" /><input type="text" value={ballWinner} onChange={(e) => setBallWinner(e.target.value)} className="input-field w-full" placeholder="Melhor Jogador (Bola de Ouro)" /><button type="submit" className="btn-primary w-full">Atualizar Vencedores</button></form></div>
      </div>
    </>
  );
}
