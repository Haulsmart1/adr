import fs from "fs";
import path from "path";
import { westernEuropeCities } from "../data/westernEuropeCities.js";

const SITE_URL = "https://www.adrcarriers.com";

const cityUrls = westernEuropeCities.map(city => `
  <url>
    <loc>${SITE_URL}/adr-courier/${city.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`).join("");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <priority>1.0</priority>
  </url>
  ${cityUrls}
</urlset>`;

const outputPath = path.join(process.cwd(), "public", "sitemap.xml");

fs.writeFileSync(outputPath, sitemap.trim());

console.log("✅ sitemap.xml generated at /public/sitemap.xml");
