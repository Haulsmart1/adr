export const SITE_URL = "https://adrcarriers.com";
export function serializeStructuredData(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
export function pageMetadata(route, title, description) {
  const url = SITE_URL + (route === "/" ? "/" : route);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "ADR Carriers Ltd",
      locale: "en_GB",
      type: "website",
    },
    twitter: { card: "summary", title, description },
  };
}
