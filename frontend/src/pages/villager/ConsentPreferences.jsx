import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { ShieldCheck, AlertCircle, CheckCircle2, Lock, FileEdit, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ConsentPreferences = () => {
  const { user, updateConsentPreferences } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const [consentActive, setConsentActive] = useState(user?.consentGiven ?? true);
  const [requestCorrection, setRequestCorrection] = useState(false);
  const [correctionNotes, setCorrectionNotes] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleToggleConsent = async () => {
    setLoading(true);
    setMessage('');
    try {
      const nextState = !consentActive;
      const res = await updateConsentPreferences({ consentGiven: nextState });
      setConsentActive(nextState);
      setMessage(nextState ? 'Consent granted successfully.' : 'Consent withdrawn. Your record will not receive proactive reminders.');
    } catch (err) {
      alert('Error updating consent: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCorrectionSubmit = async (e) => {
    e.preventDefault();
    if (!correctionNotes.trim()) return;
    setLoading(true);
    try {
      const res = await updateConsentPreferences({
        requestCorrection: true,
        correctionNotes,
      });
      setMessage(res.message);
      setRequestCorrection(false);
      setCorrectionNotes('');
    } catch (err) {
      alert('Correction request error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">
              {t('dpdpConsentTitle')}
            </h1>
            <p className="text-xs text-slate-500">
              Indian Digital Personal Data Protection Act, 2023 Compliance
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Main Consent Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 text-xs leading-relaxed text-slate-700">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2">
          <div className="font-bold text-slate-900 text-sm">
            {lang === 'te' ? 'సమ్మతి విధానం & హక్కులు' : 'Your Privacy Rights in VillageCare'}
          </div>
          <p>
            {t('consentText')}
          </p>
          <ul className="list-disc pl-4 space-y-1 text-slate-600 pt-1">
            <li>Personal health details are never exposed to other villagers or public boards.</li>
            <li>For children under 18, household head / parental consent is mandatory.</li>
            <li>You can withdraw consent or request factual corrections at any time.</li>
          </ul>
        </div>

        {/* Current Status & Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200">
          <div>
            <span className="font-bold text-slate-900 block">
              {lang === 'te' ? 'ప్రస్తుత సమ్మతి స్థితి' : 'Current Consent Status'}
            </span>
            <span className="text-slate-500 text-[11px]">
              {consentActive ? 'Active and Recorded' : 'Withdrawn by Resident'}
            </span>
          </div>

          <button
            onClick={handleToggleConsent}
            disabled={loading}
            className={`px-4 py-2 rounded-xl font-bold transition shadow-sm ${
              consentActive
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                : 'bg-brand-600 hover:bg-brand-700 text-white'
            }`}
          >
            {consentActive ? t('withdrawConsent') : t('grantConsent')}
          </button>
        </div>

        {/* Request Data Correction */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">
                {lang === 'te' ? 'సమాచార సవరణ అభ్యర్థన' : 'Request Data Correction'}
              </span>
              <span className="text-slate-500 text-[11px]">
                Notice any incorrect family count, contact number, or street details?
              </span>
            </div>

            <button
              onClick={() => setRequestCorrection(!requestCorrection)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold flex items-center space-x-1"
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>{requestCorrection ? 'Close Form' : t('requestCorrection')}</span>
            </button>
          </div>

          {requestCorrection && (
            <form onSubmit={handleCorrectionSubmit} className="space-y-3 pt-2">
              <textarea
                rows="3"
                required
                value={correctionNotes}
                onChange={(e) => setCorrectionNotes(e.target.value)}
                placeholder="Describe the exact correction needed (e.g. Please update our contact number or street name)..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
              ></textarea>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition shadow-sm"
              >
                Submit Correction to ASHA Worker
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
