import { createFileRoute } from "@tanstack/react-router";
import { Shell, Card, Stat, Bars } from "@/components/Shell";
import { useData, statistiche } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/trasparenza")({
  head: () => seo("Trasparenza", "Dati pubblici su segnalazioni ricevute, risolte e interventi eseguiti a Sannicola."),
  component: Trasparenza,
});

function Trasparenza() {
  const { segnalazioni } = useData();
  const st = statistiche(segnalazioni);
  const interventi = segnalazioni.filter((s) => s.stato === "risolta").slice(0, 8);
  return (
    <Shell title="Trasparenza per i cittadini">
      <p className="mb-4 text-muted-foreground">Come il Comune risponde alle segnalazioni e utilizza le risorse pubbliche.</p>
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Ricevute" value={st.totale} /><Stat label="Risolte" value={st.risolte} tone="olive" />
        <Stat label="Interventi eseguiti" value={st.risolte + segnalazioni.filter((s) => s.stato === "assegnata").length} tone="accent" />
        <Stat label="% risoluzione" value={`${st.percentuale}%`} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card><h2 className="mb-3 font-display text-xl">Ultimi interventi</h2>
          <ul className="divide-y text-sm">{interventi.map((s) => <li key={s.id} className="py-2">{s.categoria} — risolto il {new Date(s.chiusaIl!).toLocaleDateString("it-IT")}</li>)}</ul></Card>
        <Card><h2 className="mb-3 font-display text-xl">Categorie</h2><Bars data={st.perCat} /></Card>
      </div>
    </Shell>
  );
}
