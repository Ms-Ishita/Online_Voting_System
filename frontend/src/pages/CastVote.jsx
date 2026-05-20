import React, { useState, useEffect, useCallback } from 'react';

import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Mail,
  Vote
} from 'lucide-react';

import {
  useParams,
  useNavigate
} from 'react-router-dom';

import { API_URL } from '../config';

const CastVote = () => {
  const { electionId } = useParams();

  const navigate = useNavigate();

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [step, setStep] = useState(1);

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

      if (!elecRes.ok) {
        throw new Error(
          elecData.message ||
          'Failed to fetch election details'
        );
      }

      if (!candRes.ok) {
        throw new Error(
          candData.message ||
          'Failed to fetch candidates'
        );
      }

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

      const res = await fetch(
        `${API_URL}/votes/request-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            election_id: parseInt(electionId)
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || 'Failed to request OTP'
        );
      }

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

      if (!res.ok) {
        throw new Error(
          data.message || 'Failed to cast vote'
        );
      }

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

  /* LOADING */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">

        <Loader2
          size={42}
          className="text-white animate-spin"
        />
      </div>
    );
  }

  /* SUCCESS */
  if (voteSuccess) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center px-6 relative overflow-hidden">

        {/* GRID */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]"></div>

        {/* LIGHT */}
        <div className="absolute w-[600px] h-[600px] bg-emerald-500/10 blur-[140px] rounded-full"></div>

        <div className="relative z-10 max-w-lg w-full p-10 rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-2xl text-center">

          <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8">

            <ShieldCheck
              size={46}
              className="text-emerald-400"
            />
          </div>

          <h1 className="text-5xl font-bold tracking-tight">
            Vote Secured
          </h1>

          <p className="text-zinc-400 mt-5 text-lg leading-relaxed">
            Your vote has been securely encrypted
            and successfully recorded.
          </p>

          <div className="flex items-center justify-center gap-3 mt-10 text-zinc-500">

            <Loader2
              size={18}
              className="animate-spin"
            />

            Redirecting to dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white relative overflow-hidden px-6 py-10">

      {/* GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]"></div>

      {/* AMBIENT */}
      <div className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] bg-white opacity-[0.03] blur-[120px] rounded-full"></div>

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-14">

          <div className="flex items-center gap-5">

            <button
              onClick={() => navigate('/dashboard')}
              className="w-12 h-12 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] flex items-center justify-center transition-all"
            >
              <ArrowLeft size={20} />
            </button>

            <div>

              <h1 className="text-5xl font-bold tracking-tight">
                Secure Voting Portal
              </h1>

              <p className="text-zinc-500 mt-3 text-lg">
                {election?.title}
              </p>
            </div>
          </div>

          {step === 1 && (
            <div className="px-5 py-3 rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-300 text-sm">
              Step 1 • Select Candidate
            </div>
          )}

          {step === 2 && (
            <div className="px-5 py-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm">
              Step 2 • Verify Identity
            </div>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {step === 1 ? (
          <>
            {/* CANDIDATES */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

              {candidates.map((candidate) => {

                const isSelected =
                  selectedCandidate?.id === candidate.id;

                return (
                  <div
                    key={candidate.id}
                    onClick={() =>
                      setSelectedCandidate(candidate)
                    }
                    className={`group relative p-7 rounded-[30px] border cursor-pointer transition-all duration-300 backdrop-blur-xl ${
                      isSelected
                        ? 'bg-white/[0.06] border-white/20 scale-[1.02]'
                        : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
                    }`}
                  >

                    {/* SELECTED ICON */}
                    {isSelected && (
                      <div className="absolute top-5 right-5">

                        <CheckCircle2
                          size={24}
                          className="text-white"
                        />
                      </div>
                    )}

                    {/* AVATAR */}
                    <div className="mb-6">

                      {candidate.photo_url ? (
                        <img
                          src={candidate.photo_url}
                          alt={candidate.name}
                          className="w-24 h-24 rounded-3xl object-cover border border-white/10"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-3xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-3xl font-bold">

                          {candidate.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* INFO */}
                    <div>

                      <h2 className="text-2xl font-bold">
                        {candidate.name}
                      </h2>

                      <p className="text-zinc-500 mt-2">
                        {candidate.party}
                      </p>
                    </div>

                    {/* FOOTER */}
                    <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">

                      <span className="text-sm text-zinc-500">
                        Verified Candidate
                      </span>

                      <Vote
                        size={18}
                        className="text-zinc-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BUTTON */}
            <div className="flex justify-center mt-14">

              <button
                onClick={handleRequestOTP}
                disabled={
                  !selectedCandidate || actionLoading
                }
                className="group h-16 px-10 rounded-2xl bg-white text-black font-semibold text-lg hover:bg-zinc-200 transition-all flex items-center gap-3 disabled:opacity-50"
              >

                {actionLoading ? (
                  <Loader2
                    size={20}
                    className="animate-spin"
                  />
                ) : (
                  <>
                    Continue Securely

                    <ArrowLeft
                      size={18}
                      className="rotate-180 group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          /* OTP STEP */
          <div className="max-w-xl mx-auto">

            <div className="p-10 rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-2xl text-center">

              {/* ICON */}
              <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8">

                <Mail
                  size={40}
                  className="text-emerald-400"
                />
              </div>

              {/* TEXT */}
              <h2 className="text-4xl font-bold">
                Verify Your Identity
              </h2>

              <p className="text-zinc-500 mt-5 leading-relaxed text-lg">
                A secure OTP has been sent to your
                registered email address.
              </p>

              {/* FORM */}
              <form
                onSubmit={handleCastVote}
                className="mt-10 space-y-8"
              >

                {/* OTP */}
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) =>
                    setOtp(
                      e.target.value.replace(/\D/g, '')
                    )
                  }
                  placeholder="000000"
                  className="w-full h-20 rounded-3xl bg-[#111111] border border-white/10 text-center text-4xl tracking-[0.4em] font-mono text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-400 transition-all"
                />

                {/* BUTTONS */}
                <div className="flex gap-4">

                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp('');
                      setError('');
                    }}
                    className="flex-1 h-16 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={
                      otp.length !== 6 || actionLoading
                    }
                    className="flex-[2] h-16 rounded-2xl bg-white text-black font-semibold hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >

                    {actionLoading ? (
                      <Loader2
                        size={20}
                        className="animate-spin"
                      />
                    ) : (
                      <>
                        Confirm Vote

                        <ShieldCheck size={20} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CastVote;