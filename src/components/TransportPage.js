import Link from 'next/link';
import pages from '@/data/transport-pages.json';
import StructuredData from './StructuredData';
import { SITE_URL } from '@/lib/seo';

export function TransportActions({ label = 'Request a transport quote' }) {
  return <div className="flex flex-wrap items-center gap-4 my-6">
    <Link className="quote-button" href="/get-a-quote">{label}</Link>
    <a className="font-semibold underline py-3" href="tel:+448009991263">Call 0800 999 1263</a>
  </div>;
}

export default function TransportPage({ page }) {
  const url = `${SITE_URL}/services/${page.slug}`;
  const related = page.related.map(slug => pages.find(item => item.slug === slug));
  return <article className="mx-auto max-w-6xl px-5 py-12 md:py-16">
    <nav aria-label="Breadcrumb" className="text-sm mb-8"><Link className="underline" href="/">Home</Link> / <Link className="underline" href="/services">Services</Link> / {page.heading}</nav>
    <div className="max-w-3xl">
      <p className="text-blue-800 font-semibold mb-3">Specialist dangerous goods road transport</p>
      <h1 className="text-3xl md:text-5xl font-bold leading-tight">{page.heading}</h1>
      <p className="mt-6 text-lg leading-relaxed">{page.intro}</p>
      <TransportActions />
    </div>
    <div className="grid lg:grid-cols-3 gap-10 mt-10">
      <div className="lg:col-span-2 space-y-9">
        {page.sections.map(section => <section key={section.heading}><h2 className="text-2xl font-bold mb-3">{section.heading}</h2><p className="leading-relaxed">{section.text}</p></section>)}
        <section><h2 className="text-2xl font-bold mb-5">Questions before booking</h2>
          {page.faqs.map(faq => <details key={faq.question} className="border-b border-gray-300 py-4"><summary className="font-semibold cursor-pointer py-2">{faq.question}</summary><p className="mt-3 leading-relaxed">{faq.answer}</p></details>)}
        </section>
      </div>
      <aside className="bg-blue-50 rounded-xl p-6 self-start border border-blue-100">
        <h2 className="text-xl font-bold mb-4">For a useful quotation</h2>
        <ul className="list-disc pl-5 space-y-3">{page.checklist.map(item => <li key={item}>{item}</li>)}</ul>
        <p className="mt-5 leading-relaxed">Explain any missing information. Collection and acceptance must be confirmed by the team before the goods move.</p>
        <TransportActions label="Discuss this shipment" />
        <Link className="underline" href="/adr-resources">Full enquiry checklist</Link>
      </aside>
    </div>
    <section className="mt-14 border-t pt-8"><h2 className="text-2xl font-bold mb-5">Related transport guidance</h2>
      <ul className="grid md:grid-cols-3 gap-4">{related.map(item => <li key={item.slug}><Link className="block border rounded-xl p-5 underline hover:bg-blue-50" href={`/services/${item.slug}`}>{item.heading}</Link></li>)}</ul>
    </section>
    <StructuredData data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: 'Services', item: SITE_URL + '/services' },
      { '@type': 'ListItem', position: 3, name: page.heading, item: url }
    ] }} />
    <StructuredData data={{ '@context': 'https://schema.org', '@type': 'Service', name: page.heading, description: page.description, url, provider: { '@id': SITE_URL + '/#organisation' }, serviceType: 'Dangerous goods road transport enquiry' }} />
  </article>;
}
