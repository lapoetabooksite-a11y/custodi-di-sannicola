import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Shell, Card, Badge } from "@/components/Shell";
import { useData, type Stato } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/comune")({
  head: () => seo("Area Comune", "Gestione pratiche: presa in carico, assegnazione, aggiornamento stato e archiviazione."),
  component: Comune,
});

const UFFICI = ["Ufficio Tecnico", "Ufficio Ambiente", "Polizia Locale", "Servizi Sociali", "Associazione convenzionata"];
const STATI: Stato[] = ["nuova", "presa in carico", "assegnata", "risolta", "archiviata"];

function Comune() {
  const { segnalazioni, aggiorna } = useData();
  const [filtro, setFiltro] = useState<Stato | "tutte">("nuova");
  const list = segnalazioni.filter((s) => filtro === "tutte" || s.stato === filtro);
  return (
    <Shell title="Area Comune">
      <div className="mb-4 flex flex-wrap gap-2">
        {(["tutte", ...STATI] as const).map((s) => <button key={s} onClick={() => setFiltro(s)} className={`rounded-full px-3 py-1.5 text-sm ${filtro === s ? "bg-primary text-primary-foreground" : "border bg-card"}`}>{s} ({s === "tutte" ? segnalazioni.length : segnalazioni.filter((x) => x.stato === s).length})</button>)}
      </div>
      <div className="space-y-3">
        {list.slice(0, 30).map((s) => (
          <Card key={s.id}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="font-semibold">{s.categoria} <span className="text-xs text-muted-foreground">{s.id}</span></div>
                <div className="text-sm text-muted-foreground">{s.descrizione} · {new Date(s.data).toLocaleDateString("it-IT")}</div>
              </div>
              <div className="flex gap-1"><Badge tone={s.urgenza === "alta" ? "alta" : "muted"}>{s.urgenza}</Badge><Badge tone="info">{s.stato}</Badge></div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              {s.stato === "nuova" && <button onClick={() => { aggiorna(s.id, { stato: "presa in carico" }); toast.success("Presa in carico"); }} className="rounded-full bg-primary px-3 py-1 text-primary-foreground">Prendi in carico</button>}
              <select value={s.assegnatoA ?? ""} onChange={(e) => { aggiorna(s.id, { assegnatoA: e.target.value, stato: "assegnata" }); toast.success(`Assegnata a ${e.target.value}`); }} className="rounded-full border bg-background px-3 py-1">
                <option value="" disabled>Assegna a…</option>
                {UFFICI.map((u) => <option key={u}>{u}</option>)}
              </select>
              <select value={s.stato} onChange={(e) => aggiorna(s.id, { stato: e.target.value as Stato, chiusaIl: ["risolta", "archiviata"].includes(e.target.value) ? new Date().toISOString() : undefined })} className="rounded-full border bg-background px-3 py-1">
                {STATI.map((x) => <option key={x}>{x}</option>)}
              </select>
              {s.stato !== "archiviata" && <button onClick={() => aggiorna(s.id, { stato: "archiviata", chiusaIl: s.chiusaIl ?? new Date().toISOString() })} className="rounded-full border px-3 py-1">Archivia</button>}
            </div>
          </Card>
        ))}
        {list.length === 0 && <p className="text-muted-foreground">Nessuna pratica.</p>}
      </div>
    </Shell>
  );
}
