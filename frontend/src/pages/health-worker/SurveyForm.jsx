import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../services/api.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import {
  ClipboardCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Save,
  AlertCircle,
  Sparkles,
  Droplets,
  Home,
  Trash2,
  Heart,
  Bug,
  Info,
} from 'lucide-react';

export const SurveyForm = () => {
  const { householdId: paramHhId } = useParams();
  const navigate = useNavigate();
  const { t, lang, tContent } = useLanguage();

  const [activeStep, setActiveStep] = useState(0);
  const [householdId, setHouseholdId] = useState(paramHhId || '');
  const [households, setHouseholds] = useState([]);
  const [selectedHousehold, setSelectedHousehold] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [generatedRecs, setGeneratedRecs] = useState(null);

  // Form State initialized with defaults
  const [formData, setFormData] = useState({
    // Section A
    familyMembersCount: 4,
    childrenCount: 1,
    elderlyCount: 1,
    existingConditionsDisclosed: 'None',
    // Section B
    regularHandwashingWithSoap: 'sometimes',
    handwashBeforeEating: true,
    handwashAfterToilet: true,
    basicHygieneFollowed: true,
    // Section C
    mainSource: 'public_tap',
    storedInCoveredContainer: true,
    containerCleanedRegularly: true,
    waterTreatedIfUncertain: false,
    treatmentMethod: 'boiling',
    // Section D
    toiletAvailability: 'individual_household',
    wasteDisposalMethod: 'panchayat_collection',
    wetDrySegregation: false,
    wasteAccumulationNearHouse: false,
    drainageCondition: 'open_drain',
    // Section E
    askedWithConsent: true,
    safeAwareness: 'moderate',
    accessToCleanMaterials: true,
    safeDisposalAwareness: true,
    menstrualNotes: '',
    // Section F
    stagnantWaterNearHouse: false,
    waterInContainersDiscarded: true,
    drainCleanliness: 'moderate',
    mosquitoNetsOrProtectionUsed: true,
  });

  // Fetch household info
  useEffect(() => {
    const fetchHouseholdList = async () => {
      try {
        const res = await apiFetch('/households');
        if (res.success) {
          setHouseholds(res.households);
          if (paramHhId) {
            const current = res.households.find((h) => h.householdId === paramHhId);
            if (current) {
              setSelectedHousehold(current);
              setFormData((prev) => ({
                ...prev,
                familyMembersCount: current.totalMembers || 4,
                childrenCount: current.ageGroups?.children || 0,
                elderlyCount: current.ageGroups?.elderly || 0,
              }));
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchHouseholdList();
  }, [paramHhId]);

  // If household already has a survey, pre-fill it!
  useEffect(() => {
    if (!householdId) return;
    const fetchExistingSurvey = async () => {
      try {
        const res = await apiFetch(`/surveys?householdId=${householdId}`);
        if (res.success && res.surveys && res.surveys.length > 0) {
          const s = res.surveys[0];
          setFormData({
            familyMembersCount: s.sectionA_general?.familyMembersCount ?? 4,
            childrenCount: s.sectionA_general?.childrenCount ?? 1,
            elderlyCount: s.sectionA_general?.elderlyCount ?? 1,
            existingConditionsDisclosed: s.sectionA_general?.existingConditionsDisclosed ?? 'None',

            regularHandwashingWithSoap: s.sectionB_hygiene?.regularHandwashingWithSoap ?? 'sometimes',
            handwashBeforeEating: s.sectionB_hygiene?.handwashBeforeEating ?? true,
            handwashAfterToilet: s.sectionB_hygiene?.handwashAfterToilet ?? true,
            basicHygieneFollowed: s.sectionB_hygiene?.basicHygieneFollowed ?? true,

            mainSource: s.sectionC_water?.mainSource ?? 'public_tap',
            storedInCoveredContainer: s.sectionC_water?.storedInCoveredContainer ?? true,
            containerCleanedRegularly: s.sectionC_water?.containerCleanedRegularly ?? true,
            waterTreatedIfUncertain: s.sectionC_water?.waterTreatedIfUncertain ?? false,
            treatmentMethod: s.sectionC_water?.treatmentMethod ?? 'boiling',

            toiletAvailability: s.sectionD_sanitation?.toiletAvailability ?? 'individual_household',
            wasteDisposalMethod: s.sectionD_sanitation?.wasteDisposalMethod ?? 'panchayat_collection',
            wetDrySegregation: s.sectionD_sanitation?.wetDrySegregation ?? false,
            wasteAccumulationNearHouse: s.sectionD_sanitation?.wasteAccumulationNearHouse ?? false,
            drainageCondition: s.sectionD_sanitation?.drainageCondition ?? 'open_drain',

            askedWithConsent: s.sectionE_menstrual?.askedWithConsent ?? true,
            safeAwareness: s.sectionE_menstrual?.safeAwareness ?? 'moderate',
            accessToCleanMaterials: s.sectionE_menstrual?.accessToCleanMaterials ?? true,
            safeDisposalAwareness: s.sectionE_menstrual?.safeDisposalAwareness ?? true,
            menstrualNotes: s.sectionE_menstrual?.notes ?? '',

            stagnantWaterNearHouse: s.sectionF_mosquito?.stagnantWaterNearHouse ?? false,
            waterInContainersDiscarded: s.sectionF_mosquito?.waterInContainersDiscarded ?? true,
            drainCleanliness: s.sectionF_mosquito?.drainCleanliness ?? 'moderate',
            mosquitoNetsOrProtectionUsed: s.sectionF_mosquito?.mosquitoNetsOrProtectionUsed ?? true,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchExistingSurvey();
  }, [householdId]);

  const steps = [
    { id: 'A', name: t('sectionA'), icon: Info },
    { id: 'B', name: t('sectionB'), icon: Sparkles },
    { id: 'C', name: t('sectionC'), icon: Droplets },
    { id: 'D', name: t('sectionD'), icon: Home },
    { id: 'E', name: t('sectionE'), icon: Heart },
    { id: 'F', name: t('sectionF'), icon: Bug },
  ];

  const handleHouseholdChange = (e) => {
    const val = e.target.value;
    setHouseholdId(val);
    const found = households.find((h) => h.householdId === val);
    setSelectedHousehold(found || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!householdId) {
      alert('Please select or specify a Household ID.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        householdId,
        sectionA_general: {
          familyMembersCount: Number(formData.familyMembersCount),
          childrenCount: Number(formData.childrenCount),
          elderlyCount: Number(formData.elderlyCount),
          generalHealthConcerns: [],
          existingConditionsDisclosed: formData.existingConditionsDisclosed,
        },
        sectionB_hygiene: {
          regularHandwashingWithSoap: formData.regularHandwashingWithSoap,
          handwashBeforeEating: Boolean(formData.handwashBeforeEating),
          handwashAfterToilet: Boolean(formData.handwashAfterToilet),
          basicHygieneFollowed: Boolean(formData.basicHygieneFollowed),
        },
        sectionC_water: {
          mainSource: formData.mainSource,
          storedInCoveredContainer: Boolean(formData.storedInCoveredContainer),
          containerCleanedRegularly: Boolean(formData.containerCleanedRegularly),
          waterTreatedIfUncertain: Boolean(formData.waterTreatedIfUncertain),
          treatmentMethod: formData.treatmentMethod,
        },
        sectionD_sanitation: {
          toiletAvailability: formData.toiletAvailability,
          wasteDisposalMethod: formData.wasteDisposalMethod,
          wetDrySegregation: Boolean(formData.wetDrySegregation),
          wasteAccumulationNearHouse: Boolean(formData.wasteAccumulationNearHouse),
          drainageCondition: formData.drainageCondition,
        },
        sectionE_menstrual: {
          askedWithConsent: Boolean(formData.askedWithConsent),
          safeAwareness: formData.safeAwareness,
          accessToCleanMaterials: Boolean(formData.accessToCleanMaterials),
          safeDisposalAwareness: Boolean(formData.safeDisposalAwareness),
          notes: formData.menstrualNotes,
        },
        sectionF_mosquito: {
          stagnantWaterNearHouse: Boolean(formData.stagnantWaterNearHouse),
          waterInContainersDiscarded: Boolean(formData.waterInContainersDiscarded),
          drainCleanliness: formData.drainCleanliness,
          mosquitoNetsOrProtectionUsed: Boolean(formData.mosquitoNetsOrProtectionUsed),
        },
        completionStatus: 'completed',
      };

      const res = await apiFetch('/surveys', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.success) {
        setGeneratedRecs(res.recommendations || []);
      }
    } catch (err) {
      alert('Survey submission failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
            Field Assessment Portal
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            {t('surveyTitle')}
          </h1>
          <p className="text-xs text-slate-500">
            Pentapadu Mandal • Digital Doorstep Health & Hygiene Evaluation
          </p>
        </div>

        {/* Household selector */}
        <div className="w-full sm:w-64">
          <label className="block text-[11px] font-bold text-slate-600 mb-1">
            Target Household
          </label>
          <select
            value={householdId}
            onChange={handleHouseholdChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
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

      {selectedHousehold && (
        <div className="bg-brand-50/70 border border-brand-200/80 rounded-2xl p-4 text-xs flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-slate-500">Head of Household: </span>
            <span className="font-bold text-slate-900">{selectedHousehold.headOfHousehold}</span>
          </div>
          <div>
            <span className="text-slate-500">Street: </span>
            <span className="font-bold text-slate-900">{selectedHousehold.street}</span>
          </div>
          <div>
            <span className="text-slate-500">Family Members: </span>
            <span className="font-bold text-slate-900">{selectedHousehold.totalMembers}</span>
          </div>
        </div>
      )}

      {/* Multi-step progress tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 bg-white rounded-2xl shadow-sm p-1.5 gap-1">
        {steps.map((st, idx) => (
          <button
            key={st.id}
            onClick={() => setActiveStep(idx)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeStep === idx
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>{st.id}</span>
            <span className="hidden sm:inline">{st.name.split(':')[1] || st.name}</span>
          </button>
        ))}
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION A */}
          {activeStep === 0 && (
            <div className="space-y-5 animate-in fade-in">
              <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center space-x-2">
                <Info className="w-5 h-5 text-brand-600" />
                <span>{t('sectionA')}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'te' ? 'మొత్తం కుటుంబ సభ్యులు' : 'Total Family Members'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.familyMembersCount}
                    onChange={(e) => setFormData({ ...formData, familyMembersCount: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'te' ? 'పిల్లలు (<10 సం)' : 'Children (<10 yrs)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.childrenCount}
                    onChange={(e) => setFormData({ ...formData, childrenCount: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'te' ? 'వృద్ధులు (60+ సం)' : 'Elderly Members (60+)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.elderlyCount}
                    onChange={(e) => setFormData({ ...formData, elderlyCount: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'te' ? 'స్వచ్ఛందంగా తెలిపిన అనారోగ్య సమస్యలు' : 'Existing Health Concerns (Voluntarily Disclosed)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Joint pain in elderly, or None"
                  value={formData.existingConditionsDisclosed}
                  onChange={(e) => setFormData({ ...formData, existingConditionsDisclosed: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Non-diagnostic: Used solely to provide PHC medical consultation guidance if needed.
                </span>
              </div>
            </div>
          )}

          {/* SECTION B */}
          {activeStep === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-brand-600" />
                <span>{t('sectionB')}</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {lang === 'te' ? 'కుటుంబ సభ్యులు సబ్బుతో క్రమం తప్పకుండా చేతులు కడుగుతారా?' : 'Do family members regularly wash hands with soap?'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['always', 'sometimes', 'rarely'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData({ ...formData, regularHandwashingWithSoap: opt })}
                      className={`p-3 rounded-xl border text-xs font-bold capitalize transition ${
                        formData.regularHandwashingWithSoap === opt
                          ? 'bg-brand-50 border-brand-600 text-brand-800'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.handwashBeforeEating}
                    onChange={(e) => setFormData({ ...formData, handwashBeforeEating: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                  />
                  <span className="text-xs text-slate-800">
                    {lang === 'te' ? 'భోజనానికి ముందు చేతులు కడుగుతారు' : 'Wash hands with water and soap before eating food'}
                  </span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.handwashAfterToilet}
                    onChange={(e) => setFormData({ ...formData, handwashAfterToilet: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                  />
                  <span className="text-xs text-slate-800">
                    {lang === 'te' ? 'మరుగుదొడ్డి ఉపయోగించిన తర్వాత సబ్బుతో కడుగుతారు' : 'Wash hands with soap after using the latrine'}
                  </span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.basicHygieneFollowed}
                    onChange={(e) => setFormData({ ...formData, basicHygieneFollowed: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                  />
                  <span className="text-xs text-slate-800">
                    {lang === 'te' ? 'రోజువారీ స్నానం & పాదరక్షల వాడకం పాటిస్తారు' : 'Basic hygiene followed (Daily bathing, nail trimming, slippers)'}
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* SECTION C */}
          {activeStep === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center space-x-2">
                <Droplets className="w-5 h-5 text-sky-600" />
                <span>{t('sectionC')}</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'te' ? 'ప్రధాన తాగునీటి వనరు' : 'Main Source of Drinking Water'}
                </label>
                <select
                  value={formData.mainSource}
                  onChange={(e) => setFormData({ ...formData, mainSource: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="piped_tap">Piped Tap Water (Grama Panchayat)</option>
                  <option value="public_tap">Public Community Tap</option>
                  <option value="borewell">Deep Borewell</option>
                  <option value="packaged_water">RO / Packaged Water Plant</option>
                  <option value="canals_open">Canal / Open Water</option>
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.storedInCoveredContainer}
                    onChange={(e) => setFormData({ ...formData, storedInCoveredContainer: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                  />
                  <span className="text-xs text-slate-800">
                    {lang === 'te' ? 'తాగునీటి పాత్రలపై ఎల్లప్పుడూ మూత ఉంటుంది' : 'Drinking water is stored in tightly covered containers'}
                  </span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.containerCleanedRegularly}
                    onChange={(e) => setFormData({ ...formData, containerCleanedRegularly: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                  />
                  <span className="text-xs text-slate-800">
                    {lang === 'te' ? 'నీటి పాత్రలను ప్రతిరోజూ శుభ్రం చేస్తారు' : 'Storage containers are scrubbed and cleaned daily'}
                  </span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.waterTreatedIfUncertain}
                    onChange={(e) => setFormData({ ...formData, waterTreatedIfUncertain: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                  />
                  <span className="text-xs text-slate-800">
                    {lang === 'te' ? 'నీరు కలుషితమైనట్లు అనుమానం ఉన్నప్పుడు మరిగిస్తారు / శుద్ధి చేస్తారు' : 'Water is boiled or disinfected if quality is doubtful'}
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* SECTION D */}
          {activeStep === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center space-x-2">
                <Home className="w-5 h-5 text-brand-700" />
                <span>{t('sectionD')}</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'te' ? 'మరుగుదొడ్డి లభ్యత' : 'Toilet Availability'}
                </label>
                <select
                  value={formData.toiletAvailability}
                  onChange={(e) => setFormData({ ...formData, toiletAvailability: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="individual_household">Individual Household Latrine (IHHL)</option>
                  <option value="community_toilet">Community Sanitation Complex</option>
                  <option value="open_defecation">Open Defecation (Needs immediate Swachh intervention)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'te' ? 'ఇంటి చెత్త పారవేసే విధానం' : 'Waste Disposal Method'}
                </label>
                <select
                  value={formData.wasteDisposalMethod}
                  onChange={(e) => setFormData({ ...formData, wasteDisposalMethod: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="panchayat_collection">Grama Panchayat Sanitation Cart Collection</option>
                  <option value="compost_pit">Backyard Compost Pit</option>
                  <option value="burning">Burning (Plastic/Leaves)</option>
                  <option value="open_dumping">Open Dumping along Roadside</option>
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.wetDrySegregation}
                    onChange={(e) => setFormData({ ...formData, wetDrySegregation: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                  />
                  <span className="text-xs text-slate-800">
                    {lang === 'te' ? 'తడి మరియు పొడి చెత్తను వేరుచేసి ఇస్తారు' : 'Wet and dry waste are segregated at source'}
                  </span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.wasteAccumulationNearHouse}
                    onChange={(e) => setFormData({ ...formData, wasteAccumulationNearHouse: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                  />
                  <span className="text-xs text-slate-800">
                    {lang === 'te' ? 'ఇంటి సమీపంలో చెత్త కుప్పలు పేరుకుపోతున్నాయి' : 'Waste accumulation observed near house perimeter'}
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* SECTION E */}
          {activeStep === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-rose-600" />
                  <span>{t('sectionE')}</span>
                </h3>
                <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  Voluntary & Private
                </span>
              </div>

              <div className="p-3 bg-purple-50/50 rounded-xl text-xs text-purple-900">
                Notice: Questions are asked with sensitivity, in private and only where consented by women in the household.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {lang === 'te' ? 'సురక్షిత ఋతుస్రావ పరిశుభ్రతపై అవగాహన స్థాయి' : 'Safe Menstrual Hygiene Awareness Level'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'good', label: 'Good' },
                    { id: 'moderate', label: 'Moderate' },
                    { id: 'needs_improvement', label: 'Needs Support' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, safeAwareness: lvl.id })}
                      className={`p-3 rounded-xl border text-xs font-bold transition ${
                        formData.safeAwareness === lvl.id
                          ? 'bg-rose-50 border-rose-500 text-rose-800'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.accessToCleanMaterials}
                    onChange={(e) => setFormData({ ...formData, accessToCleanMaterials: e.target.checked })}
                    className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <span className="text-xs text-slate-800">
                    {lang === 'te' ? 'శుభ్రమైన శానిటరీ నాప్‌కిన్లు లేదా వస్త్రాలు అందుబాటులో ఉన్నాయి' : 'Access to clean sanitary materials or subsidized napkins'}
                  </span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.safeDisposalAwareness}
                    onChange={(e) => setFormData({ ...formData, safeDisposalAwareness: e.target.checked })}
                    className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <span className="text-xs text-slate-800">
                    {lang === 'te' ? 'కాగితంలో చుట్టి సురక్షితంగా పారవేసే పద్ధతి తెలుసు' : 'Awareness of wrapping and disposing in bins (never flushing)'}
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* SECTION F */}
          {activeStep === 5 && (
            <div className="space-y-5 animate-in fade-in">
              <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center space-x-2">
                <Bug className="w-5 h-5 text-amber-600" />
                <span>{t('sectionF')}</span>
              </h3>

              <div className="space-y-3 pt-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.stagnantWaterNearHouse}
                    onChange={(e) => setFormData({ ...formData, stagnantWaterNearHouse: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span className="text-xs text-slate-800">
                    {lang === 'te' ? 'ఇంటి పరిసరాల్లో నిల్వ నీరు / గుంటలు ఉన్నాయి (దోమల ప్రమాదం)' : 'Stagnant water puddles or containers present near house'}
                  </span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.waterInContainersDiscarded}
                    onChange={(e) => setFormData({ ...formData, waterInContainersDiscarded: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span className="text-xs text-slate-800">
                    {lang === 'te' ? 'కూలర్లు, తొట్లలోని నీటిని వారానికొకసారి తొలగిస్తారు (డ్రై డే)' : 'Discard water in coolers, pots weekly (Weekly Dry Day practice)'}
                  </span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.mosquitoNetsOrProtectionUsed}
                    onChange={(e) => setFormData({ ...formData, mosquitoNetsOrProtectionUsed: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span className="text-xs text-slate-800">
                    {lang === 'te' ? 'రాత్రి వేళల్లో దోమతెరలు లేదా రక్షణ పద్ధతులు వాడతారు' : 'Bed nets or repellent protection used regularly, especially by kids'}
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            {activeStep > 0 ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('prevSection')}</span>
              </button>
            ) : <div></div>}

            {activeStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md shadow-brand-600/20 transition"
              >
                <span>{t('nextSection')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-lg shadow-brand-600/25 transition"
              >
                <Save className="w-4 h-4" />
                <span>{submitting ? 'Generating Recommendations...' : t('submitSurvey')}</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Generated Recommendations Modal */}
      {generatedRecs && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 space-y-6">
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-brand-700 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {lang === 'te' ? 'సర్వే పూర్తయింది! అవగాహన సూచనలు సిద్ధమయ్యాయి' : 'Survey Submitted & Recommendations Generated'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Personalized preventive health suggestions tailored for {householdId}
              </p>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {generatedRecs.length === 0 ? (
                <div className="p-4 bg-emerald-50 rounded-2xl text-xs text-emerald-800 text-center">
                  Excellent! Household adheres to verified hygiene and drinking water protocols. No immediate gaps flagged.
                </div>
              ) : (
                generatedRecs.map((rec, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        {tContent(rec.title)}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                        {rec.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {tContent(rec.description)}
                    </p>

                    <div className="text-[11px] text-brand-800 bg-brand-50 p-2.5 rounded-xl border border-brand-100">
                      <strong>Reason: </strong> {tContent(rec.reason)}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
              <button
                onClick={() => navigate('/households')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Return to Households
              </button>
              <button
                onClick={() => setGeneratedRecs(null)}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold"
              >
                Close & Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
