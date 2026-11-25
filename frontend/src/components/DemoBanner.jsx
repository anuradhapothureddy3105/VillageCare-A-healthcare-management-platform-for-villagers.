import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { apiFetch } from '../services/api.js';
import { AlertCircle, RefreshCw, UserCheck, Shield, HeartPulse, User } from 'lucide-react';

export const DemoBanner = () => {
  const { user, quickSwitchRole } = useAuth();
  const { t } = useLanguage();
  const [resetting, setResetting] = useState(false);
  const [msg, setMsg] = useState('');

  const handleReset = async () => {
    if (!window.confirm('Reset all demonstration data to fresh initial Pentapadu records?')) return;
    setResetting(true);
    try {
      await apiFetch('/demo/seed', { method: 'POST' });
      setMsg('Demo records reset successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err) {
      alert('Failed to reset demo: ' + err.message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="bg-emerald-900 text-white text-xs py-2 px-4 shadow-sm border-b border-emerald-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="bg-amber-400 text-amber-950 font-bold px-2 py-0.5 rounded uppercase tracking-wider text-[10px]">
            Demo Mode
          </span>
          <span className="text-emerald-100 hidden sm:inline">
            Pentapadu Village Demonstration Dataset (Fictional Records for B.Tech CSP Project)
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-emerald-200 mr-1 hidden md:inline">Quick Switch:</span>
          
          <button
            onClick={() => quickSwitchRole('admin')}
            className={`px-2 py-1 rounded flex items-center space-x-1 font-medium transition ${
              user?.role === 'admin'
                ? 'bg-emerald-500 text-white ring-1 ring-white'
                : 'bg-emerald-800 hover:bg-emerald-700 text-emerald-100'
            }`}
            title="Log in as Administrator (PHC Medical Officer)"
          >
            <Shield className="w-3 h-3" />
            <span>Admin (PHC Doctor)</span>
          </button>

          <button
            onClick={() => quickSwitchRole('health_worker')}
            className={`px-2 py-1 rounded flex items-center space-x-1 font-medium transition ${
              user?.role === 'health_worker'
                ? 'bg-emerald-500 text-white ring-1 ring-white'
                : 'bg-emerald-800 hover:bg-emerald-700 text-emerald-100'
            }`}
            title="Log in as Health Worker (ASHA Worker)"
          >
            <HeartPulse className="w-3 h-3" />
            <span>ASHA Worker</span>
          </button>

          <button
            onClick={() => quickSwitchRole('villager')}
            className={`px-2 py-1 rounded flex items-center space-x-1 font-medium transition ${
              user?.role === 'villager'
                ? 'bg-emerald-500 text-white ring-1 ring-white'
                : 'bg-emerald-800 hover:bg-emerald-700 text-emerald-100'
            }`}
            title="Log in as Villager (Pentapadu Resident)"
          >
            <User className="w-3 h-3" />
            <span>Villager</span>
          </button>

          <button
            onClick={handleReset}
            disabled={resetting}
            className="ml-2 px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded flex items-center space-x-1 border border-amber-400/30 font-medium transition"
          >
            <RefreshCw className={`w-3 h-3 ${resetting ? 'animate-spin' : ''}`} />
            <span>{t('resetDemoData')}</span>
          </button>
        </div>
      </div>
      {msg && (
        <div className="text-center text-amber-300 font-semibold mt-1">
          {msg}
        </div>
      )}
    </div>
  );
};
