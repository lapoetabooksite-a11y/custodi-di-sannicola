import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Shell } from "@/components/Shell";
import { ReportForm } from "@/components/ReportForm";
import { CATEGORIE } from "@/lib/data";
import { seo } from "@/lib/seo";

const AREE = ["ambiente", "strade", "animali", "pericoli", "fragili"] as const;

export const Route = createFileRoute("/segnala")({
  validateSearch: z.object({ area: z.enum(AREE).optional() }),
  head: () => seo("Nuova segnalazione", "Segnala problemi ambientali, stradali, animali in difficoltà, pericoli e persone fragili."),
  component: Segnala,
});

function Segnala() {
  const { area = "ambiente" } = Route.useSearch();
  return (
    <Shell title="Nuova segnalazione">
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {AREE.map((a) => (
          <Link key={a} to="/segnala" search={{ area: a }}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${a === area ? "bg-primary text-primary-foreground" : "border bg-card"}`}>
            {CATEGORIE[a].titolo}
          </Link>
        ))}
      </div>
      <ReportForm key={area} area={area} />
    </Shell>
  );
}
