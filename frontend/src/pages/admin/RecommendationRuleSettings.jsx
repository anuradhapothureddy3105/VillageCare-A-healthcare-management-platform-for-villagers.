import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import {
  Sparkles,
  ShieldCheck,
  Edit,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Info,
  Save,
  X,
} from 'lucide-react';

export const RecommendationRuleSettings = () => {
  const { lang, tContent } = useLanguage();
  const [rules, setRules] = useState([]);
  const [principles, setPrinciples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRule, setEditingRule] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchRules = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/recommendations/rules');
      if (res.success) {
        setRules(res.rules || []);
        setPrinciples(res.governingPrinciples || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleSaveRule = async (e) => {
    e.preventDefault();
    if (!editingRule) return;

    const updatedRules = rules.map((r) => (r.id === editingRule.id ? editingRule : r));

    try {
      const res = await apiFetch('/recommendations/rules', {
        method: 'PUT',
        body: JSON.stringify({ rules: updatedRules }),
      });

      if (res.success) {
        setRules(res.rules);
        setEditingRule(null);
        setSuccessMsg('Recommendation rule updated successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      alert('Failed to update rule: ' + err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-700 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>VillageCare Core Decision Logic</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            {lang === 'te' ? 'అవగాహన నిబంధనల ఇంజిన్ సెట్టింగ్‌లు' : 'Transparent Recommendation Rules Engine'}
          </h1>
          <p className="text-xs text-slate-500">
            Rule-based engine configuration for Pentapadu doorstep surveys. Strictly non-diagnostic and educational.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Governing Principles Card */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 text-xs text-emerald-950 space-y-2">
        <div className="font-extrabold flex items-center space-x-2 text-sm text-emerald-900">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Governing Public Health Principles</span>
        </div>
        <ul className="list-disc pl-5 space-y-1 text-emerald-900">
          {principles.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>

      {/* Rule Cards List */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Active Survey Evaluation Rules ({rules.length})</h3>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading rules...</div>
        ) : (
          <div className="space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                      {rule.id}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Condition: {rule.conditionField} {rule.operator} {JSON.stringify(rule.conditionValue)}
                    </span>
                  </div>

                  <button
                    onClick={() => setEditingRule({ ...rule })}
                    className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition"
                    title="Edit Rule Content"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    {rule.title?.en}
                  </h4>
                  <div className="text-xs text-slate-600 mt-0.5 font-medium">
                    {rule.title?.te}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {rule.description?.en}
                </p>

                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700">
                  <span className="font-bold text-slate-900">Trigger Reason: </span>
                  {rule.reason?.en} ({rule.reason?.te})
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Rule Modal */}
      {editingRule && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Edit Rule: {editingRule.id}
              </h3>
              <button
                onClick={() => setEditingRule(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title (English)</label>
                <input
                  type="text"
                  required
                  value={editingRule.title?.en || ''}
                  onChange={(e) =>
                    setEditingRule({
                      ...editingRule,
                      title: { ...editingRule.title, en: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Title (Telugu)</label>
                <input
                  type="text"
                  required
                  value={editingRule.title?.te || ''}
                  onChange={(e) =>
                    setEditingRule({
                      ...editingRule,
                      title: { ...editingRule.title, te: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description (English)</label>
                <textarea
                  rows="2"
                  required
                  value={editingRule.description?.en || ''}
                  onChange={(e) =>
                    setEditingRule({
                      ...editingRule,
                      description: { ...editingRule.description, en: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description (Telugu)</label>
                <textarea
                  rows="2"
                  required
                  value={editingRule.description?.te || ''}
                  onChange={(e) =>
                    setEditingRule({
                      ...editingRule,
                      description: { ...editingRule.description, te: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Trigger Reason (English)</label>
                <input
                  type="text"
                  required
                  value={editingRule.reason?.en || ''}
                  onChange={(e) =>
                    setEditingRule({
                      ...editingRule,
                      reason: { ...editingRule.reason, en: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Trigger Reason (Telugu)</label>
                <input
                  type="text"
                  required
                  value={editingRule.reason?.te || ''}
                  onChange={(e) =>
                    setEditingRule({
                      ...editingRule,
                      reason: { ...editingRule.reason, te: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingRule(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md"
                >
                  Save Rule Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
