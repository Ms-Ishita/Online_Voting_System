import React from 'react';
import { ArrowRight } from 'lucide-react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import AddElection from './pages/AddElection';
import ManageCandidates from './pages/ManageCandidates';
import CastVote from './pages/CastVote';
import ManageUsers from './pages/ManageUsers';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC] font-sans selection:bg-[#3B82F6] selection:text-white relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#3B82F6] opacity-[0.05] blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-white/5 bg-[#0F172A]/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-widest text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              VOTEGUARD
            </span>
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
        <Route path="/admin/manage-candidates/:electionId" element={<ManageCandidates />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/vote/:electionId" element={<CastVote />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
