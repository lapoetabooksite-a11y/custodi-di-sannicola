import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, Card, Stat, Bars } from "@/components/Shell";
import { useData, statistiche, scaricaCSV, CATEGORIE, type Area } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/dashboard")({
  head: () => seo("Dashboard e statistiche", "Dashboard operativa, statistiche mensili e annuali con esportazione PDF ed Excel."),
  component: Dashboard,
});

function Dashboard() {
  const { segnalazioni } = useData();
  const [tab, setTab] = useState<"operativa" | "mensile" | "annuale">("operativa");
  const mesi = Array.from(new Set(segnalazioni.map((s) => s.data.slice(0, 7)))).sort().reverse();
  const [mese, setMese] = useState(mesi[0] ?? "");
  const all = statistiche(segnalazioni);
  const mensili = statistiche(segnalazioni.filter((s) => s.data.startsWith(mese)));
  const aree = Object.fromEntries(Object.entries(all.perArea).map(([k, v]) => [CATEGORIE[k as Area].titolo, v]));
  const critiche: Record<string, number> = {};
  segnalazioni.filter((s) => s.stato !== "risolta").forEach((s) => {
    const z = `${s.lat > 40.0917 ? "Nord" : "Sud"}-${s.lng > 18.0675 ? "Est" : "Ovest"}`;
    critiche[`Zona ${z}`] = (critiche[`Zona ${z}`] ?? 0) + 1;
  });
  return (
    <Shell title="Dashboard e statistiche">
      <div className="mb-4 flex gap-2 print:hidden">
        {(["operativa", "mensile", "annuale"] as const).map((t) => <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 text-sm capitalize ${tab === t ? "bg-primary text-primary-foreground" : "border bg-card"}`}>{t}</button>)}
      </div>

      {tab === "operativa" && (
        <>
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Aperte" value={all.aperte} tone="accent" />
            <Stat label="Risolte" value={all.risolte} tone="olive" />
            <Stat label="Tempo medio (giorni)" value={all.tempoMedio} />
            <Stat label="Urgenza alta aperte" value={segnalazioni.filter((s) => s.urgenza === "alta" && s.stato !== "risolta").length} tone="destructive" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card><h2 className="mb-3 font-display text-xl">Aree più critiche</h2><Bars data={critiche} /></Card>
            <Card><h2 className="mb-3 font-display text-xl">Per ambito</h2><Bars data={aree} /></Card>
          </div>
        </>
      )}

      {tab === "mensile" && (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-2 print:hidden">
            <select value={mese} onChange={(e) => setMese(e.target.value)} className="rounded-full border bg-card px-3 py-2 text-sm">{mesi.map((m) => <option key={m}>{m}</option>)}</select>
            <button onClick={() => window.print()} className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Esporta PDF</button>
          </div>
          <h2 className="mb-3 font-display text-2xl">Report {mese}</h2>
          <div className="mb-4 grid grid-cols-3 gap-3"><Stat label="Segnalazioni" value={mensili.totale} /><Stat label="Risolte" value={mensili.risolte} tone="olive" /><Stat label="Risoluzione" value={`${mensili.percentuale}%`} /></div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card><h3 className="mb-3 font-semibold">Categorie</h3><Bars data={mensili.perCat} /></Card>
            <Card><h3 className="mb-3 font-semibold">Andamento mensile</h3><Bars data={Object.fromEntries(Object.entries(all.perMese).sort())} /></Card>
          </div>
        </>
      )}

      {tab === "annuale" && (
        <>
          <div className="mb-4 flex gap-2 print:hidden">
            <button onClick={() => window.print()} className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Esporta PDF</button>
            <button onClick={() => scaricaCSV("statistiche-annuali.csv", [["ID", "Ambito", "Categoria", "Stato", "Urgenza", "Data", "Chiusa il", "Lat", "Lng"], ...segnalazioni.map((s) => [s.id, s.area, s.categoria, s.stato, s.urgenza, s.data.slice(0, 10), s.chiusaIl?.slice(0, 10) ?? "", s.lat.toFixed(5), s.lng.toFixed(5)])])} className="rounded-full border px-4 py-2 text-sm">Esporta Excel</button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <Stat label="Totale segnalazioni" value={all.totale} />
            <Stat label="Problemi risolti" value={all.risolte} tone="olive" />
            <Stat label="Tempo medio (gg)" value={all.tempoMedio} />
            <Stat label="Animali soccorsi" value={all.animaliSoccorsi} tone="accent" />
            <Stat label="Colonie censite" value={all.colonie} />
          </div>
        </>
      )}
    </Shell>
  );
}
