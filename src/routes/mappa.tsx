import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, Card } from "@/components/Shell";
import { RealMap } from "@/components/RealMap";
import { useData, isChiusa, type Area } from "@/lib/data";
import { AREA_HEX, AREA_NOME, ZONE, type Zona } from "@/lib/aree";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/mappa")({
  head: () => seo("Mappa interattiva", "Segnalazioni aperte e chiuse, colonie feline, aree critiche e zone monitorate su Sannicola e Chiesanuova."),
  component: Mappa,
});

const FILTRI: Record<string, Area[]> = {
  Tutto: ["ambiente", "strade", "animali", "pericoli", "fragili", "colonie"],
  Ambiente: ["ambiente", "strade"],
  Animali: ["animali", "colonie"],
  Sicurezza: ["pericoli", "strade"],
  Emergenze: ["pericoli", "fragili"],
};

function Mappa() {
  const { segnalazioni } = useData();
  const [f, setF] = useState("Tutto");
  const [stato, setStato] = useState<"tutte" | "aperte" | "chiuse">("tutte");
  const [zona, setZona] = useState<Zona>("tutte");
  const items = segnalazioni.filter((s) => FILTRI[f]!.includes(s.area) && (stato === "tutte" || (stato === "chiuse") === isChiusa(s)));
  return (
    <Shell title="Mappa interattiva">
      <div className="mb-3 flex flex-wrap gap-2">
        {(Object.keys(ZONE) as Zona[]).map((z) => (
          <button key={z} onClick={() => setZona(z)} className={`rounded-full px-4 py-1.5 text-sm ${zona === z ? "bg-foreground text-background" : "border bg-card"}`}>{ZONE[z].label}</button>
        ))}
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        {Object.keys(FILTRI).map((k) => <button key={k} onClick={() => setF(k)} className={`rounded-full px-4 py-1.5 text-sm ${f === k ? "bg-primary text-primary-foreground" : "border bg-card"}`}>{k}</button>)}
        <span className="mx-2" />
        {(["tutte", "aperte", "chiuse"] as const).map((k) => <button key={k} onClick={() => setStato(k)} className={`rounded-full px-4 py-1.5 text-sm ${stato === k ? "bg-accent text-accent-foreground" : "border bg-card"}`}>{k}</button>)}
      </div>
      <RealMap items={items} height={520} zona={zona} />
      <Card className="mt-4 flex flex-wrap gap-4 text-sm">
        {(Object.keys(AREA_HEX) as Area[]).map((a) => <span key={a} className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: AREA_HEX[a] }} />{AREA_NOME[a]}</span>)}
        <span className="text-muted-foreground">Punti chiari = chiuse · grandi = urgenza alta · {items.length} segnalazioni</span>
      </Card>
    </Shell>
  );
}
