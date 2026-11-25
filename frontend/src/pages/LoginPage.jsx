import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Heart, Shield, HeartPulse, User, Lock, Phone, UserPlus, CheckSquare } from 'lucide-react';

export const LoginPage = () => {
  const { login, register, quickSwitchRole } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [householdId, setHouseholdId] = useState('');
  const [consentGiven, setConsentGiven] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectAfterLogin = (role) => {
    if (role === 'admin') navigate('/admin');
    else if (role === 'health_worker') navigate('/health-worker');
    else navigate('/villager');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(username, password);
      redirectAfterLogin(user.role);
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!consentGiven) {
      setError('Under DPDP Act 2023, voluntary consent is required to register health records.');
      return;
    }
    setLoading(true);
    try {
      const user = await register({
        username,
        password,
        fullName,
        phone,
        householdId,
        role: 'villager',
        consentGiven,
      });
      redirectAfterLogin(user.role);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCreds = async (role) => {
    setLoading(true);
    try {
      const user = await quickSwitchRole(role);
      redirectAfterLogin(user.role);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-tr from-brand-800 to-emerald-600 p-8 text-white text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">VILLAGECARE</h2>
          <p className="text-xs text-emerald-100 mt-1">
            Pentapadu Smart Village Health Portal
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => { setActiveTab('login'); setError(''); }}
            className={`flex-1 py-3 text-xs font-bold transition ${
              activeTab === 'login'
                ? 'text-brand-600 border-b-2 border-brand-600 bg-brand-50/40'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t('navLogin')}
          </button>
          <button
            onClick={() => { setActiveTab('register'); setError(''); }}
            className={`flex-1 py-3 text-xs font-bold transition ${
              activeTab === 'register'
                ? 'text-brand-600 border-b-2 border-brand-600 bg-brand-50/40'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {lang === 'te' ? 'గ్రామస్థుల నమోదు' : 'Villager Registration'}
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. admin or asha_pentapadu"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-md shadow-brand-600/20 transition"
              >
                {loading ? t('loading') : t('navLogin')}
              </button>

              {/* Demo Credentials Quick Fill Box */}
              <div className="pt-6 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 text-center">
                  One-Click Demo Roles
                </span>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => fillDemoCreds('admin')}
                    className="w-full p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-brand-300 text-left text-xs flex items-center justify-between transition"
                  >
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-brand-700" />
                      <span className="font-bold text-slate-800">Admin (PHC Medical Officer)</span>
                    </div>
                    <span className="text-[10px] text-slate-400">admin / admin123</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillDemoCreds('health_worker')}
                    className="w-full p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-brand-300 text-left text-xs flex items-center justify-between transition"
                  >
                    <div className="flex items-center space-x-2">
                      <HeartPulse className="w-4 h-4 text-brand-700" />
                      <span className="font-bold text-slate-800">Health Worker (ASHA Worker)</span>
                    </div>
                    <span className="text-[10px] text-slate-400">asha_pentapadu / asha123</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillDemoCreds('villager')}
                    className="w-full p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-brand-300 text-left text-xs flex items-center justify-between transition"
                  >
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-brand-700" />
                      <span className="font-bold text-slate-800">Villager (Pentapadu Resident)</span>
                    </div>
                    <span className="text-[10px] text-slate-400">villager_ramu / villager123</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramu Somayajulu"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. ramu_pentapadu"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98480xxxxx"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Household ID</label>
                  <input
                    type="text"
                    value={householdId}
                    onChange={(e) => setHouseholdId(e.target.value)}
                    placeholder="e.g. HH-PTP-001"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl uppercase"
                  />
                </div>
              </div>

              {/* DPDP Consent */}
              <div className="p-3 bg-brand-50/70 border border-brand-200 rounded-xl text-xs space-y-1">
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-0.5 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-slate-700 text-[11px] leading-tight">
                    I provide voluntary informed consent under the <strong>DPDP Act, 2023</strong> for public health reminders and household survey recommendations in Pentapadu Village.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-md transition"
              >
                {loading ? t('loading') : 'Register Villager Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
