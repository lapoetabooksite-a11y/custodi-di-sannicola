import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Home, PlusCircle, Map, Siren, BarChart3, Menu } from "lucide-react";
import { useState } from "react";

const MENU = [
  { to: "/", l: "Home" },
  { to: "/notizie", l: "Notizie dal Comune" },
  { to: "/segnala", l: "Nuova segnalazione" },
  { to: "/colonie", l: "Colonie feline" },
  { to: "/sos", l: "SOS Emergenza" },
  { to: "/non-posso-parlare", l: "Non posso parlare" },
  { to: "/violenza", l: "Violenza sulle donne" },
  { to: "/mappa", l: "Mappa interattiva" },
  { to: "/comune", l: "Area Comune" },
  { to: "/polizia", l: "Area Polizia Locale" },
  { to: "/dashboard", l: "Dashboard e statistiche" },
  { to: "/trasparenza", l: "Trasparenza" },
  { to: "/investimenti", l: "Rendicontazione investimenti" },
  { to: "/cittadinanza", l: "Cittadinanza attiva" },
  { to: "/bandi", l: "Bandi e pianificazione" },
] as const;

export function Shell({ title, children }: { title?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 border-b bg-card/90 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary font-display text-lg text-primary-foreground">C</span>
            <span className="font-display text-lg leading-tight">Custodi di Sannicola</span>
          </Link>
          <button aria-label="Menu" onClick={() => setOpen(!open)} className="rounded-md p-2 hover:bg-muted"><Menu /></button>
        </div>
        {open && (
          <nav className="mx-auto grid max-w-5xl grid-cols-2 gap-1 px-4 pb-4 sm:grid-cols-3">
            {MENU.map((m) => (
              <Link key={m.to} to={m.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-muted" activeProps={{ className: "bg-muted font-semibold" }}>
                {m.l}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        {title && <h1 className="mb-6 font-display text-3xl">{title}</h1>}
        {children}
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-card print:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 text-xs">
          {[
            { to: "/", i: Home, l: "Home" },
            { to: "/segnala", i: PlusCircle, l: "Segnala" },
            { to: "/sos", i: Siren, l: "SOS" },
            { to: "/mappa", i: Map, l: "Mappa" },
            { to: "/dashboard", i: BarChart3, l: "Dati" },
          ].map(({ to, i: I, l }) => (
            <Link key={to} to={to} className={`flex flex-col items-center gap-1 py-2 text-muted-foreground ${l === "SOS" ? "text-destructive" : ""}`} activeProps={{ className: "text-primary font-semibold" }} activeOptions={{ exact: true }}>
              <I className="h-5 w-5" />{l}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border bg-card p-5 shadow-soft ${className}`}>{children}</div>;
}

export function Stat({ label, value, tone = "primary" }: { label: string; value: ReactNode; tone?: "primary" | "accent" | "destructive" | "olive" }) {
  const c = { primary: "text-primary", accent: "text-accent", destructive: "text-destructive", olive: "text-olive" }[tone];
  return (
    <Card>
      <div className={`font-display text-3xl ${c}`}>{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </Card>
  );
}

export function Badge({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "alta" | "ok" | "info" }) {
  const c = {
    muted: "bg-muted text-muted-foreground",
    alta: "bg-destructive/15 text-destructive",
    ok: "bg-olive/15 text-olive",
    info: "bg-primary/10 text-primary",
  }[tone];
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${c}`}>{children}</span>;
}

export function Bars({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...entries.map((e) => e[1]));
  const tot = entries.reduce((a, b) => a + b[1], 0) || 1;
  return (
    <div className="space-y-2">
      {entries.map(([k, v]) => (
        <div key={k} className="text-sm">
          <div className="flex justify-between"><span>{k}</span><span className="text-muted-foreground">{v} · {Math.round((v / tot) * 100)}%</span></div>
          <div className="mt-1 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${(v / max) * 100}%` }} /></div>
        </div>
      ))}
    </div>
  );
}
