import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, User, CheckCircle, ShieldCheck, Mail } from 'lucide-react';
import { API_URL } from '../config';

const CastVote = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Voting state
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [step, setStep] = useState(1); // 1: select, 2: otp
  const [otp, setOtp] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [elecRes, candRes] = await Promise.all([
        fetch(`${API_URL}/elections/${electionId}`),
        fetch(`${API_URL}/candidates/${electionId}`)
      ]);
      
      const elecData = await elecRes.json();
      const candData = await candRes.json();
      
      if (!elecRes.ok) throw new Error(elecData.message || 'Failed to fetch election details');
      if (!candRes.ok) throw new Error(candData.message || 'Failed to fetch candidates');
      
      setElection(elecData);
      setCandidates(candData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [electionId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRequestOTP = async () => {
    if (!selectedCandidate) return;
    
    setActionLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/votes/request-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ election_id: parseInt(electionId) })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to request OTP');
      
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCastVote = async (e) => {
    e.preventDefault();
    if (!selectedCandidate || !otp) return;
    
    setActionLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          candidate_id: parseInt(selectedCandidate.id),
          election_id: parseInt(electionId),
          otp
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to cast vote');
      
      setVoteSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 size={48} className="text-[#3B82F6] animate-spin" />
      </div>
    );
  }

  if (voteSuccess) {
    return (
      <div className="min-h-screen bg-[#020617] text-[#F8FAFC] flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#0F172A]/70 border border-emerald-500/30 backdrop-blur-xl text-center shadow-[0_0_50px_rgba(16,185,129,0.15)]">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Vote Cast Successfully!</h2>
          <p className="text-slate-400 mb-8">Your vote has been cryptographically secured and recorded.</p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <Loader2 size={16} className="animate-spin text-[#3B82F6]" /> Redirecting to dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC] font-sans p-6 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold font-['Geist'] text-white leading-tight">Cast Your Vote</h1>
              <p className="text-sm text-slate-400">{election?.title || 'Loading election...'}</p>
            </div>
          </div>
          {step === 1 && (
            <div className="px-4 py-1.5 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-sm font-medium inline-flex items-center justify-center self-start sm:self-auto">
              Step 1: Select Candidate
            </div>
          )}
          {step === 2 && (
            <div className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-medium inline-flex items-center justify-center self-start sm:self-auto">
              Step 2: Verify Identity
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {step === 1 ? (
          /* Step 1: Select Candidate */
          <div className="space-y-6">
            {candidates.length === 0 ? (
              <div className="text-center py-16 text-slate-500 bg-[#0F172A]/50 rounded-2xl border border-white/5">
                <p>No candidates available for this election yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    onClick={() => setSelectedCandidate(candidate)}
                    className={`relative p-5 rounded-2xl border flex items-center gap-5 cursor-pointer transition-all duration-300 ${
                      selectedCandidate?.id === candidate.id
                        ? 'bg-gradient-to-br from-[#3B82F6]/20 to-[#0F172A]/80 border-[#3B82F6]/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                        : 'bg-[#0F172A]/50 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-full bg-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center border-2 border-transparent">
                      {candidate.photo_url ? (
                        <img src={candidate.photo_url} alt={candidate.name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} className="text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <h3 className="font-bold text-lg text-white truncate">{candidate.name}</h3>
                      <p className="text-sm text-slate-400 truncate">{candidate.party}</p>
                    </div>
                    {selectedCandidate?.id === candidate.id && (
                      <div className="absolute right-5 text-[#3B82F6]">
                        <CheckCircle size={24} className="fill-[#3B82F6]/20" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                onClick={handleRequestOTP}
                disabled={!selectedCandidate || actionLoading}
                className="flex items-center gap-2 bg-[#3B82F6] hover:bg-blue-600 disabled:opacity-50 text-white px-8 py-3.5 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]"
              >
                {actionLoading ? <Loader2 size={18} className="animate-spin" /> : 'Proceed to Verification →'}
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: OTP Verification */
          <div className="max-w-md mx-auto p-8 rounded-2xl bg-[#0F172A]/50 border border-white/5 backdrop-blur-md text-center mt-12 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
              <Mail size={32} className="text-amber-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Security Verification</h2>
            <p className="text-sm text-slate-400 mb-8">
              We've sent a 6-digit OTP to your registered email address. Enter it below to confirm your vote for <span className="font-semibold text-white">{selectedCandidate?.name}</span>.
            </p>

            <form onSubmit={handleCastVote} className="space-y-6">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center tracking-[0.5em] text-2xl px-4 py-4 bg-[#020617]/80 border border-white/10 rounded-xl focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all text-white font-mono placeholder-slate-700"
                  placeholder="000000"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep(1); setOtp(''); setError(''); }}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white px-4 py-3.5 rounded-xl font-medium transition-colors border border-white/10"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={otp.length !== 6 || actionLoading}
                  className="flex-[2] flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-4 py-3.5 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                >
                  {actionLoading ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Vote'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default CastVote;
