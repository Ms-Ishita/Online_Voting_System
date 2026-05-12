import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { API_URL } from '../config';

const AddElection = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: null,
    start_time: null,
    end_date: null,
    end_time: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    try {
      if (!formData.start_date || !formData.start_time || !formData.end_date || !formData.end_time) {
        throw new Error('Please select both date and time for start and end');
      }

      const start = dayjs(formData.start_date)
        .hour(dayjs(formData.start_time).hour())
        .minute(dayjs(formData.start_time).minute())
        .toISOString();

      const end = dayjs(formData.end_date)
        .hour(dayjs(formData.end_time).hour())
        .minute(dayjs(formData.end_time).minute())
        .toISOString();

      const payload = {
        title: formData.title,
        description: formData.description,
        start_time: start,
        end_time: end
      };

      const res = await fetch(`${API_URL}/elections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create election');
      
      setSuccess('Election created successfully!');
      setFormData({ 
        title: '', description: '', 
        start_date: null, start_time: null, 
        end_date: null, end_time: null 
      });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a dark theme for the Material UI pickers to match VOTEGUARD's aesthetic
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#10B981', // Emerald 500
      },
      background: {
        paper: '#0F172A', // Slate 900
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '0.75rem',
            backgroundColor: 'rgba(2, 6, 23, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            color: 'white',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#10B981',
              borderWidth: '1px',
            },
            '.MuiOutlinedInput-notchedOutline': {
              border: 'none',
            }
          },
          input: {
            padding: '12px 16px',
          }
        }
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: '#64748B', // Slate 500
          }
        }
      }
    }
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="min-h-screen bg-[#020617] text-[#F8FAFC] font-sans flex flex-col items-center pt-12 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500 opacity-[0.05] blur-[100px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="w-full max-w-2xl relative z-10">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Shield size={24} className="text-emerald-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-['Geist'] text-white">Create Election</h1>
            <p className="text-slate-400 text-sm mt-1">Configure a new secure voting event.</p>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-[#0F172A]/70 border border-emerald-500/20 backdrop-blur-xl shadow-[0_0_50px_rgba(16,185,129,0.05)]">
          {error && <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
          {success && <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Election Title</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 bg-[#020617]/50 border border-white/5 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-slate-600"
                placeholder="2026 Student Council Election"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Description</label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                  <FileText size={18} className="text-slate-500" />
                </div>

                <textarea 
                  required
                  rows="3"
                  className="w-full pl-10 pr-4 py-3 bg-[#020617]/50 border border-white/5 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-slate-600 resize-none"
                  placeholder="Details about the election..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
            </div>

            <div className="space-y-6">
              {/* Start Date & Time */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">Start Timeline</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DatePicker 
                    label="Select Date"
                    format="DD/MM/YYYY"
                    value={formData.start_date}
                    onChange={(newValue) => setFormData({...formData, start_date: newValue})}
                    className="w-full"
                  />
                  <TimePicker 
                    label="Select Time"
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                    value={formData.start_time}
                    onChange={(newValue) => setFormData({...formData, start_time: newValue})}
                    className="w-full"
                  />
                </div>
              </div>

              {/* End Date & Time */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">End Timeline</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DatePicker 
                    label="Select Date"
                    format="DD/MM/YYYY"
                    value={formData.end_date}
                    onChange={(newValue) => setFormData({...formData, end_date: newValue})}
                    className="w-full"
                  />
                  <TimePicker 
                    label="Select Time"
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock
                    }}
                    value={formData.end_time}
                    onChange={(newValue) => setFormData({...formData, end_time: newValue})}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="group flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-3.5 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] mt-8"
            >
              {loading ? 'Processing...' : 'Create Election'}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>
      </div>
    </div>
    </LocalizationProvider>
    </ThemeProvider>
  );
};

export default AddElection;
