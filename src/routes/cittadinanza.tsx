import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Shell, Card } from "@/components/Shell";
import { useData } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/cittadinanza")({
  head: () => seo("Cittadinanza attiva", "Sistema punti e classifica dei cittadini virtuosi di Sannicola."),
  component: Cittadinanza,
});

export const PUNTI = { segnalazione: 10, pulizia: 50, volontariato: 100 };

const CLASSIFICA = [
  { n: "Maria R.", p: 640 }, { n: "Giuseppe L.", p: 520 }, { n: "Anna P.", p: 410 },
  { n: "Luca M.", p: 300 }, { n: "Francesca D.", p: 180 },
];

function Cittadinanza() {
  const { punti, addPunti } = useData();
  const classifica = [...CLASSIFICA, { n: "Tu", p: punti }].sort((a, b) => b.p - a.p);
  const add = (n: number, l: string) => { addPunti(n); toast.success(`+${n} punti · ${l}`); };
  return (
    <Shell title="Cittadinanza attiva">
      <Card className="mb-4 text-center"><div className="text-sm text-muted-foreground">I tuoi punti</div><div className="font-display text-5xl text-primary">{punti}</div></Card>
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <button onClick={() => add(PUNTI.segnalazione, "segnalazione verificata")} className="rounded-2xl border bg-card p-4 text-left"><b className="text-primary">+{PUNTI.segnalazione}</b><div className="text-sm">Segnalazione verificata</div></button>
        <button onClick={() => add(PUNTI.pulizia, "pulizia ambientale")} className="rounded-2xl border bg-card p-4 text-left"><b className="text-olive">+{PUNTI.pulizia}</b><div className="text-sm">Partecipazione pulizia ambientale</div></button>
        <button onClick={() => add(PUNTI.volontariato, "volontariato certificato")} className="rounded-2xl border bg-card p-4 text-left"><b className="text-accent">+{PUNTI.volontariato}</b><div className="text-sm">Volontariato certificato</div></button>
      </div>
      <Card>
        <h2 className="mb-3 font-display text-xl">Classifica cittadini virtuosi</h2>
        <ol className="divide-y">{classifica.map((c, i) => <li key={c.n} className={`flex justify-between py-2 ${c.n === "Tu" ? "font-bold text-primary" : ""}`}><span>{i + 1}. {c.n}</span><span>{c.p} pt</span></li>)}</ol>
      </Card>
    </Shell>
  );
}
