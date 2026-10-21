import { createContext, useContext, useState, type ReactNode, type Context } from "react";
import { NUCLEI } from "@/lib/aree";

export type Area = "ambiente" | "strade" | "animali" | "pericoli" | "fragili" | "colonie";
export type Stato = "nuova" | "presa in carico" | "assegnata" | "risolta" | "archiviata";
export type Urgenza = "bassa" | "media" | "alta";

export interface Segnalazione {
  id: string;
  area: Area;
  categoria: string;
  descrizione: string;
  urgenza: Urgenza;
  stato: Stato;
  lat: number;
  lng: number;
  data: string; // ISO
  destinatari: string[];
  assegnatoA?: string;
  verbale?: boolean;
  chiusaIl?: string | undefined;
}

export const CATEGORIE: Record<Area, { titolo: string; voci: string[]; destinatari: string[] }> = {
  ambiente: {
    titolo: "Ambiente",
    voci: ["Rifiuti ingombranti", "Discarica abusiva", "Eternit", "Scarichi illeciti", "Degrado ambientale", "Vegetazione pericolosa", "Incendio", "Danni al patrimonio comunale", "Veicolo abbandonato"],
    destinatari: ["Comune", "Polizia Locale"],
  },
  strade: {
    titolo: "Strade",
    voci: ["Buche", "Segnaletica danneggiata", "Illuminazione guasta", "Guardrail danneggiato", "Strada pericolosa", "Allagamenti", "Dissesto"],
    destinatari: ["Comune", "Ufficio Tecnico"],
  },
  animali: {
    titolo: "Benessere animale",
    voci: ["Animale ferito", "Animale investito", "Animale maltrattato", "Randagio in difficoltà", "Cucciolata abbandonata", "Animale intrappolato", "Carcassa animale"],
    destinatari: ["Comune", "Polizia Locale", "Associazione convenzionata"],
  },
  pericoli: {
    titolo: "Pericoli",
    voci: ["Pozzo aperto", "Vetri", "Ferri sporgenti", "Sostanze tossiche", "Bocconi avvelenati", "Rifiuti pericolosi", "Presenza amianto"],
    destinatari: ["Comune", "Polizia Locale"],
  },
  fragili: {
    titolo: "Persone fragili",
    voci: ["Anziano in difficoltà", "Persona disorientata", "Situazione di abbandono", "Fragilità sociale", "Emergenza abitativa"],
    destinatari: ["Servizi Sociali"],
  },
  colonie: {
    titolo: "Colonie feline",
    voci: ["Nuova colonia", "Aggiornamento colonia", "Necessità sterilizzazione", "Emergenza colonia"],
    destinatari: ["Comune", "Associazione convenzionata"],
  },
};

export const POLIZIA_AUTO = ["Discarica abusiva", "Rifiuti ingombranti", "Eternit", "Scarichi illeciti", "Veicolo abbandonato"];

// Sannicola (LE) approx centre
export const CENTRO = { lat: 40.0917, lng: 18.0675 };

function seed(): Segnalazione[] {
  const areas: Area[] = ["ambiente", "strade", "animali", "pericoli", "fragili", "colonie"];
  const stati: Stato[] = ["nuova", "presa in carico", "assegnata", "risolta", "risolta", "archiviata"];
  const out: Segnalazione[] = [];
  let s = 7;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const now = new Date("2026-10-17T08:00:00Z").getTime();
  for (let i = 0; i < 64; i++) {
    const area = areas[Math.floor(rnd() * areas.length)]!;
    const voci = CATEGORIE[area].voci;
    const categoria = voci[Math.floor(rnd() * voci.length)]!;
    const stato = stati[Math.floor(rnd() * stati.length)]!;
    const d = new Date(now - Math.floor(rnd() * 330) * 86400000);
    const urg: Urgenza = area === "pericoli" ? "alta" : (["bassa", "media", "alta"] as Urgenza[])[Math.floor(rnd() * 3)]!;
    const n = rnd() < 0.6 ? NUCLEI[0]! : NUCLEI[1]!;
    out.push({
      id: `CS-${1000 + i}`,
      area, categoria, stato, urgenza: urg,
      descrizione: `${categoria} segnalato dal cittadino`,
      lat: n[0] + (rnd() - 0.5) * 0.012,
      lng: n[1] + (rnd() - 0.5) * 0.016,
      data: d.toISOString(),
      destinatari: CATEGORIE[area].destinatari,
      chiusaIl: stato === "risolta" || stato === "archiviata" ? new Date(d.getTime() + (1 + Math.floor(rnd() * 9)) * 86400000).toISOString() : undefined,
    });
  }
  return out.sort((a, b) => b.data.localeCompare(a.data));
}

