import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, Card } from "@/components/Shell";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/violenza")({
  head: () => seo("Violenza sulle donne", "Aiuto rapido: 1522, 112, emergenza silenziosa e uscita rapida."),
  component: Violenza,
});

function Violenza() {
  const nav = useNavigate();
  const [hidden, setHidden] = useState(false);
  const esci = () => { setHidden(true); window.location.replace("https://www.google.it/search?q=meteo+sannicola"); };
  const silenziosa = () => {
    navigator.geolocation?.getCurrentPosition((p) => {
      const m = `Ho bisogno di aiuto. Posizione: https://maps.google.com/?q=${p.coords.latitude},${p.coords.longitude}`;
      window.location.href = `sms:112?body=${encodeURIComponent(m)}`;
    }, () => { window.location.href = `sms:112?body=${encodeURIComponent("Ho bisogno di aiuto, non posso parlare.")}`; });
  };
  if (hidden) return null;
  return (
    <Shell title="Non sei sola">
      <button onClick={esci} className="fixed right-4 top-20 z-40 rounded-full bg-foreground px-4 py-2 text-sm font-bold text-background">✕ ESCI SUBITO</button>
      <div className="grid gap-3">
        <a href="tel:1522" className="rounded-2xl bg-accent p-6 text-center text-2xl font-bold text-accent-foreground">Chiama 1522</a>
        <a href="tel:112" className="rounded-2xl bg-destructive p-6 text-center text-2xl font-bold text-destructive-foreground">Chiama 112</a>
        <button onClick={silenziosa} className="rounded-2xl border-2 border-destructive bg-card p-5 font-semibold text-destructive">Emergenza silenziosa (SMS con posizione)</button>
        <a href="https://www.1522.eu/" target="_blank" rel="noreferrer" className="rounded-2xl border bg-card p-4 text-center">Chat 1522 online</a>
      </div>
      <Card className="mt-6 text-sm text-muted-foreground">Il 1522 è gratuito, anonimo e attivo 24 ore su 24. Il pulsante "Esci subito" nasconde immediatamente questa schermata.</Card>
      <button onClick={() => nav({ to: "/" })} className="mt-4 text-sm text-primary">← Torna alla home</button>
    </Shell>
  );
}
