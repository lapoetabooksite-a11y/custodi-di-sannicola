import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, Card } from "@/components/Shell";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/non-posso-parlare")({
  head: () => seo("Non posso parlare", "Invio immediato di un messaggio di emergenza con posizione GPS per chi non può parlare."),
  component: NonPossoParlare,
});

const MOTIVI = ["Malore / infarto", "Sono sordomuto/a", "Sono in pericolo, non posso parlare", "Violenza in corso"];

function NonPossoParlare() {
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [err, setErr] = useState("");
  const [motivo, setMotivo] = useState(MOTIVI[0]);
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setErr("Posizione non disponibile: attiva il GPS."),
      { enableHighAccuracy: true },
    );
  }, []);
  const coord = pos ? `${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}` : "in rilevamento…";
  const msg = `EMERGENZA - NON POSSO PARLARE. ${motivo}. Posizione: ${coord}${pos ? ` https://maps.google.com/?q=${pos.lat},${pos.lng}` : ""}. Inviato da app Custodi di Sannicola.`;
  return (
    <Shell title="Non posso parlare">
      <Card className="mb-4 text-center">
        <div className="text-sm text-muted-foreground">La tua posizione</div>
        <div className="font-display text-2xl">{coord}</div>
        {err && <div className="mt-1 text-sm text-destructive">{err}</div>}
      </Card>
      <div className="mb-4 grid gap-2">
        {MOTIVI.map((m) => (
          <button key={m} onClick={() => setMotivo(m)} className={`rounded-xl border p-3 text-left ${motivo === m ? "border-destructive bg-destructive/10 font-semibold" : "bg-card"}`}>{m}</button>
        ))}
      </div>
      <Card className="mb-4 text-sm">{msg}</Card>
      <div className="grid gap-3">
        <a href={`sms:112?body=${encodeURIComponent(msg)}`} className="rounded-full bg-destructive py-4 text-center text-lg font-bold text-destructive-foreground">INVIA SMS AL 112</a>
        <a href={`https://wa.me/?text=${encodeURIComponent(msg)}`} target="_blank" rel="noreferrer" className="rounded-full border py-3 text-center font-semibold">Invia a un contatto</a>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Per persone sorde è disponibile anche l'app ufficiale "112 Where ARE U".</p>
    </Shell>
  );
}
