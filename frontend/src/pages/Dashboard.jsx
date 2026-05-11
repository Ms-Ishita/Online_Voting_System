import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Shield, Crown, Settings, LogOut, 
  PlusCircle, PlayCircle, StopCircle, Users 
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

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
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Voter Section - Available to everyone (since admins/gods are also voters) */}
          <div className="col-span-1 md:col-span-3 lg:col-span-1 space-y-6">
            <div className="p-6 rounded-2xl bg-[#0F172A]/50 border border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="text-[#3B82F6]" size={24} />
                <h2 className="text-xl font-semibold font-['Geist']">My Profile</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Email</label>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Status</label>
                  <p className="text-emerald-400 font-medium">{user.isVerified ? 'Verified' : 'Pending Verification'}</p>
                </div>
                <button className="w-full mt-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                  Edit Information
                </button>
              </div>
            </div>
          </div>

          {/* Admin Tools - Available to Admin and God */}
          {(user.role === 'admin' || user.role === 'god') && (
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
                  <button className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors group">
                    <PlayCircle size={32} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-emerald-50 text-sm">Start Election</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors group">
                    <StopCircle size={32} className="text-red-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-red-50 text-sm">Stop Election</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* God Tools - Only available to God */}
          {user.role === 'god' && (
            <div className="col-span-1 md:col-span-3 mt-6">
              <div className="p-6 rounded-2xl bg-[#0F172A]/50 border border-amber-500/20 backdrop-blur-md shadow-[0_0_30px_rgba(245,158,11,0.05)]">
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
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
