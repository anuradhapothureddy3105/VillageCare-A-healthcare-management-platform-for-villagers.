import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import {
  Baby,
  Calendar,
  AlertTriangle,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Heart,
  FileText,
  UserCheck,
  ShieldCheck,
  Activity,
  Phone,
  MapPin,
  ChevronRight,
  X,
  Stethoscope,
} from 'lucide-react';

export const PregnancyDashboard = () => {
  const { t, lang } = useLanguage();
  const { isAdmin, isHealthWorker } = useAuth();
  const [records, setRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showObsModal, setShowObsModal] = useState(null); // appointment to edit observations
  const [obsForm, setObsForm] = useState({
    bloodPressure: '120/80',
    weightKg: 54,
    hemoglobin: 11.0,
    fundalHeightCm: 22,
    fetalHeartSound: 'Regular (140 bpm)',
    ifaTabletsDistributed: 30,
    tetanusToxoidDose: 'TT-1 administered',
    healthcareProviderNotes: '',
    status: 'completed',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pregRes, aptRes] = await Promise.all([
        apiFetch('/pregnancy'),
        apiFetch('/appointments'),
      ]);
      if (pregRes.success) setRecords(pregRes.records);
      if (aptRes.success) setAppointments(aptRes.appointments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalBeneficiaries = records.length;
  const highRiskCount = records.filter((r) => r.providerConfirmedHighRisk).length;
  const upcomingCount = appointments.filter((a) => a.status === 'scheduled').length;
  const missedCount = appointments.filter((a) => a.status === 'missed').length;

  const handleUpdateObservations = async (e) => {
    e.preventDefault();
    if (!showObsModal) return;

    try {
      const res = await apiFetch(`/appointments/${showObsModal.appointmentId}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: obsForm.status,
          observations: {
            bloodPressure: obsForm.bloodPressure,
            weightKg: Number(obsForm.weightKg),
            hemoglobin: Number(obsForm.hemoglobin),
            fundalHeightCm: Number(obsForm.fundalHeightCm),
            fetalHeartSound: obsForm.fetalHeartSound,
            ifaTabletsDistributed: Number(obsForm.ifaTabletsDistributed),
            tetanusToxoidDose: obsForm.tetanusToxoidDose,
          },
          healthcareProviderNotes: obsForm.healthcareProviderNotes,
        }),
      });

      if (res.success) {
        setShowObsModal(null);
        fetchData();
      }
    } catch (err) {
      alert('Failed to update check-up record: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-rose-700 uppercase tracking-wider">
            <Heart className="w-4 h-4" />
            <span>Maternal & Child Health Division</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            {lang === 'te' ? 'గర్భిణీ స్త్రీల ఆరోగ్య పర్యవేక్షణ వేదిక' : 'Pregnancy & Maternal Health Tracking'}
          </h1>
          <p className="text-xs text-slate-500">
            Pentapadu Primary Health Centre (PHC) & PMSMA Scheduled Care Portal
          </p>
        </div>

        {(isAdmin || isHealthWorker) && (
          <Link
            to="/maternal/register"
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Register Pregnant Mother</span>
          </Link>
        )}
      </div>

      {/* DPDP Confidentiality Banner */}
      <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4 flex items-start space-x-3 text-xs text-rose-900">
        <ShieldCheck className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Confidential Health Section: </span>
          {t('confidentialNotice')}
        </div>
      </div>

      {/* Maternal Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase">Enrolled Beneficiaries</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{totalBeneficiaries}</div>
          <div className="text-[11px] text-slate-400 mt-1">Pentapadu Village Active</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase">High-Risk Flagged</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-2">{highRiskCount}</div>
          <div className="text-[11px] text-rose-500 mt-1">PHC Doctor Confirmed</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase">Upcoming ANC Visits</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2">{upcomingCount}</div>
          <div className="text-[11px] text-emerald-600 mt-1">Scheduled at PHC</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase">Missed Follow-ups</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2">{missedCount}</div>
          <div className="text-[11px] text-amber-600 mt-1">Requires ASHA Home Visit</div>
        </div>
      </div>

      {/* Beneficiaries List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          {lang === 'te' ? 'నమోదైన గర్భిణీల వివరాలు & టైమ్‌లైన్' : 'Enrolled Mothers & Antenatal Timelines'}
        </h3>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading maternal health records...</div>
        ) : records.length === 0 ? (
          <div className="py-12 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            No pregnancy records registered yet.
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((r) => {
              const motherAppointments = appointments.filter((a) => a.beneficiaryId === r.beneficiaryId);
              return (
                <div
                  key={r.beneficiaryId}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                        <Baby className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-extrabold text-base text-slate-900">{r.villagerName}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {r.beneficiaryId}
                          </span>
                          {r.providerConfirmedHighRisk && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 flex items-center space-x-1">
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              <span>High-Risk</span>
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center space-x-3 mt-0.5">
                          <span>Household: {r.householdId}</span>
                          <span>Age: {r.age} yrs</span>
                          {r.contactNumber && <span>Phone: {r.contactNumber}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-500 block uppercase">
                        Expected Delivery (EDD)
                      </span>
                      <span className="text-sm font-extrabold text-brand-700">
                        {new Date(r.eddDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* High Risk Notes Callout */}
                  {r.providerConfirmedHighRisk && r.highRiskReasons?.length > 0 && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
                      <strong>PHC Doctor Clinical Flag: </strong>
                      {r.highRiskReasons.join(' • ')}
                    </div>
                  )}

                  {/* Visual Pregnancy Timeline */}
                  <div>
                    <div className="text-xs font-bold text-slate-700 mb-2">
                      Antenatal Check-up Schedule & Milestones:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      {motherAppointments.map((apt) => (
                        <div
                          key={apt.appointmentId}
                          className={`p-3 rounded-2xl border text-xs flex flex-col justify-between transition ${
                            apt.status === 'completed'
                              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                              : apt.status === 'missed'
                              ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-extrabold text-[11px]">{apt.appointmentType}</span>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                  apt.status === 'completed'
                                    ? 'bg-emerald-200 text-emerald-900'
                                    : apt.status === 'missed'
                                    ? 'bg-rose-200 text-rose-900'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {apt.status}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {new Date(apt.scheduledDate).toLocaleDateString()}
                            </div>
                            {apt.observations?.bloodPressure && (
                              <div className="text-[10px] text-slate-700 mt-1">
                                BP: <strong>{apt.observations.bloodPressure}</strong> | Hb: <strong>{apt.observations.hemoglobin}</strong>
                              </div>
                            )}
                          </div>

                          {(isAdmin || isHealthWorker) && (
                            <button
                              onClick={() => {
                                setShowObsModal(apt);
                                setObsForm({
                                  bloodPressure: apt.observations?.bloodPressure || '120/80',
                                  weightKg: apt.observations?.weightKg || 52,
                                  hemoglobin: apt.observations?.hemoglobin || 11.0,
                                  fundalHeightCm: apt.observations?.fundalHeightCm || 20,
                                  fetalHeartSound: apt.observations?.fetalHeartSound || '140 bpm',
                                  ifaTabletsDistributed: apt.observations?.ifaTabletsDistributed || 30,
                                  tetanusToxoidDose: apt.observations?.tetanusToxoidDose || 'TT-1 administered',
                                  healthcareProviderNotes: apt.healthcareProviderNotes || '',
                                  status: apt.status,
                                });
                              }}
                              className="mt-2 text-[10px] font-bold text-brand-700 hover:underline flex items-center space-x-1"
                            >
                              <Stethoscope className="w-3 h-3" />
                              <span>Record Observations</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Observation Entry Modal */}
      {showObsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Record Clinical Check-up Observations
                </h3>
                <p className="text-xs text-slate-500">
                  {showObsModal.beneficiaryName} ({showObsModal.appointmentType})
                </p>
              </div>
              <button
                onClick={() => setShowObsModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateObservations} className="space-y-3 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Pressure (BP)</label>
                  <input
                    type="text"
                    placeholder="e.g. 120/80"
                    value={obsForm.bloodPressure}
                    onChange={(e) => setObsForm({ ...obsForm, bloodPressure: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={obsForm.weightKg}
                    onChange={(e) => setObsForm({ ...obsForm, weightKg: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hemoglobin (g/dL)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 11.2"
                    value={obsForm.hemoglobin}
                    onChange={(e) => setObsForm({ ...obsForm, hemoglobin: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">IFA Tablets Issued</label>
                  <input
                    type="number"
                    value={obsForm.ifaTabletsDistributed}
                    onChange={(e) => setObsForm({ ...obsForm, ifaTabletsDistributed: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tetanus Toxoid (TT) Dose</label>
                <input
                  type="text"
                  placeholder="e.g. TT-1 or TT-2 or Booster"
                  value={obsForm.tetanusToxoidDose}
                  onChange={(e) => setObsForm({ ...obsForm, tetanusToxoidDose: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Appointment Status</label>
                <select
                  value={obsForm.status}
                  onChange={(e) => setObsForm({ ...obsForm, status: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="missed">Missed (Flag Alert)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Doctor / PHC Notes</label>
                <textarea
                  rows="2"
                  value={obsForm.healthcareProviderNotes}
                  onChange={(e) => setObsForm({ ...obsForm, healthcareProviderNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="Clinical guidance or referral advice..."
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-md transition"
                >
                  Save Check-up Records
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
