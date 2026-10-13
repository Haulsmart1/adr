import Head from 'next/head';
import Link from 'next/link';

export default function Contact() {
  return (
    <div style={{
      backgroundImage: 'url("/midex5.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
    }}>
      <Head>
        <title>Contact Freight Operations | Midnight Express</title>
        <meta name="description" content="Discuss UK, Ireland, European and international freight with Midnight Express operations. Call or email your road, air, sea or time-critical shipment requirements." />
        <link rel="canonical" href="https://www.midnight-xpress.com/contact" />
      </Head>
      <nav style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        padding: '1.2rem',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <Link href="/" className="btn btn-outline-light fw-bold">Home</Link>
        <Link href="/contact" className="btn btn-outline-light fw-bold">Contact</Link>
        <Link href="/login" className="btn btn-outline-light fw-bold">Login</Link>
      </nav>

      <div className="container py-5">
        <div className="col-md-6 mx-auto p-4 bg-dark text-white rounded">
          <h1 className="mb-4 text-center">Speak to freight operations</h1>
          <p>Have freight to move? Discuss your road, air, sea or time-critical requirements directly with Midnight Express operations.</p>
          <p><a className="btn btn-light w-100 fw-bold" href="tel:+448009991263">Call 0800 999 1263</a></p>
          <p><a className="btn btn-outline-light w-100 fw-bold" href="mailto:freight@midnight-express.org">Email freight@midnight-express.org</a></p>
          <p>The email link opens your email app. Send your enquiry there, or call operations for an urgent requirement.</p>
          <p><Link href="/enquiry" className="btn btn-outline-light w-100">Prepare a road, air or sea enquiry</Link></p>
          <h2 className="h4 mt-4">What to tell operations</h2>
          <ul>
            <li>Collection and delivery locations</li>
            <li>Goods description, package or pallet count, dimensions and weight</li>
            <li>Cargo-ready date and required delivery window</li>
            <li>Loading access, customs and any regulated goods requirements</li>
          </ul>
          <p>Routes and shipment availability are confirmed individually by operations.</p>
          <p><Link href="/booking" className="btn btn-outline-light w-100">Start a road freight quote</Link></p>
        </div>
      </div>
    </div>
  );
}
Contact.freightMarketing = true;
