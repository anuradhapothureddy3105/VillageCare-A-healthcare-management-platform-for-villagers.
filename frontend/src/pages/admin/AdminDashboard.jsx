import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../services/api.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { StatCard } from '../../components/StatCard.jsx';
import {
  Users,
  Home,
  ClipboardCheck,
  Droplets,
  AlertTriangle,
  HeartPulse,
  Bug,
  Trash2,
  Filter,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

export const AdminDashboard = () => {
  const { t, lang } = useLanguage();
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStreet, setSelectedStreet] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const streets = [
    'All',
    'Ramalayam Veedhi',
    'Gandhi Bomma Center',
    'Main Bazaar Road',
    'SC Colony',
    'BC Colony',
    'Canal Bund Road',
    'Subba Rao Peta',
    'ZP High School Road',
    'Rythu Sangham Street',
    'Panchayat Office Road',
  ];

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [statsRes, analyticsRes] = await Promise.all([
        apiFetch('/dashboard/statistics'),
        apiFetch(`/dashboard/survey-analytics?street=${selectedStreet}`),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (analyticsRes.success) setAnalytics(analyticsRes.analytics);
    } catch (err) {
      console.error('[AdminDashboard] Fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedStreet]);

  const COLORS = ['#059669', '#0284c7', '#d97706', '#dc2626', '#8b5cf6'];

  // Formatted chart data
  const handwashingData = analytics
    ? [
        { name: lang === 'te' ? 'ఎల్లప్పుడూ' : 'Always', count: analytics.handwashing.always, fill: '#059669' },
        { name: lang === 'te' ? 'అప్పుడప్పుడు' : 'Sometimes', count: analytics.handwashing.sometimes, fill: '#d97706' },
        { name: lang === 'te' ? 'అరుదుగా' : 'Rarely', count: analytics.handwashing.rarely, fill: '#dc2626' },
      ]
    : [];

  const waterStorageData = analytics
    ? [
        { name: lang === 'te' ? 'మూత ఉన్న పాత్రలు' : 'Covered Containers', value: analytics.waterStorage.covered },
        { name: lang === 'te' ? 'మూత లేనివి' : 'Uncovered (Risk)', value: analytics.waterStorage.uncovered },
      ]
    : [];

  const wasteData = analytics
    ? [
        { name: lang === 'te' ? 'పంచాయతీ బండి' : 'Panchayat Cart', count: analytics.wasteDisposal.panchayat_collection },
        { name: lang === 'te' ? 'కంపోస్ట్ గుంత' : 'Compost Pit', count: analytics.wasteDisposal.compost_pit },
        { name: lang === 'te' ? 'తగలబెట్టుట' : 'Burning', count: analytics.wasteDisposal.burning },
        { name: lang === 'te' ? 'బహిరంగంగా పారవేత' : 'Open Dumping', count: analytics.wasteDisposal.open_dumping },
      ]
    : [];

  const streetComparisonData = analytics?.streetAnalytics || [];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-brand-600 mb-2" />
        <p>{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800 tracking-wider">
              PHC Medical Officer & Village Governance
            </span>
            <span className="text-xs text-slate-400">• Pentapadu Village</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {lang === 'te' ? 'గ్రామ పారిశుధ్య & ఆరోగ్య సమగ్ర నివేదిక' : 'Village Health & Hygiene Analytics'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            High-level epidemiological surveillance, staff oversight, and transparent recommendation engine management.
          </p>
        </div>

        {/* Admin Quick Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/users"
            className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl text-xs border border-purple-200 transition"
          >
            Authorize Health Workers
          </Link>
          <Link
            to="/admin/rules"
            className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl text-xs border border-amber-200 transition"
          >
            Recommendation Rules
          </Link>

          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedStreet}
              onChange={(e) => setSelectedStreet(e.target.value)}
              className="bg-transparent text-slate-700 font-semibold focus:outline-none"
            >
              {streets.map((st) => (
                <option key={st} value={st}>
                  {st === 'All' ? 'All Pentapadu Streets' : st}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchData}
            disabled={refreshing}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title={lang === 'te' ? 'నమోదైన గృహాలు' : 'Total Households'}
          value={stats?.totalHouseholds || 0}
          subtitle="Pentapadu Village Registry"
          icon={Home}
          color="brand"
        />

        <StatCard
          title={lang === 'te' ? 'సర్వే పూర్తయిన ఇళ్లు' : 'Surveyed Households'}
          value={stats?.totalSurveyed || 0}
          subtitle={`${stats?.surveyCompletionRate}% Survey Coverage Rate`}
          icon={ClipboardCheck}
          color="blue"
          badge={`${stats?.surveyCompletionRate}%`}
        />

        <StatCard
          title={lang === 'te' ? 'మొత్తం గ్రామస్థులు' : 'Enrolled Villagers'}
          value={stats?.totalVillagers || 0}
          subtitle={`${stats?.totalHealthWorkers} ASHA / Field Workers`}
          icon={Users}
          color="amber"
        />

        <StatCard
          title={lang === 'te' ? 'పరిష్కరించాల్సిన సూచనలు' : 'Pending Follow-ups'}
          value={stats?.pendingRecommendations || 0}
          subtitle="Awareness suggestions awaiting visit"
          icon={AlertTriangle}
          color="rose"
        />
      </div>

      {/* Chart Section 1: Hygiene & Water Storage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Handwashing Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {lang === 'te' ? 'చేతులు కడుక్కునే అలవాటు (సబ్బుతో)' : 'Handwashing with Soap Compliance'}
              </h3>
              <p className="text-xs text-slate-500">Self-reported frequency during survey</p>
            </div>
            <Droplets className="w-5 h-5 text-brand-600" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={handwashingData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 text-center">
            WHO Benchmark: 100% handwashing with soap cuts gastrointestinal infection incidence by 48%.
          </div>
        </div>

        {/* Water Storage Pie Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {lang === 'te' ? 'తాగునీటి నిల్వ పాత్రల భద్రత' : 'Drinking Water Storage Safety'}
              </h3>
              <p className="text-xs text-slate-500">Covered vs Uncovered storage containers</p>
            </div>
            <Droplets className="w-5 h-5 text-sky-600" />
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={waterStorageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#059669" />
                  <Cell fill="#dc2626" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 text-center">
            Uncovered vessels trigger immediate automated safe water storage guidance.
          </div>
        </div>
      </div>

      {/* Chart Section 2: Waste Disposal & Street Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Waste Disposal Methods */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {lang === 'te' ? 'చెత్త నిర్వహణ పద్ధతులు' : 'Household Waste Disposal Methods'}
              </h3>
              <p className="text-xs text-slate-500">Swachh Bharat Pentapadu Monitoring</p>
            </div>
            <Trash2 className="w-5 h-5 text-brand-700" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wasteData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#0284c7" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Street-wise Survey Coverage */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {lang === 'te' ? 'వీధుల వారీగా సర్వే ప్రగతి' : 'Street-Wise Survey Coverage'}
              </h3>
              <p className="text-xs text-slate-500">Registered vs Completed surveys</p>
            </div>
            <Home className="w-5 h-5 text-brand-600" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={streetComparisonData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="street" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" height={45} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="registered" name="Registered" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="surveyed" name="Surveyed" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Maternal Aggregated Summary Banner (Strictly Anonymized) */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-emerald-800/80 px-2.5 py-1 rounded-full">
            Maternal Health Summary (Anonymized Aggregate)
          </span>
          <h3 className="text-xl font-bold mt-2">
            Pentapadu Antenatal Care Coverage Status
          </h3>
          <p className="text-xs text-emerald-200 max-w-xl mt-1">
            Confidential medical details are restricted. Aggregates indicate {stats?.maternalHealth?.activePregnancies || 0} active pregnancies enrolled, with {stats?.maternalHealth?.highRiskPregnancies || 0} flagged for doctor consultation.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-center px-4 py-2 bg-white/10 rounded-2xl backdrop-blur-sm">
            <div className="text-2xl font-black text-amber-400">
              {stats?.maternalHealth?.upcomingAppointments || 0}
            </div>
            <div className="text-[10px] text-emerald-100 uppercase font-semibold">
              Upcoming ANC Visits
            </div>
          </div>

          <div className="text-center px-4 py-2 bg-white/10 rounded-2xl backdrop-blur-sm">
            <div className="text-2xl font-black text-emerald-300">
              {stats?.maternalHealth?.totalBeneficiaries || 0}
            </div>
            <div className="text-[10px] text-emerald-100 uppercase font-semibold">
              Enrolled Mothers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
