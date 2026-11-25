import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Baby,
  Heart,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Phone,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';

export const MyPregnancyRecord = () => {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const [record, setRecord] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyMaternalRecord = async () => {
      try {
        setLoading(true);
        const res = await apiFetch('/pregnancy');
        if (res.success && res.records && res.records.length > 0) {
          const myRec = res.records[0];
          setRecord(myRec);

          const aptRes = await apiFetch(`/appointments?beneficiaryId=${myRec.beneficiaryId}`);
          if (aptRes.success) setAppointments(aptRes.appointments);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyMaternalRecord();
  }, [user]);

  if (loading) {
    return <div className="py-12 text-center text-xs text-slate-400">Loading your maternal care records...</div>;
  }

  if (!record) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <Baby className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">No Pregnancy Record Enrolled</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          No active maternal health record is currently associated with your account or household. If you are expecting, please consult your Pentapadu ASHA worker to register.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Confidential Header */}
      <div className="bg-gradient-to-r from-rose-700 to-brand-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-3">
        <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full w-max">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Confidential Maternal Health Hub</span>
        </div>
        <h1 className="text-2xl font-black">
          {record.villagerName} ({record.beneficiaryId})
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs pt-2">
          <div>
            <span className="text-rose-200 block">LMP Date</span>
            <span className="font-bold">{new Date(record.lmpDate).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-rose-200 block">Expected Delivery (EDD)</span>
            <span className="font-bold text-amber-300">{new Date(record.eddDate).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-rose-200 block">Healthcare Facility</span>
            <span className="font-bold">{record.healthcareFacility}</span>
          </div>
        </div>
      </div>

      {/* Emergency Warning Signs Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2 text-xs">
        <div className="font-bold text-amber-950 flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>గర్భధారణ సమయంలో అత్యవసర ప్రమాద సంకేతాలు (Emergency Warning Signs):</span>
        </div>
        <p className="text-amber-900 leading-relaxed">
          తీవ్రమైన తలనొప్పి, కళ్లు మసకబారడం, ముఖం/కాళ్ల వాపులు, రక్తస్రావం లేదా కడుపులో బిడ్డ కదలికలు తగ్గితే వెంటనే 108 కి కాల్ చేసి లేదా పెంటపాడు PHC కి వెళ్లండి.
        </p>
      </div>

      {/* Scheduled Check-up Visits */}
      <div className="space-y-4">
        <h3 className="font-black text-base text-slate-900">
          {lang === 'te' ? 'వైద్య తనిఖీల పట్టిక & రిపోర్టులు' : 'Antenatal Check-up Schedule & Recorded Health Metrics'}
        </h3>

        <div className="space-y-3">
          {appointments.map((apt) => (
            <div
              key={apt.appointmentId}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-sm text-slate-900">{apt.appointmentType}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      apt.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Scheduled Date: <strong>{new Date(apt.scheduledDate).toLocaleDateString()}</strong> at {apt.facility}
                </div>

                {/* Observations Display */}
                {apt.status === 'completed' && apt.observations && (
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {apt.observations.bloodPressure && (
                      <span>BP: <strong>{apt.observations.bloodPressure}</strong></span>
                    )}
                    {apt.observations.weightKg > 0 && (
                      <span>Weight: <strong>{apt.observations.weightKg} kg</strong></span>
                    )}
                    {apt.observations.hemoglobin > 0 && (
                      <span>Hb: <strong>{apt.observations.hemoglobin} g/dL</strong></span>
                    )}
                    {apt.observations.tetanusToxoidDose && (
                      <span>TT: <strong>{apt.observations.tetanusToxoidDose}</strong></span>
                    )}
                    {apt.observations.ifaTabletsDistributed > 0 && (
                      <span>IFA: <strong>{apt.observations.ifaTabletsDistributed} tablets</strong></span>
                    )}
                  </div>
                )}
              </div>

              {apt.status === 'scheduled' && (
                <div className="text-right">
                  <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1 rounded-xl">
                    Upcoming Appointment
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
