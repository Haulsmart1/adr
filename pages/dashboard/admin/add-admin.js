import Head from 'next/head';
import Link from 'next/link';
import { releaseRouteAccess } from '@/lib/server/releaseRouteAccess';
import s from '@/styles/Enquiry.module.css';
export default function AddAdminPage() {
  return <main className={s.container}><Head><title>Administrator access | Midnight</title><meta name="robots" content="noindex,nofollow" /></Head>
    <h1>Administrator access</h1><p>Administrator authority is assigned through the trusted server-side bootstrap after the authentication provider verifies the authorised identity.</p>
    <p>Passwords are set securely with the authentication provider. This page cannot create passwords or grant administrator roles.</p>
    <Link href="/operations/enquiries">Operations enquiries</Link>
  </main>;
}
export const getServerSideProps = context => releaseRouteAccess(context, ['super_admin']);
AddAdminPage.freightMarketing = true;
