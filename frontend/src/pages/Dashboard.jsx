import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Shield, Crown, Settings, LogOut, 
  PlusCircle, PlayCircle, StopCircle, Users,
  CalendarClock, Loader2, CheckCircle2, Clock, XCircle,
  Pencil, X, Save
} from 'lucide-react';
import { API_URL } from '../config';

const statusBadge = (status) => {
  const map = {
    upcoming: { label: 'Upcoming', cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: <Clock size={12} /> },
    active:   { label: 'Active',   cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: <CheckCircle2 size={12} /> },
    ended:    { label: 'Ended',    cls: 'bg-slate-500/20 text-slate-400 border-slate-500/30', icon: <XCircle size={12} /> },
  };
  const s = map[status] || map.upcoming;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${s.cls}`}>
      {s.icon} {s.label}
    </span>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [elections, setElections] = useState([]);
  const [loadingElections, setLoadingElections] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [actionError, setActionError] = useState('');

  // Edit profile state
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ email: '', password: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  // Fetch live profile from backend
  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setEditForm({ email: data.email || '', password: '' });
      }
    } catch { /* silently fail */ }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const fetchElections = useCallback(async () => {
    setLoadingElections(true);
    try {
      const res = await fetch(`${API_URL}/elections`);
      const data = await res.json();
      setElections(Array.isArray(data) ? data : []);
    } catch {
      setElections([]);
    } finally {
      setLoadingElections(false);
    }
  }, []);

  useEffect(() => {
    fetchElections();
  }, [fetchElections]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    setEditSuccess('');
    const token = localStorage.getItem('token');
    try {
      const payload = {};
      if (editForm.email) payload.email = editForm.email;
      if (editForm.password) payload.password = editForm.password;

      const res = await fetch(`${API_URL}/users/me/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      setEditSuccess('Profile updated successfully!');
      // Update local state and localStorage
      const updatedUser = { ...user, ...data.user };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      await fetchProfile();
      setTimeout(() => { setEditOpen(false); setEditSuccess(''); }, 1500);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleStartElection = async (id) => {
    setActionLoading(id);
    setActionError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/elections/start/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to start election');
      await fetchElections();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEndElection = async (id) => {
    setActionLoading(id);
    setActionError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/elections/end/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to end election');
      await fetchElections();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (!user) return null;

  const isAdmin = user.role === 'admin' || user.role === 'god';

  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC] font-sans">
      {/* Top Navbar */}
      <nav className="border-b border-white/5 bg-[#0F172A]/80 backdrop-blur-xl px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              user.role === 'god' ? 'bg-amber-500/20 text-amber-500' :
              user.role === 'admin' ? 'bg-emerald-500/20 text-emerald-500' :
              'bg-[#3B82F6]/20 text-[#3B82F6]'
            }`}>
              {user.role === 'god' ? <Crown size={20} /> :
               user.role === 'admin' ? <Shield size={20} /> :
               <User size={20} />}
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">{user.name}</h1>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                {user.role} Portal
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* My Profile */}
          <div className="col-span-1 space-y-6">
            <div className="p-6 rounded-2xl bg-[#0F172A]/50 border border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="text-[#3B82F6]" size={24} />
                <h2 className="text-xl font-semibold font-['Geist']">My Profile</h2>
              </div>

              {!editOpen ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider">Name</label>
                    <p className="text-white font-medium">{profile?.name || user.name || '—'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider">Email</label>
                    <p className="text-white font-medium">{profile?.email || user.email || '—'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider">Role</label>
                    <p className="text-white font-medium capitalize">{profile?.role || user.role}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider">Status</label>
                    <p className={(profile?.isVerified ?? user.isVerified) ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                      {(profile?.isVerified ?? user.isVerified) ? 'Verified' : 'Pending Verification'}
                    </p>
                  </div>
                  <button
                    onClick={() => { setEditOpen(true); setEditError(''); setEditSuccess(''); }}
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Pencil size={14} /> Edit Information
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  {editError && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{editError}</div>}
                  {editSuccess && <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">{editSuccess}</div>}
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">New Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2.5 bg-[#020617]/50 border border-white/5 rounded-xl focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all text-white placeholder-slate-600 text-sm"
                      placeholder="Enter new email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">New Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2.5 bg-[#020617]/50 border border-white/5 rounded-xl focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all text-white placeholder-slate-600 text-sm"
                      placeholder="Leave blank to keep current"
                      value={editForm.password}
                      onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={editLoading}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      {editLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditOpen(false)}
                      className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Admin Tools */}
          {isAdmin && (
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="p-6 rounded-2xl bg-[#0F172A]/50 border border-emerald-500/20 backdrop-blur-md shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="text-emerald-500" size={24} />
                  <h2 className="text-xl font-semibold font-['Geist'] text-emerald-50">Election Management</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button onClick={() => navigate('/admin/add-election')} className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors group">
                    <PlusCircle size={32} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-emerald-50 text-sm">Add Election</span>
                  </button>
                  <button 
                    onClick={() => navigate('/admin/manage-users')} 
                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors group"
                  >
                    <Users size={32} className="text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-blue-50 text-sm">Manage Users</span>
                  </button>
                  <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-[#0F172A]/40 border border-white/5 opacity-70">
                    <Shield size={32} className="text-slate-500" />
                    <span className="font-medium text-slate-400 text-sm">More tools coming soon</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Elections Section */}
        <div className="rounded-2xl bg-[#0F172A]/50 border border-white/5 backdrop-blur-md overflow-hidden">
          <div className="flex items-center gap-3 p-6 border-b border-white/5">
            <CalendarClock className="text-[#3B82F6]" size={24} />
            <h2 className="text-xl font-semibold font-['Geist']">
              {isAdmin ? 'All Elections' : 'Available Elections'}
            </h2>
            <button
              onClick={fetchElections}
              className="ml-auto text-xs text-slate-400 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              Refresh
            </button>
          </div>

          {actionError && (
            <div className="mx-6 mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {actionError}
            </div>
          )}

          {loadingElections ? (
            <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
              <Loader2 size={24} className="animate-spin" />
              <span>Loading elections...</span>
            </div>
          ) : elections.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <CalendarClock size={40} className="mx-auto mb-3 opacity-40" />
              <p>No elections found.</p>
            </div>
          ) : isAdmin ? (
            /* ── Admin: table view with actions ── */
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-white/5">
                    <th className="px-6 py-3 text-left">Title</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Progress</th>
                    <th className="px-6 py-3 text-left">Start Time</th>
                    <th className="px-6 py-3 text-left">End Time</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {elections.map((election) => {
                    const totalVoters = election.totalVoters || 1; // prevent div by zero
                    const votesCast = election.votesCast || 0;
                    const percent = Math.min(100, Math.round((votesCast / totalVoters) * 100));
                    
                    return (
                    <tr key={election.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{election.title}</td>
                      <td className="px-6 py-4">{statusBadge(election.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 w-24">
                          <div className="flex justify-between text-[10px] text-slate-400">
                            <span>{votesCast}/{election.totalVoters || 0} votes</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percent}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{new Date(election.start_time).toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4 text-slate-400">{new Date(election.end_time).toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/manage-candidates/${election.id}`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 text-blue-400 text-xs font-medium transition-colors"
                          >
                            <Users size={12} /> Candidates
                          </button>
                          {election.status === 'upcoming' && (
                            <button
                              onClick={() => handleStartElection(election.id)}
                              disabled={actionLoading === election.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium transition-colors disabled:opacity-50"
                            >
                              {actionLoading === election.id ? <Loader2 size={12} className="animate-spin" /> : <PlayCircle size={12} />}
                              Start
                            </button>
                          )}
                          {election.status === 'active' && (
                            <button
                              onClick={() => handleEndElection(election.id)}
                              disabled={actionLoading === election.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors disabled:opacity-50"
                            >
                              {actionLoading === election.id ? <Loader2 size={12} className="animate-spin" /> : <StopCircle size={12} />}
                              Stop
                            </button>
                          )}
                          {election.status === 'ended' && (
                            <span className="text-xs text-slate-500 italic">Concluded</span>
                          )}
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* ── Voter: premium card grid ── */
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {elections.map((election) => {
                const isActive = election.status === 'active';
                const isEnded = election.status === 'ended';
                return (
                  <div
                    key={election.id}
                    className={`relative rounded-2xl p-5 border flex flex-col gap-4 transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-br from-[#3B82F6]/10 to-[#0F172A]/80 border-[#3B82F6]/30 shadow-[0_0_30px_rgba(59,130,246,0.08)]'
                        : isEnded
                        ? 'bg-[#0F172A]/40 border-white/5 opacity-60'
                        : 'bg-[#0F172A]/60 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Live pulse for active */}
                    {isActive && (
                      <span className="absolute top-4 right-4 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                      </span>
                    )}

                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-white text-base leading-tight pr-4">{election.title}</h3>
                    </div>

                    {election.description && (
                      <p className="text-slate-400 text-sm line-clamp-2">{election.description}</p>
                    )}

                    <div className="space-y-1.5 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <Clock size={11} />
                        <span>Starts: {new Date(election.start_time).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle size={11} />
                        <span>Ends: {new Date(election.end_time).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {statusBadge(election.status)}
                      {isActive ? (
                        <button 
                          onClick={() => navigate(`/vote/${election.id}`)}
                          className="flex items-center gap-1.5 bg-[#3B82F6] hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-[0_0_14px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                        >
                          Cast Vote →
                        </button>
                      ) : isEnded ? (
                        <span className="text-xs text-slate-600 italic">Concluded</span>
                      ) : (
                        <span className="text-xs text-slate-500">Not started yet</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>


        {/* God Tools */}
        {user.role === 'god' && (
          <div className="rounded-2xl bg-[#0F172A]/50 border border-amber-500/20 backdrop-blur-md shadow-[0_0_30px_rgba(245,158,11,0.05)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <Crown className="text-amber-500" size={24} />
              <h2 className="text-xl font-semibold font-['Geist'] text-amber-50">Superadmin (God) Controls</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center gap-3 px-6 py-4 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors flex-1">
                <Users size={24} className="text-amber-500" />
                <div className="text-left">
                  <div className="font-medium text-amber-50">Manage Admins</div>
                  <div className="text-xs text-amber-500/70">Promote or demote users</div>
                </div>
              </button>
              <button className="flex items-center gap-3 px-6 py-4 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors flex-1">
                <Shield size={24} className="text-amber-500" />
                <div className="text-left">
                  <div className="font-medium text-amber-50">System Logs</div>
                  <div className="text-xs text-amber-500/70">View security audit trails</div>
                </div>
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
