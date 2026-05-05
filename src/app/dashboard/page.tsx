"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import RankingTable from "@/components/RankingTable";
import { RankedUser } from "@/lib/types";
import { Users, DollarSign } from "lucide-react";
export default function DashboardPage() {
  const [rankings, setRankings] = useState<RankedUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const currentUserId = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("bolao_user") || "null")?.id : null;
  useEffect(() => { fetch("/api/rankings").then((r) => r.json()).then((data) => { setRankings(data.rankings || []); setTotalUsers(data.totalUsers || 0); setLoading(false); }); }, []);
  const pot = totalUsers * 20;
  return (
    <>
      <Header />
      <h2 className="text-2xl font-bold text-gold-400 mb-6">Ranking Geral</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card flex items-center gap-3"><Users className="w-8 h-8 text-emerald-400" /><div><p className="text-xs text-slate-400">Participantes</p><p className="text-xl font-bold">{totalUsers}</p></div></div>
        <div className="card flex items-center gap-3"><DollarSign className="w-8 h-8 text-gold-400" /><div><p className="text-xs text-slate-400">Prêmio Total</p><p className="text-xl font-bold">R$ {pot},00</p></div></div>
        <div className="card"><p className="text-xs text-slate-400 mb-1">Distribuição</p><div className="text-xs space-y-1"><p className="text-gold-400">1º: R$ {Math.round(pot * 0.55)},00</p><p className="text-slate-300">2º: R$ {Math.round(pot * 0.30)},00</p><p className="text-amber-600">3º: R$ {Math.round(pot * 0.15)},00</p></div></div>
      </div>
      {loading ? (<div className="card text-center py-10"><p className="text-slate-400 animate-pulse">Carregando ranking...</p></div>) : (<RankingTable rankings={rankings} currentUserId={currentUserId} />)}
    </>
  );
}