interface Ctx {
  segnalazioni: Segnalazione[];
  aggiungi: (s: Omit<Segnalazione, "id" | "stato" | "data" | "destinatari">) => Segnalazione;
  aggiorna: (id: string, patch: Partial<Segnalazione>) => void;
  punti: number;
  addPunti: (n: number) => void;
}
// Kept on globalThis so hot reloads don't create a second, empty context
const g = globalThis as unknown as { __custodiCtx?: Context<Ctx | null> };
const DataCtx = (g.__custodiCtx ??= createContext<Ctx | null>(null));

export function DataProvider({ children }: { children: ReactNode }) {
  const [segnalazioni, set] = useState<Segnalazione[]>(() => seed());
  const [punti, setPunti] = useState(120);
  const aggiungi: Ctx["aggiungi"] = (s) => {
    const n: Segnalazione = {
      ...s,
      id: `CS-${2000 + segnalazioni.length}`,
      stato: "nuova",
      data: new Date().toISOString(),
      destinatari: POLIZIA_AUTO.includes(s.categoria)
        ? Array.from(new Set([...CATEGORIE[s.area].destinatari, "Polizia Locale"]))
        : CATEGORIE[s.area].destinatari,
      urgenza: s.area === "pericoli" ? "alta" : s.urgenza,
    };
    set((p) => [n, ...p]);
    return n;
  };
  const aggiorna: Ctx["aggiorna"] = (id, patch) =>
    set((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  return (
    <DataCtx.Provider value={{ segnalazioni, aggiungi, aggiorna, punti, addPunti: (n) => setPunti((p) => p + n) }}>
      {children}
    </DataCtx.Provider>
  );
}
export function useData() {
  const c = useContext(DataCtx);
  if (!c) throw new Error("DataProvider mancante");
  return c;
}

export const isChiusa = (s: Segnalazione) => s.stato === "risolta" || s.stato === "archiviata";

export function statistiche(list: Segnalazione[]) {
  const chiuse = list.filter(isChiusa);
  const tempi = chiuse.filter((s) => s.chiusaIl).map((s) => (new Date(s.chiusaIl!).getTime() - new Date(s.data).getTime()) / 86400000);
  const perCat: Record<string, number> = {};
  const perArea: Record<string, number> = {};
  const perMese: Record<string, number> = {};
  list.forEach((s) => {
    perCat[s.categoria] = (perCat[s.categoria] ?? 0) + 1;
    perArea[s.area] = (perArea[s.area] ?? 0) + 1;
    const m = s.data.slice(0, 7);
    perMese[m] = (perMese[m] ?? 0) + 1;
  });
  return {
    totale: list.length,
    aperte: list.length - chiuse.length,
    risolte: chiuse.length,
    percentuale: list.length ? Math.round((chiuse.length / list.length) * 100) : 0,
    tempoMedio: tempi.length ? +(tempi.reduce((a, b) => a + b, 0) / tempi.length).toFixed(1) : 0,
    animaliSoccorsi: chiuse.filter((s) => s.area === "animali").length,
    colonie: list.filter((s) => s.categoria === "Nuova colonia").length,
    perCat, perArea, perMese,
  };
}

export function scaricaCSV(nome: string, righe: (string | number)[][]) {
  const csv = righe.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = nome;
  a.click();
}
