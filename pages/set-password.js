import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient'; // Adjust path if needed
import { projectConfig } from '@/lib/server/adminAuthority.cjs';

export default function SetPasswordPage({ enabled = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState('');
  const [session, setSession] = useState(null);

  // Handle Supabase session from invite/magic link
  useEffect(() => {
    if (!enabled) { setLoading(false); return; }
    const checkSession = async () => {
      // Check for access_token in URL hash
      if (typeof window !== "undefined" && window.location.hash.includes("access_token")) {
        const hash = window.location.hash.substr(1); // remove '#'
        const params = new URLSearchParams(hash);
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        if (access_token && refresh_token) {
          const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (error) {
            setStatus("❌ Could not set session. Try clicking the invite link again.");
            setLoading(false);
            return;
          }
            const verified = await supabase.auth.getUser();
            if (!verified.error && verified.data?.user?.email_confirmed_at) setSession(data.session);
          setLoading(false);
          return;
        }
      }
      // Fallback: check existing session
      const { data } = await supabase.auth.getSession();
      const verified = await supabase.auth.getUser();
      if (data?.session && !verified.error && verified.data?.user?.email_confirmed_at) setSession(data.session);
      setLoading(false);
    };
    checkSession().catch(() => { setStatus('Account setup is unavailable. Use a new provider link.'); setLoading(false); });
  }, [enabled]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!enabled || !session) return;
    setStatus('');
    if (!password || !confirm) {
      setStatus('❌ Both fields are required.');
      return;
    }
    if (password !== confirm) {
      setStatus('❌ Passwords do not match.');
      return;
    }
    setLoading(true);
    let error;
    try { ({ error } = await supabase.auth.updateUser({ password })); }
    catch { error = true; }
    if (error) {
      setStatus('Password could not be updated. Check the provider requirements or request a new link.');
      setLoading(false);
      return;
    }
    setStatus('✅ Password set! Redirecting...');
    setPassword(''); setConfirm('');
    await supabase.auth.signOut().catch(() => {});
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  };

  if (!enabled) return <main><h1>Secure account setup</h1><p>Dedicated Midnight authentication is not configured. Password setup is unavailable in this preview.</p></main>;
  if (loading) return <p style={{ textAlign: 'center', marginTop: 80 }}>Loading...</p>;
  if (!session) return <p style={{ textAlign: 'center', marginTop: 80 }}>Session invalid or expired. Please use the most recent link sent to your email.</p>;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '50px auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h2 style={{ textAlign: 'center' }}>Set Your Password</h2>
      <input
        aria-label="New password"
        type="password"
        placeholder="New password"
        value={password}
        minLength={8}
        autoComplete="new-password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        aria-label="Confirm new password"
        type="password"
        placeholder="Confirm password"
        value={confirm}
        autoComplete="new-password"
        minLength={8}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>Save Password</button>
      <p role="status" style={{ minHeight: 30, textAlign: 'center', color: status.startsWith('✅') ? 'green' : 'red' }}>{status}</p>
    </form>
  );
}
export async function getServerSideProps({res}) {
  res.setHeader('Cache-Control','private, no-store');
  try { projectConfig(process.env); return {props:{enabled:true}}; }
  catch { return {props:{enabled:false}}; }
}
