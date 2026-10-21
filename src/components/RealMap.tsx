import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, type ReactNode } from "react";
import type { Segnalazione } from "@/lib/data";
import type { Zona } from "@/lib/aree";

// Leaflet funziona solo nel browser: caricato dopo l'idratazione
const LeafletMap = lazy(() => import("./LeafletMap"));

function Segno({ height, testo = "Caricamento mappa…" }: { height: number; testo?: string }) {
  return (
    <div
      className="grid place-items-center rounded-2xl border bg-muted text-sm text-muted-foreground"
      style={{ height }}
    >
      {testo}
    </div>
  );
}

export function RealMap({
  items,
  height = 460,
  zona = "tutte",
}: {
  items: Segnalazione[];
  height?: number;
  zona?: Zona;
}) {
  const fallback = <Segno height={height} />;
  return (
    <ClientOnly fallback={fallback}>
      <Suspense fallback={fallback}>{<Map items={items} height={height} zona={zona} />}</Suspense>
    </ClientOnly>
  );
}

function Map({ items, height, zona }: { items: Segnalazione[]; height: number; zona: Zona }): ReactNode {
  return <LeafletMap items={items} height={height} zona={zona} />;
}
