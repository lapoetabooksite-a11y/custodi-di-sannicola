import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { seo } from "@/lib/seo";
import { Phone } from "lucide-react";

export const Route = createFileRoute("/sos")({
  head: () => seo("SOS Emergenza", "Chiamate rapide a 112, 1522, Polizia Locale, Comune e Servizi Sociali."),
  component: Sos,
});

// Numeri locali di esempio: da sostituire con quelli ufficiali del Comune
const NUM = [
  { l: "112 · Emergenza", n: "112", tone: "bg-destructive text-destructive-foreground" },
  { l: "1522 · Antiviolenza", n: "1522", tone: "bg-accent text-accent-foreground" },
  { l: "Polizia Locale", n: "0833000001", tone: "bg-primary text-primary-foreground" },
  { l: "Comune", n: "0833000002", tone: "bg-primary text-primary-foreground" },
  { l: "Servizi Sociali", n: "0833000003", tone: "bg-olive text-primary-foreground" },
];

function Sos() {
  return (
    <Shell title="SOS Emergenza">
      <div className="grid gap-3">
        {NUM.map((x) => (
          <a key={x.l} href={`tel:${x.n}`} className={`flex items-center justify-between rounded-2xl p-5 text-lg font-semibold ${x.tone}`}>
            {x.l}<Phone />
          </a>
        ))}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link to="/non-posso-parlare" className="rounded-2xl border-2 border-destructive bg-card p-5 text-center font-semibold text-destructive">NON POSSO PARLARE</Link>
        <Link to="/violenza" className="rounded-2xl border-2 border-accent bg-card p-5 text-center font-semibold text-accent">Violenza sulle donne</Link>
      </div>
    </Shell>
  );
}
