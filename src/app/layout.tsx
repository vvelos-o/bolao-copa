import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Bolão Copa 2026", description: "World Cup 2026 Prediction Game" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="pt-BR"><body className="min-h-screen"><div className="max-w-5xl mx-auto px-4 py-8">{children}</div></body></html>);
}
