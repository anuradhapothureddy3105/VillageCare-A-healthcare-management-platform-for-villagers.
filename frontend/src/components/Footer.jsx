import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Heart, ShieldCheck, ExternalLink, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span>VILLAGECARE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              {t('appTagline')}. Developed as a real-world B.Tech CSE Mini-Project & Community Service Project:
              <span className="text-emerald-400 block mt-1 font-medium">
                "{t('communityServiceTitle')}"
              </span>
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-300 pt-1">
              <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
              <span>Pentapadu Village, Pentapadu Mandal, West Godavari District, Andhra Pradesh, India.</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Application Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-brand-400 transition">
                  {t('navHome')}
                </Link>
              </li>
              <li>
                <Link to="/awareness" className="hover:text-brand-400 transition">
                  {t('navAwareness')}
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-brand-400 transition">
                  Role-Based Login
                </Link>
              </li>
              <li>
                <Link to="/villager/consent" className="hover:text-brand-400 transition">
                  DPDP Consent Preferences
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Reference Guidelines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Verified Guidelines
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-1">
                <span>WHO Community Hygiene</span>
              </li>
              <li className="flex items-center space-x-1">
                <span>National Health Mission (NHM)</span>
              </li>
              <li className="flex items-center space-x-1">
                <span>PMSMA Maternal Care</span>
              </li>
              <li className="flex items-center space-x-1">
                <span>Swachh Bharat Grameen</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimers */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-brand-500" />
            <span>
              DPDP Act 2023 Compliant • Fictional Demo Records • Non-Diagnostic Public Health Education
            </span>
          </div>
          <div>
            © 2026 VillageCare • Pentapadu Village Health & Hygiene Monitoring System
          </div>
        </div>
      </div>
    </footer>
  );
};
