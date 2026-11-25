import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Heart,
  Droplets,
  ShieldCheck,
  Sparkles,
  Users,
  Activity,
  ArrowRight,
  MapPin,
  ClipboardCheck,
  CheckCircle,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';

export const LandingPage = () => {
  const { t, lang } = useLanguage();
  const { user, quickSwitchRole } = useAuth();

  const features = [
    {
      icon: ClipboardCheck,
      title: t('feature1Title'),
      desc: t('feature1Desc'),
      color: 'bg-emerald-50 text-brand-700',
    },
    {
      icon: Sparkles,
      title: t('feature2Title'),
      desc: t('feature2Desc'),
      color: 'bg-sky-50 text-sky-700',
    },
    {
      icon: Heart,
      title: t('feature3Title'),
      desc: t('feature3Desc'),
      color: 'bg-rose-50 text-rose-700',
    },
    {
      icon: Activity,
      title: t('feature4Title'),
      desc: t('feature4Desc'),
      color: 'bg-amber-50 text-amber-700',
    },
  ];

  const steps = [
    {
      num: '01',
      title: lang === 'te' ? 'ఇంటింటి సర్వే నమోదు' : 'Household Doorstep Survey',
      desc: lang === 'te' ? 'ఆశా కార్యకర్త తాగునీరు, పారిశుధ్యం మరియు దోమల నివారణ పరిస్థితులను డిజిటల్ సర్వే చేస్తారు.' : 'ASHA workers record water storage, sanitation, and hygiene conditions using digital assessment forms.',
    },
    {
      num: '02',
      title: lang === 'te' ? 'స్మార్ట్ విశ్లేషణ ఇంజిన్' : 'Rule-Based Engine Analysis',
      desc: lang === 'te' ? 'సర్వే వివరాలను విశ్లేషించి కుటుంబానికి అవసరమైన పరిశుభ్రత అలవాట్ల సూచనలను నిబంధనల ప్రకారం రూపొందిస్తుంది.' : 'Identifies hygiene gaps and generates personalized, non-diagnostic educational guidance in Telugu and English.',
    },
    {
      num: '03',
      title: lang === 'te' ? 'మాతృత్వ & గర్భిణీల సంరక్షణ' : 'Confidential Maternal Care',
      desc: lang === 'te' ? 'సమ్మతితో గర్భిణీల వివరాలను భద్రపరిచి, సకాలంలో 4 ANC తనిఖీలు మరియు PMSMA క్లినిక్ రిమైండర్లు అందిస్తుంది.' : 'Securely tracks antenatal checkups, high-risk flags, and PMSMA specialist visits with explicit consent.',
    },
    {
      num: '04',
      title: lang === 'te' ? 'గ్రామస్థాయి మార్పు & నిర్ణయాలు' : 'Village-Level Public Health Action',
      desc: lang === 'te' ? 'పెంటపాడు PHC మెడికల్ ఆఫీసర్ గ్రామ నివేదికల ఆధారంగా క్లోరినేషన్, పారిశుధ్య కార్యక్రమాలను వేగవంతం చేస్తారు.' : 'Anonymized analytics assist medical officers and panchayat leaders in targeted sanitation drives.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-slate-50 pt-12 pb-20 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-brand-100/70 text-brand-800 text-xs font-bold border border-brand-200">
              <MapPin className="w-3.5 h-3.5 text-brand-700" />
              <span>{t('targetVillage')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              {t('heroTitle')}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/awareness"
                className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-lg shadow-brand-600/25 flex items-center space-x-2 transition hover:-translate-y-0.5"
              >
                <span>{t('exploreAwareness')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {user ? (
                <Link
                  to={user.role === 'admin' ? '/admin' : user.role === 'health_worker' ? '/health-worker' : '/villager'}
                  className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl border border-slate-300 shadow-sm flex items-center space-x-2 transition"
                >
                  <span>{t('getStarted')}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl border border-slate-300 shadow-sm flex items-center space-x-2 transition"
                >
                  <span>{t('getStarted')}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Fictional Demo Login Quick Access */}
            <div className="pt-8 border-t border-slate-200/60 max-w-lg mx-auto">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Quick Demo Role Selector (Pentapadu Village)
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => quickSwitchRole('admin')}
                  className="p-2.5 bg-white border border-slate-200 hover:border-brand-500 rounded-xl text-left text-xs transition shadow-sm hover:shadow"
                >
                  <div className="font-bold text-slate-800">Admin</div>
                  <div className="text-[10px] text-slate-500">PHC Medical Officer</div>
                </button>
                <button
                  onClick={() => quickSwitchRole('health_worker')}
                  className="p-2.5 bg-white border border-slate-200 hover:border-brand-500 rounded-xl text-left text-xs transition shadow-sm hover:shadow"
                >
                  <div className="font-bold text-slate-800">ASHA Worker</div>
                  <div className="text-[10px] text-slate-500">Field Health Worker</div>
                </button>
                <button
                  onClick={() => quickSwitchRole('villager')}
                  className="p-2.5 bg-white border border-slate-200 hover:border-brand-500 rounded-xl text-left text-xs transition shadow-sm hover:shadow"
                >
                  <div className="font-bold text-slate-800">Villager</div>
                  <div className="text-[10px] text-slate-500">Enrolled Resident</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Smart Healthcare Pillars
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            {lang === 'te' ? 'గ్రామీణ ఆరోగ్య పరివర్తన విభాగాలు' : 'Engineered for Rural Public Health Needs'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${f.color} mb-4`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">{f.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How VillageCare Works (Timeline / Steps) */}
      <section className="bg-emerald-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              {t('howItWorks')}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 mt-2">
              {t('howItWorksSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((st, i) => (
              <div key={i} className="bg-emerald-800/60 border border-emerald-700/60 rounded-2xl p-6 relative">
                <span className="text-2xl font-black text-amber-400 block mb-2">
                  {st.num}
                </span>
                <h4 className="font-bold text-sm text-white mb-2">{st.title}</h4>
                <p className="text-xs text-emerald-100 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Service Project Focus & Pentapadu Impact */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-50 to-sky-50 rounded-3xl p-8 sm:p-12 border border-brand-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-bold text-brand-700 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-brand-200">
              Community Service Project
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              {t('communityImpact')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Based on ground-level observations in Pentapadu Village, lack of proper drinking water storage and open drainage waste disposal were directly contributing to recurrent seasonal fevers. VillageCare addresses this gap by replacing forgotten paper checklists with instant, culturally appropriate Telugu recommendations.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-700 pt-2">
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-brand-600" />
                <span>20 Pentapadu Streets Mapped</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-brand-600" />
                <span>100% Non-Diagnostic & Safe</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-brand-600" />
                <span>DPDP Act 2023 Consent Safeguards</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 w-full lg:w-auto">
            <Link
              to="/awareness"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg transition"
            >
              <span>{t('exploreAwareness')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
