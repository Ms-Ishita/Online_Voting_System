import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, PlusCircle, Trash2, ArrowLeft, Loader2, Shield, User, Crown } from 'lucide-react';
import { API_URL } from '../config';

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Current logged in user (to check if God)
  const [currentUser, setCurrentUser] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('voter');

  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('An error occurred while fetching users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    setActionLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add user');

      setName('');
      setEmail('');
      setPassword('');
      setRole('voter');
      
      await fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    setError('');
    setActionLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete user');

      await fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const votersCount = users.filter(u => u.role === 'voter').length;
  const adminsCount = users.filter(u => u.role === 'admin').length;
  const godsCount = users.filter(u => u.role === 'god').length;

  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC] font-sans p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-['Geist'] text-white">Manage Users</h1>
            <p className="text-sm text-slate-400">Add and manage voters and administrators</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-400 font-medium">Total Voters</p>
              <h3 className="text-2xl font-bold text-white">{votersCount}</h3>
            </div>
            <User className="text-blue-500" size={32} opacity={0.5} />
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-400 font-medium">Administrators</p>
              <h3 className="text-2xl font-bold text-white">{adminsCount}</h3>
            </div>
            <Shield className="text-emerald-500" size={32} opacity={0.5} />
          </div>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-400 font-medium">God Level</p>
              <h3 className="text-2xl font-bold text-white">{godsCount}</h3>
            </div>
            <Crown className="text-amber-500" size={32} opacity={0.5} />
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Add User Form */}
          <div className="col-span-1">
            <div className="p-6 rounded-2xl bg-[#0F172A]/50 border border-white/5 backdrop-blur-md sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <PlusCircle className="text-[#3B82F6]" size={20} />
                <h2 className="text-lg font-semibold font-['Geist'] text-white">Add New User</h2>
              </div>

              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Full Name</label>
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
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#020617]/50 border border-white/5 rounded-xl focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all text-white placeholder-slate-600 text-sm"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#020617]/50 border border-white/5 rounded-xl focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all text-white placeholder-slate-600 text-sm"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#020617]/50 border border-white/5 rounded-xl focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all text-white text-sm"
                  >
                    <option value="voter">Voter</option>
                    {currentUser?.role === 'god' && (
                      <>
                        <option value="admin">Admin</option>
                        <option value="god">God (Superadmin)</option>
                      </>
                    )}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
                >
                  {actionLoading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account'}
                </button>
              </form>
            </div>
          </div>

          {/* Users List */}
          <div className="col-span-1 lg:col-span-2">
            <div className="rounded-2xl bg-[#0F172A]/50 border border-white/5 backdrop-blur-md overflow-hidden min-h-[400px]">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Users className="text-[#3B82F6]" size={20} />
                  <h2 className="text-lg font-semibold font-['Geist'] text-white">User Database</h2>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <Loader2 size={32} className="text-[#3B82F6] animate-spin" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-white/5">
                        <th className="px-6 py-4 text-left">Name / Email</th>
                        <th className="px-6 py-4 text-left">Role</th>
                        <th className="px-6 py-4 text-left">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-white">{u.name}</div>
                            <div className="text-xs text-slate-400">{u.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium uppercase ${
                              u.role === 'god' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                              u.role === 'admin' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                              'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {u.isVerified ? (
                              <span className="text-emerald-400 text-xs">Verified</span>
                            ) : (
                              <span className="text-amber-400 text-xs">Unverified</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {(currentUser?.role === 'god' || (currentUser?.role === 'admin' && u.role === 'voter')) && (
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                disabled={actionLoading || u.id === currentUser?.id}
                                className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete user"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
