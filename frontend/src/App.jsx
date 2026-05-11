import React from 'react';
import { Lock, ShieldCheck, Link as LinkIcon, ArrowRight } from 'lucide-react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import AddElection from './pages/AddElection';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC] font-sans selection:bg-[#3B82F6] selection:text-white relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#3B82F6] opacity-[0.05] blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-white/5 bg-[#0F172A]/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#3B82F6] flex items-center justify-center">
              <Lock size={16} className="text-white" />
            </div>
            <span className="font-bold tracking-widest text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              VOTEGUARD
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-xs font-medium text-emerald-500 uppercase tracking-wider">Encrypted Session</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:text-white text-slate-300 transition-colors">
              Login
            </Link>
            <Link to="/register" className="text-sm font-medium bg-[#3B82F6] hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-sm text-slate-300">Live Institutional Voting Network</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
            Secure Democracy <br className="hidden md:block" /> in Your Hands.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Experience the next generation of institutional voting. Encrypted, transparent, and accessible from anywhere. Every vote is cryptographically secured.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link to="/register" className="group flex items-center justify-center gap-2 w-full sm:w-auto bg-[#3B82F6] hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-[0_0_30px_rgba(59,130,246,0.25)]">
              Get Started Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="flex items-center justify-center w-full sm:w-auto bg-[#0F172A]/70 hover:bg-[#0F172A] border border-white/10 backdrop-blur-xl text-white px-8 py-4 rounded-xl font-medium transition-all hover:border-white/20">
              Admin Portal
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto pt-16">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0F172A]/50 border border-white/5 backdrop-blur-md">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <ShieldCheck size={24} className="text-emerald-500" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">End-to-End Encryption</h3>
                <p className="text-sm text-slate-400">Your ballot is encrypted before it leaves your device.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0F172A]/50 border border-white/5 backdrop-blur-md">
              <div className="w-12 h-12 rounded-full bg-[#3B82F6]/10 flex items-center justify-center shrink-0">
                <LinkIcon size={24} className="text-[#3B82F6]" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">Transparent Verification</h3>
                <p className="text-sm text-slate-400">Publicly verifiable without compromising voter privacy.</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/add-election" element={<AddElection />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
