import { createFileRoute } from "@tanstack/react-router";
import { Shell, Card, Badge } from "@/components/Shell";
import { ReportForm } from "@/components/ReportForm";
import { RealMap } from "@/components/RealMap";
import { useData } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/colonie")({
  head: () => seo("Colonie feline", "Censisci e aggiorna le colonie feline, segnala sterilizzazioni ed emergenze."),
  component: Colonie,
});

function Colonie() {
  const { segnalazioni } = useData();
  const col = segnalazioni.filter((s) => s.area === "colonie");
  return (
    <Shell title="Colonie feline">
      <RealMap items={col} height={260} />
      <Card className="my-6">
        <h2 className="mb-2 font-display text-xl">Colonie registrate ({col.length})</h2>
        <ul className="divide-y text-sm">
          {col.slice(0, 8).map((c) => <li key={c.id} className="flex justify-between py-2">{c.categoria} · {c.id}<Badge>{c.stato}</Badge></li>)}
        </ul>
      </Card>
      <ReportForm area="colonie" />
    </Shell>
  );
}
