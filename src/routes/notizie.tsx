import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, Card, Badge } from "@/components/Shell";
import { seo } from "@/lib/seo";
import { NOTIZIE, CATEGORIE_NOTIZIE, fmtData, type CatNotizia } from "@/lib/notizie";

export const Route = createFileRoute("/notizie")({
  head: () => seo("Notizie dal Comune", "Avvisi, ordinanze, lavori, eventi ed emergenze: le comunicazioni del Comune di Sannicola alla cittadinanza."),
  component: Notizie,
});

function Notizie() {
  const [cat, setCat] = useState<CatNotizia | "Tutte">("Tutte");
  const [aperta, setAperta] = useState<string | null>(null);
  const lista = NOTIZIE.filter((n) => cat === "Tutte" || n.categoria === cat);
  return (
    <Shell title="Notizie dal Comune">
      <h1 className="mb-2 font-display text-3xl">Notizie dal Comune</h1>
      <p className="mb-5 text-muted-foreground">Le comunicazioni ufficiali del Comune di Sannicola per tutti i cittadini.</p>
      <div className="mb-5 flex flex-wrap gap-2">
        {(["Tutte", ...CATEGORIE_NOTIZIE] as const).map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-4 py-1.5 text-sm ${cat === c ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary"}`}>{c}</button>
        ))}
      </div>
      <div className="space-y-3">
        {lista.map((n) => (
          <Card key={n.id} className={n.urgente ? "border-destructive" : ""}>
            <button className="w-full text-left" onClick={() => setAperta(aperta === n.id ? null : n.id)}>
              <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{fmtData(n.data)}</span>·<span>{n.ufficio}</span>
                <Badge tone={n.urgente ? "alta" : "muted"}>{n.urgente ? "Urgente" : n.categoria}</Badge>
              </div>
              <h2 className="font-display text-lg">{n.titolo}</h2>
            </button>
            {aperta === n.id && <p className="mt-2 text-sm">{n.testo}</p>}
          </Card>
        ))}
        {lista.length === 0 && <p className="text-muted-foreground">Nessuna notizia in questa categoria.</p>}
      </div>
    </Shell>
  );
}
