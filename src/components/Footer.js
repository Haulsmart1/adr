import Link from "next/link";
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <p className="text-lg font-semibold">ADR Carriers Ltd</p>
        <p className="mt-3">
          Discuss your UK or European dangerous-goods movement.
        </p>
        <p className="mt-3">
          <a className="underline" href="tel:+448009991263">
            0800 999 1263
          </a>{" "}
          ·{" "}
          <a className="underline" href="mailto:stuart@adrcarriers.net">
            stuart@adrcarriers.net
          </a>
        </p>
        <nav aria-label="Footer navigation">
          <ul className="mt-6 flex flex-wrap gap-5">
            {[
              ["/services", "Services"],
              ["/services/lithium-transport", "Lithium batteries"],
              ["/services/explosives", "Class 1"],
              ["/services/radioactive", "Class 7"],
              ["/services/ireland-dangerous-goods", "Ireland"],
              ["/areas/cumbria", "Cumbria"],
              ["/sectors", "Industries"],
              ["/employment", "Careers"],
              ["/subcontractor-register", "Subcontractors"],
              ["/policy", "Company policies"],
              ["/privacy-policy", "Privacy"],
              ["/contact", "Contact"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link className="underline" href={href}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-6 text-sm">
          © {new Date().getFullYear()} ADR Carriers Ltd.
        </p>
      </div>
    </footer>
  );
}
