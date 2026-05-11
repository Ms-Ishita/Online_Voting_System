import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification token.');
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch('http://localhost:56478/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message || 'Verification failed');
        
        setStatus('success');
        setMessage(data.message);
      } catch (err) {
        setStatus('error');
        setMessage(err.message);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617] text-[#F8FAFC]">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#0F172A]/70 border border-white/10 backdrop-blur-xl text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 size={48} className="text-[#3B82F6] animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-white">Verifying Session...</h2>
            <p className="text-slate-400 mt-2 text-sm">Please wait while we cryptographically verify your email.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Email Verified</h2>
            <p className="text-emerald-400 mt-2 text-sm">{message}</p>
            <Link to="/login" className="mt-8 bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors w-full">
              Proceed to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <XCircle size={32} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Verification Failed</h2>
            <p className="text-red-400 mt-2 text-sm">{message}</p>
            <Link to="/register" className="mt-8 border border-white/20 hover:bg-white/5 text-white px-6 py-2.5 rounded-lg font-medium transition-colors w-full">
              Back to Registration
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;
