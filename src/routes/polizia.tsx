import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Shell, Card, Badge } from "@/components/Shell";
import { useData, isChiusa, POLIZIA_AUTO } from "@/lib/data";
import { seo } from "@/lib/seo";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/polizia")({
  head: () => seo("Area Polizia Locale", "Notifiche automatiche, verifica, foto, chiusura pratiche e verbali."),
  component: Polizia,
});

function Polizia() {
  const { segnalazioni, aggiorna } = useData();
  const list = segnalazioni.filter((s) => POLIZIA_AUTO.includes(s.categoria) || s.destinatari.includes("Polizia Locale"));
  const nuove = list.filter((s) => s.stato === "nuova").length;
  return (
    <Shell title="Area Polizia Locale">
      <Card className="mb-4 flex items-center gap-3"><Bell className="text-accent" /><span><b>{nuove}</b> nuove notifiche ricevute automaticamente</span></Card>
      <p className="mb-4 text-sm text-muted-foreground">Categorie automatiche: {POLIZIA_AUTO.join(", ")}</p>
      <div className="space-y-3">
        {list.slice(0, 30).map((s) => (
          <Card key={s.id}>
            <div className="flex justify-between gap-2">
              <div><div className="font-semibold">{s.categoria} <span className="text-xs text-muted-foreground">{s.id}</span></div>
                <div className="text-xs text-muted-foreground">GPS {s.lat.toFixed(4)}, {s.lng.toFixed(4)} · {new Date(s.data).toLocaleDateString("it-IT")}</div></div>
              <div className="flex gap-1">{s.verbale && <Badge tone="alta">verbale</Badge>}<Badge tone={isChiusa(s) ? "ok" : "info"}>{s.stato}</Badge></div>
            </div>
            {!isChiusa(s) && (
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                <button onClick={() => { aggiorna(s.id, { stato: "presa in carico" }); toast.success("Verificata sul posto"); }} className="rounded-full border px-3 py-1">Verifica</button>
                <label className="cursor-pointer rounded-full border px-3 py-1">Allega foto<input type="file" accept="image/*" capture="environment" hidden onChange={() => toast.success("Foto allegata")} /></label>
                <button onClick={() => { aggiorna(s.id, { verbale: true }); toast.success(`Verbale emesso per ${s.id}`); }} className="rounded-full border border-destructive px-3 py-1 text-destructive">Emetti verbale</button>
                <button onClick={() => { aggiorna(s.id, { stato: "risolta", chiusaIl: new Date().toISOString() }); toast.success("Pratica chiusa"); }} className="rounded-full bg-primary px-3 py-1 text-primary-foreground">Chiudi pratica</button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </Shell>
  );
}
