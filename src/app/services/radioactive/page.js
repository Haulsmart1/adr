import TransportPage from "@/components/TransportPage";
import pages from "@/data/transport-pages.json";
import { pageMetadata } from "@/lib/seo";
const page = pages.find(item => item.slug === "radioactive");
export const metadata = pageMetadata("/services/" + page.slug, page.title, page.description);
export default function Page() { return <TransportPage page={page} />; }
