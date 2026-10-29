import { serializeStructuredData } from "@/lib/seo";

export default function StructuredData({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeStructuredData(data),
      }}
    />
  );
}
