"use client";
import { Trophy, Medal, Award } from "lucide-react";
import type { RankedUser } from "@/lib/types";
interface RankingTableProps { rankings: RankedUser[]; currentUserId?: string; }
export default function RankingTable({ rankings, currentUserId }: RankingTableProps) {
  if (rankings.length === 0) return (<div className="card text-center py-10"><p className="text-slate-400">Nenhum resultado disponível ainda.</p></div>);
  return (
    <div className="card overflow-hidden p-0">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-slate-800 text-slate-400"><th className="px-4 py-3 text-left">#</th><th className="px-4 py-3 text-left">Jogador</th><th className="px-4 py-3 text-center">Pts</th><th className="px-4 py-3 text-center hidden sm:table-cell">Exatos</th><th className="px-4 py-3 text-center hidden sm:table-cell">Resultados</th></tr></thead>
        <tbody>{rankings.map((user, i) => (
          <tr key={user.id} className={`border-b border-slate-800/50 ${user.id === currentUserId ? "bg-gold-500/5" : ""} hover:bg-slate-800/30 transition-colors`}>
            <td className="px-4 py-3">{i === 0 && <Trophy className="w-5 h-5 text-gold-400 inline" />}{i === 1 && <Medal className="w-5 h-5 text-slate-300 inline" />}{i === 2 && <Award className="w-5 h-5 text-amber-700 inline" />}{i > 2 && <span className="text-slate-500">{i + 1}</span>}</td>
            <td className="px-4 py-3 font-medium">{user.full_name}{user.id === currentUserId && <span className="ml-2 text-xs text-gold-400">(você)</span>}</td>
            <td className="px-4 py-3 text-center font-bold text-gold-400">{user.total_points}</td>
            <td className="px-4 py-3 text-center text-emerald-400 hidden sm:table-cell">{user.exact_scores}</td>
            <td className="px-4 py-3 text-center text-blue-400 hidden sm:table-cell">{user.correct_outcomes}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
