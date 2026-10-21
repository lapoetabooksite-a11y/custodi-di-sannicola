import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { CATEGORIE, CENTRO, useData, type Area, type Urgenza } from "@/lib/data";
import { Card } from "./Shell";
import { Camera, MapPin, Video } from "lucide-react";

const schema = z.object({
  categoria: z.string().min(1, "Scegli una categoria"),
  descrizione: z.string().trim().min(5, "Descrizione troppo breve").max(1000),
  note: z.string().max(500),
});

export function ReportForm({ area }: { area: Area }) {
  const { aggiungi } = useData();
  const cfg = CATEGORIE[area];
  const [categoria, setCat] = useState("");
  const [descrizione, setDesc] = useState("");
  const [note, setNote] = useState("");
  const [urgenza, setUrg] = useState<Urgenza>(area === "pericoli" ? "alta" : "media");
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [files, setFiles] = useState<string[]>([]);

  const gps = () => {
    if (!navigator.geolocation) { setPos(CENTRO); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => { setPos(CENTRO); toast.info("GPS non disponibile: uso il centro di Sannicola"); },
    );
  };

  const invia = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse({ categoria, descrizione, note });
    if (!r.success) { toast.error(r.error.issues[0]?.message ?? "Dati non validi"); return; }
    const p = pos ?? CENTRO;
    const n = aggiungi({ area, categoria, descrizione: descrizione + (note ? ` — Note: ${note}` : ""), urgenza, lat: p.lat, lng: p.lng });
    toast.success(`Segnalazione ${n.id} inviata a: ${n.destinatari.join(", ")}`);
    setCat(""); setDesc(""); setNote(""); setFiles([]);
  };

  return (
    <form onSubmit={invia} className="space-y-4">
      {area === "pericoli" && <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">Le segnalazioni di pericolo hanno sempre priorità alta.</div>}
      <Card>
        <div className="mb-2 text-sm font-semibold">Categoria</div>
        <div className="flex flex-wrap gap-2">
          {cfg.voci.map((v) => (
            <button type="button" key={v} onClick={() => setCat(v)}
              className={`rounded-full border px-3 py-1.5 text-sm ${categoria === v ? "border-primary bg-primary text-primary-foreground" : "bg-background"}`}>{v}</button>
          ))}
        </div>
      </Card>
      <Card className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm"><Camera className="h-4 w-4" />Scatta / carica foto
            <input type="file" accept="image/*" capture="environment" multiple hidden onChange={(e) => setFiles((f) => [...f, ...Array.from(e.target.files ?? []).map((x) => x.name)])} /></label>
          <label className="flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm"><Video className="h-4 w-4" />Registra video
            <input type="file" accept="video/*" capture="environment" hidden onChange={(e) => setFiles((f) => [...f, ...Array.from(e.target.files ?? []).map((x) => x.name)])} /></label>
          <button type="button" onClick={gps} className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm"><MapPin className="h-4 w-4" />{pos ? `${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}` : "Rileva posizione GPS"}</button>
        </div>
        {files.length > 0 && <div className="text-xs text-muted-foreground">Allegati: {files.join(", ")}</div>}
        <textarea value={descrizione} onChange={(e) => setDesc(e.target.value)} placeholder="Descrizione" rows={3} maxLength={1000} className="w-full rounded-xl border bg-background p-3 text-sm" />
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (facoltative)" rows={2} maxLength={500} className="w-full rounded-xl border bg-background p-3 text-sm" />
        {area !== "pericoli" && (
          <div className="flex items-center gap-2 text-sm">Urgenza:
            {(["bassa", "media", "alta"] as Urgenza[]).map((u) => (
              <button type="button" key={u} onClick={() => setUrg(u)} className={`rounded-full border px-3 py-1 ${urgenza === u ? "border-accent bg-accent text-accent-foreground" : ""}`}>{u}</button>
            ))}
          </div>
        )}
      </Card>
      <div className="text-xs text-muted-foreground">Invio automatico a: {cfg.destinatari.join(", ")}</div>
      <button className="w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground">Invia segnalazione</button>
    </form>
  );
}
