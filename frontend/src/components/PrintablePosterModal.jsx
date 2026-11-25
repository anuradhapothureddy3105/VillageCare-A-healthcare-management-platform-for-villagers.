import React from 'react';
import { X, Printer, Shield, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';

export const PrintablePosterModal = ({ content, onClose }) => {
  const { lang, tContent } = useLanguage();

  if (!content) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Modal Controls (Hidden in Print) */}
        <div className="print:hidden px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-700 font-bold text-sm">
            <Printer className="w-4 h-4 text-brand-600" />
            <span>Community Awareness Poster (Download / Print Ready)</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Poster (A4 / PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Poster Canvas */}
        <div id="printable-content" className="p-8 bg-white border-8 border-brand-700 m-2 rounded-2xl">
          {/* Header */}
          <div className="text-center pb-6 border-b-2 border-brand-200">
            <span className="text-[11px] font-extrabold tracking-widest uppercase text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Gram Panchayat Pentapadu • Community Health Board
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-3 leading-snug">
              {content.title?.te || content.title?.en}
            </h1>
            <h2 className="text-base font-bold text-brand-700 mt-1">
              {content.title?.en}
            </h2>
          </div>

          {/* Key Message */}
          <div className="my-6 p-4 bg-brand-50 rounded-xl border border-brand-100 text-slate-800">
            <div className="font-bold text-sm text-brand-900 mb-1">
              గ్రామ ప్రజలకు ముఖ్య గమనిక / Community Announcement:
            </div>
            <p className="text-xs leading-relaxed text-slate-700">
              {content.summary?.te}
            </p>
            <p className="text-xs leading-relaxed text-slate-600 mt-1 italic">
              {content.summary?.en}
            </p>
          </div>

          {/* Preventive Actions */}
          <div className="space-y-3 my-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              ఆచరించాల్సిన ఆరోగ్య నియమాలు / Daily Preventive Rules:
            </h3>
            {content.preventivePractices?.map((practice, idx) => (
              <div key={idx} className="flex items-start space-x-3 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">{practice.te}</div>
                  <div className="text-slate-600">{practice.en}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Daily Tip Callout */}
          {content.dailyTip && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl my-4 text-xs">
              <span className="font-bold text-amber-900">ఆరోగ్య సూత్రం / Golden Rule: </span>
              <span className="text-amber-800">{content.dailyTip.te} ({content.dailyTip.en})</span>
            </div>
          )}

          {/* Footer of Poster */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 gap-2">
            <div>
              <span className="font-semibold text-slate-700">Issued by: </span>
              Pentapadu Primary Health Centre (PHC) & Grama Sachivalayam
            </div>
            <div>
              <span className="font-semibold text-slate-700">Official Standards: </span>
              WHO • National Health Mission • Swachh Bharat Grameen
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
