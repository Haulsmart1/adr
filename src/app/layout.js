import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CookieConsent from "../components/CookieConsent";
import StructuredData from "@/components/StructuredData";
import { SITE_URL } from "@/lib/seo";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ADR Carriers Ltd",
  description:
    "Discuss specialist dangerous goods road transport with ADR Carriers Ltd.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main id="main-content" className="bg-white text-gray-900">
          {children}
        </main>
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": SITE_URL + "/#organisation",
                name: "ADR Carriers Ltd",
                url: SITE_URL,
                telephone: "+448009991263",
              },
              {
                "@type": "WebSite",
                "@id": SITE_URL + "/#website",
                url: SITE_URL,
                name: "ADR Carriers Ltd",
                publisher: { "@id": SITE_URL + "/#organisation" },
              },
            ],
          }}
        />
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
