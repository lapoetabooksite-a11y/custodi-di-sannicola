import type { Area } from "@/lib/data";

// Colori esadecimali: Leaflet non accetta variabili CSS negli attributi SVG
export const AREA_HEX: Record<Area, string> = {
  ambiente: "#6a8f38",
  strade: "#c0683f",
  animali: "#2b6ea3",
  pericoli: "#c73a2b",
  fragili: "#cf9a3d",
  colonie: "#2e9a90",
};

export const AREA_NOME: Record<Area, string> = {
  ambiente: "Ambiente",
  strade: "Strade",
  animali: "Benessere animale",
  pericoli: "Pericoli",
  fragili: "Persone fragili",
  colonie: "Colonie feline",
};

export type Zona = "tutte" | "sannicola" | "chiesanuova";

// Coordinate reali (OpenStreetMap): Sannicola paese e la frazione Chiesanuova
export const ZONE: Record<Zona, { label: string; centro: [number, number]; zoom: number }> = {
  tutte: { label: "Tutto il territorio", centro: [40.0905, 18.0605], zoom: 14 },
  sannicola: { label: "Sannicola", centro: [40.0945, 18.0634], zoom: 17 },
  chiesanuova: { label: "Chiesanuova", centro: [40.087, 18.0548], zoom: 17 },
};

// I due nuclei abitati: le segnalazioni si distribuiscono su entrambi
export const NUCLEI: [number, number][] = [
  [40.0945, 18.0634], // Sannicola
  [40.087, 18.0548], // Chiesanuova
];
