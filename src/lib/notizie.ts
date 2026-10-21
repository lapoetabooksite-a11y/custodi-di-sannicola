export type CatNotizia = "Avvisi" | "Ordinanze" | "Lavori" | "Eventi" | "Ambiente" | "Emergenze";

export interface Notizia {
  id: string;
  data: string;
  titolo: string;
  categoria: CatNotizia;
  ufficio: string;
  testo: string;
  urgente?: boolean;
}

export const CATEGORIE_NOTIZIE: CatNotizia[] = ["Avvisi", "Ordinanze", "Lavori", "Eventi", "Ambiente", "Emergenze"];

export const NOTIZIE: Notizia[] = [
  { id: "n1", data: "2026-10-16", categoria: "Emergenze", urgente: true, ufficio: "Protezione Civile", titolo: "Allerta meteo arancione per sabato e domenica", testo: "Si raccomanda di evitare spostamenti non necessari, mettere in sicurezza oggetti su balconi e terrazzi e non sostare sotto alberi. Le scuole resteranno chiuse sabato." },
  { id: "n2", data: "2026-10-15", categoria: "Eventi", ufficio: "Assessorato Ambiente", titolo: "Giornata ecologica a Lido Conchiglie: iscrizioni aperte", testo: "Domenica 25 ottobre pulizia della spiaggia con volontari e scuole. Guanti e sacchi forniti dal Comune. Iscrizioni presso l'URP o in app." },
  { id: "n3", data: "2026-10-12", categoria: "Lavori", ufficio: "Ufficio Tecnico", titolo: "Rifacimento asfalto in via Roma: chiusura temporanea", testo: "Dal 19 al 23 ottobre via Roma sarà chiusa al traffico tra le 8 e le 17. Percorsi alternativi segnalati in loco." },
  { id: "n4", data: "2026-10-10", categoria: "Ambiente", ufficio: "Polizia Locale", titolo: "Nuove fototrappole installate nelle zone rurali", testo: "Per contrastare l'abbandono dei rifiuti sono attive nuove fototrappole. Chi abbandona rifiuti rischia sanzioni fino a 3.000 euro." },
  { id: "n5", data: "2026-10-05", categoria: "Ordinanze", ufficio: "Sindaco", titolo: "Ordinanza: divieto di bruciare sterpaglie fino al 31 ottobre", testo: "È vietata la combustione di residui vegetali in tutto il territorio comunale fino al 31 ottobre per il rischio incendi." },
  { id: "n6", data: "2026-10-02", categoria: "Avvisi", ufficio: "Servizi Sociali", titolo: "Campagna sterilizzazione gratuita colonie feline", testo: "In collaborazione con le associazioni convenzionate, sterilizzazioni gratuite per i gatti delle colonie censite. Prenotazioni in app." },
  { id: "n7", data: "2026-09-28", categoria: "Avvisi", ufficio: "Servizi Sociali", titolo: "Bonus spesa per famiglie in difficoltà", testo: "Aperte le domande per il contributo alimentare. Scadenza 30 ottobre. Assistenza presso lo sportello sociale il martedì e giovedì." },
];

export const fmtData = (d: string) => new Date(d).toLocaleDateString("it-IT", { day: "2-digit", month: "short" });
