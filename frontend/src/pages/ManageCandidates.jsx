import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Users, PlusCircle, Trash2, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import { API_URL } from '../config';

const ManageCandidates = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [name, setName] = useState('');
  const [party, setParty] = useState('');
  const [photo, setPhoto] = useState(null);

  const fetchCandidates = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/candidates/${electionId}`);
      const data = await res.json();
      if (res.ok) {
        setCandidates(data);
      } else {
        setError(data.message || 'Failed to fetch candidates');
      }
    } catch (err) {
      setError('An error occurred while fetching candidates.');
    } finally {
      setLoading(false);
    }
  }, [electionId]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setError('');
    setActionLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('party', party);
    formData.append('election_id', electionId);
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/candidates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add candidate');

      // Reset form and refetch
      setName('');
      setParty('');
      setPhoto(null);
      // Reset the file input visually
      document.getElementById('photo-upload').value = '';
      
      await fetchCandidates();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;
    
    setError('');
    setActionLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/candidates/${candidateId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete candidate');

      await fetchCandidates();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC] font-sans p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-['Geist']">Manage Candidates</h1>
            <p className="text-sm text-slate-400">Election ID: {electionId}</p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Add Candidate Form */}
          <div className="col-span-1">
            <div className="p-6 rounded-2xl bg-[#0F172A]/50 border border-white/5 backdrop-blur-md sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <PlusCircle className="text-[#3B82F6]" size={20} />
                <h2 className="text-lg font-semibold font-['Geist']">Add Candidate</h2>
              </div>

              <form onSubmit={handleAddCandidate} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Candidate Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#020617]/50 border border-white/5 rounded-xl focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all text-white placeholder-slate-600 text-sm"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Party/Affiliation</label>
                  <input
                    type="text"
                    required
                    value={party}
                    onChange={(e) => setParty(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#020617]/50 border border-white/5 rounded-xl focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all text-white placeholder-slate-600 text-sm"
                    placeholder="Independent"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Photo (Optional)</label>
                  <label className="flex items-center justify-center gap-2 w-full px-3 py-4 border-2 border-dashed border-white/10 rounded-xl hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer">
                    <ImageIcon size={18} className="text-slate-400" />
                    <span className="text-sm text-slate-400">{photo ? photo.name : 'Choose image'}</span>
                    <input 
                      id="photo-upload"
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full mt-2 flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
                >
                  {actionLoading ? <Loader2 size={18} className="animate-spin" /> : 'Add Candidate'}
                </button>
              </form>
            </div>
          </div>

          {/* Candidates List */}
          <div className="col-span-1 md:col-span-2">
            <div className="p-6 rounded-2xl bg-[#0F172A]/50 border border-white/5 backdrop-blur-md min-h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Users className="text-emerald-500" size={20} />
                  <h2 className="text-lg font-semibold font-['Geist']">Existing Candidates</h2>
                </div>
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs text-white font-medium">
                  Total: {candidates.length}
                </span>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 size={32} className="text-[#3B82F6] animate-spin" />
                </div>
              ) : candidates.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <Users size={48} className="mx-auto mb-4 opacity-30" />
                  <p>No candidates added yet.</p>
                  <p className="text-sm mt-1">Use the form to add the first candidate.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {candidates.map((candidate) => (
                    <div key={candidate.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-start gap-4 hover:border-white/10 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center border border-white/10">
                        {candidate.photo_url ? (
                          <img src={candidate.photo_url} alt={candidate.name} className="w-full h-full object-cover" />
                        ) : (
                          <User size={20} className="text-slate-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">{candidate.name}</h3>
                        <p className="text-sm text-slate-400 truncate">{candidate.party}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteCandidate(candidate.id)}
                        disabled={actionLoading}
                        className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                        title="Remove candidate"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManageCandidates;
