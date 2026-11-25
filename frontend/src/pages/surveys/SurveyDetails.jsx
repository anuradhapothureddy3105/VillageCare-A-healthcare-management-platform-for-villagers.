import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../../services/api.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Droplets,
  Home,
  Heart,
  Bug,
  Printer,
  ArrowLeft,
  UserCheck,
  Share2,
} from 'lucide-react';

export const SurveyDetails = () => {
  const { id } = useParams(); // can be householdId or surveyId
  const navigate = useNavigate();
  const { t, lang, tContent } = useLanguage();
  const { isAdmin, isHealthWorker } = useAuth();

  const [survey, setSurvey] = useState(null);
  const [household, setHousehold] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSurveyData = async () => {
    try {
      setLoading(true);
      // Try fetching by survey ID or household ID
      let res = await apiFetch(`/surveys/${id}`).catch(() => null);
      if (!res || !res.success) {
        const listRes = await apiFetch(`/surveys?householdId=${id}`);
        if (listRes.success && listRes.surveys && listRes.surveys.length > 0) {
          const s = listRes.surveys[0];
          res = await apiFetch(`/surveys/${s.surveyId}`);
        }
      }

      if (res && res.success) {
        setSurvey(res.survey);
        setHousehold(res.household);
        setRecommendations(res.recommendations || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveyData();
  }, [id]);

  const handleUpdateRecStatus = async (recId, newStatus) => {
    try {
      const res = await apiFetch(`/recommendations/${recId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.success) {
        setRecommendations((prev) =>
          prev.map((r) =>
            r.recommendationId === recId || r._id === recId ? res.recommendation : r
          )
        );
      }
    } catch (err) {
      alert('Failed to update recommendation status: ' + err.message);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-slate-400">Loading survey details...</div>;
  }

  if (!survey) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h3 className="text-base font-bold text-slate-800">Survey Record Not Found</h3>
        <p className="text-xs text-slate-500">
          No survey has been conducted yet for ID: {id}
        </p>
        <Link
          to={`/surveys/conduct/${id}`}
          className="inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
        >
          Conduct Doorstep Survey Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-700 uppercase tracking-wider">
            <ClipboardCheck className="w-4 h-4" />
            <span>Survey Report: {survey.surveyId}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {household?.headOfHousehold} ({survey.householdId})
          </h1>
          <p className="text-xs text-slate-500">
            {household?.street}, Pentapadu • Surveyed by {survey.surveyedBy} on {new Date(survey.surveyDate).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Recommendations Action Panel */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-black text-base text-slate-900">
              {lang === 'te' ? 'జనరేట్ అయిన అవగాహన సూచనలు' : 'Rule-Generated Preventive Recommendations'}
            </h3>
            <p className="text-xs text-slate-500">
              Field health workers can mark recommendations as shared with family or followed up
            </p>
          </div>
          <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full">
            {recommendations.length} Active Items
          </span>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.recommendationId}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-sm text-slate-900">
                    {tContent(rec.title)}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                    {rec.category}
                  </span>
                </div>

                {/* Status Switcher for Health Worker */}
                {(isAdmin || isHealthWorker) && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleUpdateRecStatus(rec.recommendationId, 'shared')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                        rec.status === 'shared'
                          ? 'bg-sky-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-sky-50'
                      }`}
                    >
                      Shared
                    </button>
                    <button
                      onClick={() => handleUpdateRecStatus(rec.recommendationId, 'followed_up')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                        rec.status === 'followed_up'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50'
                      }`}
                    >
                      Followed Up
                    </button>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {tContent(rec.description)}
              </p>

              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900">
                <strong>Why Suggested: </strong>
                {tContent(rec.reason)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Survey Findings Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <h4 className="font-bold text-slate-900 flex items-center space-x-2">
            <Droplets className="w-4 h-4 text-sky-600" />
            <span>Drinking Water Practices</span>
          </h4>
          <div className="text-slate-600 space-y-1">
            <div>Main Source: <strong>{survey.sectionC_water?.mainSource}</strong></div>
            <div>Covered Storage: <strong>{survey.sectionC_water?.storedInCoveredContainer ? 'Yes' : 'No (Uncovered)'}</strong></div>
            <div>Treated when uncertain: <strong>{survey.sectionC_water?.waterTreatedIfUncertain ? 'Yes' : 'No'}</strong></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <h4 className="font-bold text-slate-900 flex items-center space-x-2">
            <Home className="w-4 h-4 text-brand-700" />
            <span>Sanitation & Waste</span>
          </h4>
          <div className="text-slate-600 space-y-1">
            <div>Toilet: <strong>{survey.sectionD_sanitation?.toiletAvailability}</strong></div>
            <div>Disposal: <strong>{survey.sectionD_sanitation?.wasteDisposalMethod}</strong></div>
            <div>Wet/Dry Segregation: <strong>{survey.sectionD_sanitation?.wetDrySegregation ? 'Yes' : 'No'}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
