import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, Card, Stat, Badge } from "@/components/Shell";
import { RealMap } from "@/components/RealMap";
import { useData, statistiche, CATEGORIE } from "@/lib/data";
import { seo } from "@/lib/seo";
import { NOTIZIE, fmtData } from "@/lib/notizie";
import { Leaf, Construction, PawPrint, Cat, TriangleAlert, HeartHandshake, Siren } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => seo("Home", "Segnala, partecipa e proteggi il territorio di Sannicola: ambiente, animali, sicurezza e persone fragili."),
  component: Index,
});

const AREE = [
  { a: "ambiente", i: Leaf }, { a: "strade", i: Construction }, { a: "animali", i: PawPrint },
  { a: "pericoli", i: TriangleAlert }, { a: "fragili", i: HeartHandshake },
] as const;


function Index() {
  const { segnalazioni } = useData();
  const st = statistiche(segnalazioni);
  return (
    <Shell>
      <section className="mb-6 rounded-3xl bg-primary p-6 text-primary-foreground sm:p-10">
        <div className="mb-4 flex items-center gap-3 text-sm opacity-90">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-foreground/15 font-display">S</span>
          Comune di Sannicola · Progetto Custodi
        </div>
        <h1 className="max-w-xl font-display text-4xl leading-tight sm:text-5xl">Ogni cittadino, custode del proprio territorio.</h1>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/segnala" className="rounded-full bg-primary-foreground px-6 py-3 font-semibold text-primary">+ Nuova segnalazione</Link>
          <Link to="/sos" className="flex items-center gap-2 rounded-full bg-destructive px-6 py-3 font-semibold text-destructive-foreground"><Siren className="h-5 w-5" /> SOS</Link>
        </div>
      </section>

      <div className="mb-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {AREE.map(({ a, i: I }) => (
          <Link key={a} to="/segnala" search={{ area: a }} className="flex flex-col items-center gap-2 rounded-2xl border bg-card p-3 text-center text-xs font-medium hover:border-primary">
            <I className="h-6 w-6 text-primary" />{CATEGORIE[a].titolo}
          </Link>
        ))}
        <Link to="/colonie" className="flex flex-col items-center gap-2 rounded-2xl border bg-card p-3 text-center text-xs font-medium hover:border-primary"><Cat className="h-6 w-6 text-primary" />Colonie feline</Link>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Segnalazioni" value={st.totale} />
        <Stat label="Risolte" value={st.risolte} tone="olive" />
        <Stat label="Aperte" value={st.aperte} tone="accent" />
        <Stat label="Risoluzione" value={`${st.percentuale}%`} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="mb-2 flex justify-between"><h2 className="font-display text-xl">Mappa</h2><Link to="/mappa" className="text-sm text-primary">Apri →</Link></div>
          <RealMap items={segnalazioni.slice(0, 30)} height={260} />
        </div>
        <Card>
          <h2 className="mb-3 font-display text-xl">Segnalazioni recenti</h2>
          <ul className="divide-y">
            {segnalazioni.slice(0, 5).map((s) => (
              <li key={s.id} className="flex items-center justify-between py-2 text-sm">
                <span>{s.categoria}<span className="block text-xs text-muted-foreground">{s.id} · {new Date(s.data).toLocaleDateString("it-IT")}</span></span>
                <Badge tone={s.stato === "risolta" ? "ok" : s.urgenza === "alta" ? "alta" : "muted"}>{s.stato}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6">
        <div className="mb-3 flex justify-between"><h2 className="font-display text-xl">Notizie dal Comune</h2><Link to="/notizie" className="text-sm text-primary">Tutte →</Link></div>
        <ul className="space-y-2 text-sm">
          {NOTIZIE.slice(0, 4).map((n) => (
            <li key={n.id}><Link to="/notizie" className="flex items-center gap-3 hover:text-primary"><span className="w-14 shrink-0 text-muted-foreground">{fmtData(n.data)}</span><span className="flex-1">{n.titolo}</span>{n.urgente && <Badge tone="alta">Urgente</Badge>}</Link></li>
          ))}
        </ul>
      </Card>
    </Shell>
  );
}
