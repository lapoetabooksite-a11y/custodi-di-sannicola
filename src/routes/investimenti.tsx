import { createFileRoute } from "@tanstack/react-router";
import { Shell, Card } from "@/components/Shell";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/investimenti")({
  head: () => seo("Rendicontazione investimenti", "Utilizzo imposta di soggiorno, progetti ambientali, fototrappole, sterilizzazioni e manutenzioni."),
  component: Investimenti,
});

// Importi di esempio: da sostituire con i dati ufficiali del Comune
const VOCI = [
  { v: "Progetti ambientali", e: 42000, s: 31500 },
  { v: "Fototrappole", e: 12000, s: 9800 },
  { v: "Sterilizzazioni", e: 8000, s: 6400 },
  { v: "Campagne informative", e: 5000, s: 3100 },
  { v: "Manutenzioni", e: 60000, s: 47200 },
];
// Formattazione manuale: identica su server e browser (toLocaleString cambia separatore)
const eur = (n: number) => `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €`;

function Investimenti() {
  const tot = VOCI.reduce((a, b) => a + b.e, 0);
  const spesi = VOCI.reduce((a, b) => a + b.s, 0);
  return (
    <Shell title="Rendicontazione investimenti">
      <Card className="mb-4">
        <div className="text-sm text-muted-foreground">Imposta di soggiorno 2026 — stanziato / speso</div>
        <div className="font-display text-3xl">{eur(spesi)} <span className="text-lg text-muted-foreground">/ {eur(tot)}</span></div>
        <div className="mt-2 h-3 rounded-full bg-muted"><div className="h-3 rounded-full bg-olive" style={{ width: `${(spesi / tot) * 100}%` }} /></div>
      </Card>
      <div className="space-y-3">
        {VOCI.map((x) => (
          <Card key={x.v}>
            <div className="flex justify-between text-sm"><b>{x.v}</b><span>{eur(x.s)} di {eur(x.e)}</span></div>
            <div className="mt-2 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${(x.s / x.e) * 100}%` }} /></div>
          </Card>
        ))}
      </div>
    </Shell>
  );
}
