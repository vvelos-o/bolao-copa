"use client";
import { Trophy, LogOut, BarChart3, BookOpen } from "lucide-react";
import Link from "next/link";
interface HeaderProps { userName?: string; onLogout?: () => void; }
export default function Header({ userName, onLogout }: HeaderProps) {
  return (
    <header className="flex items-center justify-between mb-8">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 bg-gold-500 rounded-lg flex items-center justify-center group-hover:bg-gold-400 transition-colors">
          <Trophy className="w-5 h-5 text-slate-950" />
        </div>
        <div><h1 className="text-xl font-bold text-gold-400">Bolão Copa 2026</h1><p className="text-xs text-slate-500">Palpites & Rankings</p></div>
      </Link>
      <nav className="flex items-center gap-3">
        <Link href="/rules" className="btn-secondary flex items-center gap-2 text-sm"><BookOpen className="w-4 h-4" /><span className="hidden sm:inline">Regras</span></Link>
        <Link href="/dashboard" className="btn-secondary flex items-center gap-2 text-sm"><BarChart3 className="w-4 h-4" /><span className="hidden sm:inline">Ranking</span></Link>
        {userName && (<button onClick={onLogout} className="btn-secondary flex items-center gap-2 text-sm"><LogOut className="w-4 h-4" /><span className="hidden sm:inline">Sair</span></button>)}
      </nav>
    </header>
  );
}
