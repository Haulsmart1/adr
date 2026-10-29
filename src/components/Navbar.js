import Link from "next/link";
const links = [
  ["/services", "Services"],
  ["/services/express-europe-ni", "UK & Europe"],
  ["/adr-resources", "Guidance"],
  ["/contact", "Contact"],
];
export default function Navbar() {
  return (
    <header className="bg-gray-950 text-white">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <nav aria-label="Main navigation" className="mx-auto max-w-6xl px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold">
            ADR Carriers Ltd
          </Link>
          <a className="underline font-semibold py-3" href="tel:+448009991263">0800 999 1263</a>
          <Link className="quote-button" href="/get-a-quote">
            Get a quote
          </Link>
        </div>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm">
          {links.map(([href, label]) => (
            <li key={href}>
              <Link className="hover:underline" href={href}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
