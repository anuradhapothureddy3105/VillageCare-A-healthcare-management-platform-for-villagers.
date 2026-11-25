import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../services/api.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import {
  Baby,
  Heart,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  Save,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

export const PregnancyRegistration = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  const [households, setHouseholds] = useState([]);
  const [formData, setFormData] = useState({
    beneficiaryId: '',
    villagerName: '',
    householdId: '',
    age: 23,
    contactNumber: '',
    lmpDate: '',
    eddDate: '',
    healthcareFacility: 'Pentapadu Primary Health Centre (PHC)',
    gravida: 1,
    para: 0,
    providerConfirmedHighRisk: false,
    highRiskReasons: '',
    consentGiven: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHh = async () => {
      try {
        const res = await apiFetch('/households');
        if (res.success) setHouseholds(res.households);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHh();
  }, []);

  // Auto-calculate EDD when LMP changes (LMP + 280 days)
  const handleLmpChange = (e) => {
    const lmp = e.target.value;
    let eddStr = '';
    if (lmp) {
      const d = new Date(lmp);
      d.setDate(d.getDate() + 280);
      eddStr = d.toISOString().split('T')[0];
    }
    setFormData((prev) => ({
      ...prev,
      lmpDate: lmp,
      eddDate: eddStr,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.consentGiven) {
      setError('Explicit voluntary consent under DPDP Act 2023 is required before registering maternal health records.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch('/pregnancy', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          highRiskReasons: formData.highRiskReasons
            ? formData.highRiskReasons.split(',').map((s) => s.trim())
            : [],
        }),
      });

      if (res.success) {
        navigate('/maternal');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <Baby className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">
              Register Pregnant Mother (Confidential)
            </h1>
            <p className="text-xs text-slate-500">
              National Health Mission & PMSMA Antenatal Enrollment • Pentapadu PHC
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/maternal')}
          className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Mother / Beneficiary Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Lakshmi Prasanna"
                value={formData.villagerName}
                onChange={(e) => setFormData({ ...formData, villagerName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Household ID *
              </label>
              <select
                required
                value={formData.householdId}
                onChange={(e) => setFormData({ ...formData, householdId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
              >
                <option value="">-- Select Household --</option>
                {households.map((h) => (
                  <option key={h.householdId} value={h.householdId}>
                    {h.householdId} - {h.headOfHousehold} ({h.street})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Age of Mother</label>
              <input
                type="number"
                min="18"
                max="50"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Contact Phone (Consented)
              </label>
              <input
                type="tel"
                placeholder="98480xxxxx"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* LMP & Auto Calculated EDD */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Last Menstrual Period (LMP) Date *
              </label>
              <input
                type="date"
                required
                value={formData.lmpDate}
                onChange={handleLmpChange}
                className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Expected Delivery Date (EDD) [Auto-calculated]
              </label>
              <input
                type="date"
                required
                value={formData.eddDate}
                onChange={(e) => setFormData({ ...formData, eddDate: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl font-bold text-brand-700"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Calculated by Naegele's Rule (LMP + 280 days)
              </span>
            </div>
          </div>

          {/* High-risk Flags (Provider Confirmed) */}
          <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.providerConfirmedHighRisk}
                onChange={(e) => setFormData({ ...formData, providerConfirmedHighRisk: e.target.checked })}
                className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
              />
              <span className="font-bold text-rose-950">
                Healthcare Provider Confirmed High-Risk Pregnancy
              </span>
            </label>

            {formData.providerConfirmedHighRisk && (
              <div>
                <label className="block font-semibold text-rose-900 mb-1">
                  Clinical Reasons Confirmed by PHC Medical Officer
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gestational Hypertension, Severe Anemia (Hb < 9)"
                  value={formData.highRiskReasons}
                  onChange={(e) => setFormData({ ...formData, highRiskReasons: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-rose-300 rounded-xl"
                />
              </div>
            )}
          </div>

          {/* DPDP Consent */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.consentGiven}
                onChange={(e) => setFormData({ ...formData, consentGiven: e.target.checked })}
                className="mt-0.5 rounded text-brand-600 focus:ring-brand-500"
              />
              <span className="text-slate-700 leading-tight">
                <strong>Explicit Voluntary Consent (DPDP Act, 2023): </strong>
                Beneficiary was informed in Telugu and has voluntarily consented to antenatal monitoring, PMSMA clinic appointment scheduling and home visit reminders by Pentapadu ASHA workers.
              </span>
            </label>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-gradient-to-r from-rose-600 to-brand-600 hover:from-rose-700 hover:to-brand-700 text-white font-bold rounded-xl shadow-md transition"
            >
              {submitting ? 'Registering...' : 'Complete Maternal Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
