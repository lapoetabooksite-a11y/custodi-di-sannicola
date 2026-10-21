import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, Card, Stat, Bars } from "@/components/Shell";
import { RealMap } from "@/components/RealMap";
import { useData, statistiche, scaricaCSV, type Area } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/bandi")({
  head: () => seo("Bandi e pianificazione", "Report automatici con dati georeferenziati per Regione Puglia, Ministeri e Fondi Europei."),
  component: Bandi,
});

const ENTI = ["Regione Puglia", "Ministeri", "Fondi Europei"];
const TEMI: Record<string, Area[]> = {
  Ambiente: ["ambiente", "pericoli"], Randagismo: ["animali", "colonie"],
  "Innovazione Digitale": ["ambiente", "strade", "animali", "pericoli", "fragili", "colonie"],
  "Sicurezza urbana": ["strade", "pericoli", "fragili"],
};

function Bandi() {
  const { segnalazioni } = useData();
  const [ente, setEnte] = useState(ENTI[0]);
  const [tema, setTema] = useState("Ambiente");
  const list = segnalazioni.filter((s) => TEMI[tema]!.includes(s.area));
  const st = statistiche(list);
  const zone: Record<string, number> = {};
  list.forEach((s) => { const z = `${s.lat.toFixed(3)}, ${s.lng.toFixed(3)}`; zone[z] = (zone[z] ?? 0) + 1; });
  const top = Object.fromEntries(Object.entries(zone).sort((a, b) => b[1] - a[1]).slice(0, 5));
  return (
    <Shell title="Bandi e pianificazione">
      <div className="mb-4 flex flex-wrap gap-2 print:hidden">
        <select value={ente} onChange={(e) => setEnte(e.target.value)} className="rounded-full border bg-card px-3 py-2 text-sm">{ENTI.map((x) => <option key={x}>{x}</option>)}</select>
        <select value={tema} onChange={(e) => setTema(e.target.value)} className="rounded-full border bg-card px-3 py-2 text-sm">{Object.keys(TEMI).map((x) => <option key={x}>{x}</option>)}</select>
        <button onClick={() => window.print()} className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Esporta PDF</button>
        <button onClick={() => scaricaCSV(`report-${tema}.csv`, [["ID", "Categoria", "Stato", "Data", "Lat", "Lng"], ...list.map((s) => [s.id, s.categoria, s.stato, s.data.slice(0, 10), s.lat.toFixed(5), s.lng.toFixed(5)])])} className="rounded-full border px-4 py-2 text-sm">Dati georeferenziati (Excel)</button>
      </div>
      <h2 className="mb-1 font-display text-2xl">Report {tema}</h2>
      <p className="mb-4 text-sm text-muted-foreground">Destinatario: {ente} · Comune di Sannicola (LE)</p>
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Segnalazioni" value={st.totale} /><Stat label="Risolte" value={st.risolte} tone="olive" />
        <Stat label="Tempo medio (gg)" value={st.tempoMedio} /><Stat label="% risoluzione" value={`${st.percentuale}%`} />
      </div>
      <RealMap items={list} height={280} />
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card><h3 className="mb-3 font-semibold">Trend</h3><Bars data={Object.fromEntries(Object.entries(st.perMese).sort())} /></Card>
        <Card><h3 className="mb-3 font-semibold">Zone critiche</h3><Bars data={top} /></Card>
      </div>
    </Shell>
  );
}
