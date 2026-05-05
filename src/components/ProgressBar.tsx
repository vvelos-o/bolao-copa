"use client";
export default function ProgressBar({ predicted, total }: { predicted: number; total: number }) {
  const pct = total > 0 ? Math.round((predicted / total) * 100) : 0;
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2"><span className="text-sm text-slate-400">Progresso dos Palpites</span><span className="text-sm font-bold text-gold-400">{predicted}/{total} ({pct}%)</span></div>
      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-gold-500 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}
