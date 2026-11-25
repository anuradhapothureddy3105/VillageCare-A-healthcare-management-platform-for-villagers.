import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  Home,
  ClipboardCheck,
  Baby,
  Calendar,
  AlertTriangle,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Sparkles,
  Stethoscope,
  ListTodo,
  FileText,
  UserCheck,
} from 'lucide-react';
import { StatCard } from '../../components/StatCard.jsx';

export const HealthWorkerDashboard = () => {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const [stats, setStats] = useState(null);
  const [pendingSurveys, setPendingSurveys] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [maternalRecords, setMaternalRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Daily ASHA Field Tasks checklist state
  const [fieldTasks, setFieldTasks] = useState([
    { id: 1, text: 'Conduct doorstep survey at Suri Babu household (Gandhi Bomma Center)', done: false },
    { id: 2, text: 'Home visit for Bhavani Devi (HH-PTP-009) - High-Risk BP & Anemia check', done: true },
    { id: 3, text: 'Remind pregnant beneficiaries about 9th Dec PMSMA clinic at Pentapadu PHC', done: false },
    { id: 4, text: 'Check drinking water covered storage compliance in Canal Bund Road', done: false },
    { id: 5, text: 'Distribute Iron & Folic Acid (IFA) tablets to 2nd trimester mothers', done: true },
  ]);

  const toggleTask = (id) => {
    setFieldTasks(fieldTasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  useEffect(() => {
    const fetchWorkerData = async () => {
      try {
        setLoading(true);
        const [statsRes, hhRes, aptRes, pregRes] = await Promise.all([
          apiFetch('/dashboard/statistics'),
          apiFetch('/households'),
          apiFetch('/appointments?status=scheduled'),
          apiFetch('/pregnancy'),
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (hhRes.success) {
          const pending = hhRes.households.filter((h) => h.surveyStatus !== 'completed');
          setPendingSurveys(pending.slice(0, 6));
        }
        if (aptRes.success) {
          setUpcomingAppointments(aptRes.appointments.slice(0, 6));
        }
        if (pregRes.success) {
          setMaternalRecords(pregRes.records);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Frontline Worker Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500 text-white tracking-wider flex items-center space-x-1">
              <HeartPulse className="w-3.5 h-3.5" />
              <span>ASHA Grassroots Field Desk</span>
            </span>
            <span className="text-xs text-emerald-200">• Pentapadu Village Sub-Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {user?.fullName} (ASHA Worker)
          </h1>
          <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
            Your field operations cockpit: Conduct doorstep household surveys, track pregnant mothers, schedule antenatal appointments, and share preventive health guidance.
          </p>
        </div>

        {/* Quick Action Buttons for Field Operations */}
        <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
          <Link
            to="/surveys"
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl text-xs shadow-md transition flex items-center space-x-2"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Conduct Doorstep Survey</span>
          </Link>
          <Link
            to="/maternal/register"
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl text-xs shadow-md transition flex items-center space-x-2"
          >
            <Baby className="w-4 h-4" />
            <span>Register Pregnant Mother</span>
          </Link>
        </div>
      </div>

      {/* Field Operations Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-amber-700">
            <span>UNSURVEYED HOUSES</span>
            <ClipboardCheck className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {pendingSurveys.length} Homes
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Due for doorstep visit</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-rose-700">
            <span>PREGNANT MOTHERS</span>
            <Baby className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {maternalRecords.length} Enrolled
          </div>
          <div className="text-[11px] text-rose-600 font-semibold mt-1">
            {maternalRecords.filter(m => m.providerConfirmedHighRisk).length} High-Risk Flagged
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-sky-700">
            <span>UPCOMING ANC VISITS</span>
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {upcomingAppointments.length} Scheduled
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Pentapadu PHC checkups</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-brand-700">
            <span>HYGIENE FOLLOW-UPS</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {stats?.pendingRecommendations || 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Suggestions to share</div>
        </div>
      </div>

      {/* Field Checklist & Immediate Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's ASHA Field Checklist */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <ListTodo className="w-4 h-4 text-emerald-600" />
              <h3 className="font-extrabold text-sm text-slate-900">Today's Field Tasks</h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              {fieldTasks.filter(t => t.done).length} / {fieldTasks.length} Completed
            </span>
          </div>

          <div className="space-y-2.5">
            {fieldTasks.map((task) => (
              <label
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3 rounded-2xl border text-xs flex items-start space-x-2.5 cursor-pointer transition ${
                  task.done
                    ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                    : 'bg-emerald-50/50 border-emerald-200/70 text-slate-800 hover:bg-emerald-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => {}}
                  className="mt-0.5 rounded text-brand-600 focus:ring-brand-500"
                />
                <span className="leading-tight select-none">{task.text}</span>
              </label>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100 text-center">
            Daily tasks updated based on survey gaps and doctor referrals.
          </div>
        </div>

        {/* Doorstep Surveys Queue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Doorstep Survey Queue
              </h3>
              <p className="text-xs text-slate-400">Households awaiting visit</p>
            </div>
            <Link to="/households" className="text-xs font-bold text-brand-600 hover:underline">
              All Homes
            </Link>
          </div>

          <div className="space-y-3">
            {pendingSurveys.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                All households have completed initial surveys!
              </div>
            ) : (
              pendingSurveys.map((hh) => (
                <div
                  key={hh.householdId}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{hh.headOfHousehold}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {hh.householdId} • {hh.street}
                    </div>
                  </div>

                  <Link
                    to={`/surveys/conduct/${hh.householdId}`}
                    className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
                  >
                    Conduct
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Antenatal Checkup Reminders */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Maternal ANC Due Dates
              </h3>
              <p className="text-xs text-slate-400">Pentapadu PHC Schedule</p>
            </div>
            <Link to="/maternal" className="text-xs font-bold text-rose-600 hover:underline">
              Maternal Hub
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingAppointments.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No ANC visits scheduled this week.
              </div>
            ) : (
              upcomingAppointments.map((apt) => (
                <div
                  key={apt.appointmentId}
                  className="p-3 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{apt.beneficiaryName}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {apt.appointmentType} • {new Date(apt.scheduledDate).toLocaleDateString()}
                    </div>
                  </div>

                  <Link
                    to="/maternal"
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center space-x-1"
                  >
                    <span>Record</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
