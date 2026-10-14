import { useState } from 'react';
import { supabase } from '/lib/supabaseClient';
import { toast } from 'react-toastify';
import Head from 'next/head';
import { projectConfig } from '@/lib/server/adminAuthority.cjs';

export default function ResetRequest({ enabled = false }) {
  const [email, setEmail] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!enabled) return;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/set-password',
    });

    if (error) {
      toast.error('Failed to send reset link');
    } else {
      toast.success('If this account is eligible, the provider will send password recovery instructions.');
    }
  };

  return (
    <>
      <Head><title>Reset Password | Midnight Express</title></Head>

      <div className="container py-5 text-white">
        <h1 className="display-6 fw-bold mb-4">Reset Your Password</h1>
        {!enabled && <p>Secure account recovery is awaiting dedicated Midnight authentication configuration. No recovery email will be sent from this preview.</p>}
        <form onSubmit={handleResetPassword}>
          <input
            aria-label="Account email"
            type="email"
            placeholder="Enter your email"
            className="form-control mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={!enabled} className="btn btn-outline-light">
            Send Reset Link
          </button>
        </form>
      </div>
    </>
  );
}
export async function getServerSideProps({res}) {
  res.setHeader('Cache-Control','private, no-store');
  try { projectConfig(process.env); return {props:{enabled:true}}; }
  catch { return {props:{enabled:false}}; }
}
