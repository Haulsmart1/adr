import { useEffect, useRef, useState } from 'react';

// Keep authenticated download failures beside the enquiry. A direct link would
// replace the operations page with a JSON 401/403/503 response.
export default function EnquiryDocumentDownload({ reference, file }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const active = useRef(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; active.current?.abort(); };
  }, []);

  async function download() {
    if (active.current) return;
    const controller = new AbortController();
    active.current = controller;
    setBusy(true); setMessage('');
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, 30000);
    try {
      const response = await fetch('/api/operations/enquiries/' + reference + '/attachments/' + file.id, {
        signal: controller.signal, credentials: 'same-origin', cache: 'no-store', redirect: 'error',
      });
      if (!mounted.current || controller.signal.aborted) return;
      const accessErrors = {
        401: 'Sign in again, then reopen this enquiry to download its documents.',
        403: 'Your account does not have permission to download this document.',
        404: 'This document is no longer available. Reload the enquiry or contact operations.',
        503: 'Document temporarily unavailable. Please retry shortly.',
      };
      if (!response.ok) { setMessage(accessErrors[response.status] || 'Document could not be downloaded. Please retry.'); return; }
      // Never save a sign-in page or another unexpected response as a document.
      if (response.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/octet-stream') throw Error('Unexpected document response');
      const blob = await response.blob();
      if (!mounted.current || controller.signal.aborted) return;
      const url = URL.createObjectURL(blob);
      try {
        const link = document.createElement('a');
        link.href = url; link.download = file.name;
        document.body.appendChild(link); link.click(); link.remove();
        setMessage('Download prepared. Check your browser downloads.');
      } finally { setTimeout(() => URL.revokeObjectURL(url), 1000); }
    } catch {
      if (mounted.current) setMessage(timedOut ? 'Document download timed out. Please retry.' : 'Document download could not be confirmed. Check your connection and retry.');
    } finally {
      clearTimeout(timer);
      active.current = null;
      if (mounted.current) setBusy(false);
    }
  }
  return <><button type="button" disabled={busy} onClick={download}>{busy ? 'Downloading ' : 'Download '}{file.name}</button><span role="status" aria-live="polite">{message}</span></>;
}
