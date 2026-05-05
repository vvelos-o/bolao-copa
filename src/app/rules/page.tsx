"use client";
import Header from "@/components/Header";
import { Trophy, Target, Star, Clock, DollarSign } from "lucide-react";
export default function RulesPage() {
  return (
    <>
      <Header />
      <h2 className="text-2xl font-bold text-gold-400 mb-6">Como Funciona</h2>
      <div className="space-y-4">
        <div className="card"><div className="flex items-center gap-3 mb-3"><DollarSign className="w-6 h-6 text-emerald-400" /><h3 className="text-lg font-semibold">Inscrição e Premiação</h3></div><ul className="text-sm text-slate-300 space-y-2 ml-9"><li>Taxa de inscrição: <span className="text-gold-400 font-bold">R$ 20,00</span></li><li>O prêmio total é calculado automaticamente com base no número de inscritos.</li><li className="text-gold-400 font-medium">1º Lugar: 55% do prêmio total</li><li className="text-slate-200 font-medium">2º Lugar: 30% do prêmio total</li><li className="text-amber-600 font-medium">3º Lugar: 15% do prêmio total</li></ul></div>
        <div className="card"><div className="flex items-center gap-3 mb-3"><Target className="w-6 h-6 text-blue-400" /><h3 className="text-lg font-semibold">Sistema de Pontuação</h3></div><div className="ml-9 space-y-3"><div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3"><span className="text-sm text-slate-300">Acertar o resultado (1x2)</span><span className="font-bold text-emerald-400">+10 pts</span></div><div className="flex items-center justify-between bg-gold-500/10 rounded-lg p-3 border border-gold-500/30"><span className="text-sm text-slate-200 font-medium">Acertar o placar exato</span><span className="font-bold text-gold-400">+25 pts</span></div><p className="text-xs text-slate-500">Os 25 pontos substituem os 10 — não acumulam.</p></div></div>
        <div className="card"><div className="flex items-center gap-3 mb-3"><Star className="w-6 h-6 text-gold-400" /><h3 className="text-lg font-semibold">Palpites Bônus</h3></div><div className="ml-9 space-y-3"><div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3"><span className="text-sm text-slate-300">Artilheiro do torneio (Chuteira de Ouro)</span><span className="font-bold text-gold-400">+50 pts</span></div><div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3"><span className="text-sm text-slate-300">Melhor jogador (Bola de Ouro)</span><span className="font-bold text-gold-400">+50 pts</span></div><p className="text-xs text-slate-500">Devem ser preenchidos antes do início do torneio.</p></div></div>
        <div className="card"><div className="flex items-center gap-3 mb-3"><Clock className="w-6 h-6 text-red-400" /><h3 className="text-lg font-semibold">Prazos</h3></div><ul className="text-sm text-slate-300 space-y-2 ml-9"><li>Inscrições e palpites bônus: até <span className="text-red-400 font-medium">24 horas antes do jogo de abertura</span>.</li><li>Palpites de cada jogo: até <span className="text-red-400 font-medium">30 minutos antes do apito inicial</span>.</li></ul></div>
        <div className="card"><div className="flex items-center gap-3 mb-3"><Trophy className="w-6 h-6 text-gold-400" /><h3 className="text-lg font-semibold">Critérios de Desempate</h3></div><ul className="text-sm text-slate-300 space-y-2 ml-9"><li>1. Maior número de placares exatos acertados.</li><li>2. Maior número de resultados (1x2) acertados.</li></ul></div>
      </div>
    </>
  );
}
