export const seo = (t: string, d: string) => ({
  meta: [
    { title: `${t} · Custodi di Sannicola` },
    { name: "description", content: d },
    { property: "og:title", content: `${t} · Custodi di Sannicola` },
    { property: "og:description", content: d },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ],
});
