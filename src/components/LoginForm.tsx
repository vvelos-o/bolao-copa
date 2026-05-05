"use client";
import { useState } from "react";
import { User, KeyRound } from "lucide-react";
interface LoginFormProps { onLogin: (name: string, pin: string) => Promise<void>; error?: string; }
export default function LoginForm({ onLogin, error }: LoginFormProps) {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent) { e.preventDefault(); setLoading(true); await onLogin(name, pin); setLoading(false); }
  return (
    <form onSubmit={handleSubmit} className="card max-w-md mx-auto space-y-5">
      <div className="text-center mb-6"><h2 className="text-2xl font-bold text-gold-400">Entrar no Bolão</h2><p className="text-sm text-slate-400 mt-1">Use seu nome e um PIN de 4 dígitos. Na primeira vez, sua conta será criada automaticamente.</p></div>
      <div className="space-y-3">
        <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" /><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" className="input-field w-full pl-11" required /></div>
        <div className="relative"><KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" /><input type="password" inputMode="numeric" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="PIN (4 dígitos)" className="input-field w-full pl-11" required /></div>
      </div>
      {error && (<p className="text-red-400 text-sm text-center bg-red-950/30 p-2 rounded-lg">{error}</p>)}
      <button type="submit" disabled={loading || name.trim().length < 3 || pin.length !== 4} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">{loading ? "Entrando..." : "Entrar"}</button>
    </form>
  );
}
