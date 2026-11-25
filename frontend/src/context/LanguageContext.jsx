import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../locales/en.js';
import { te } from '../locales/te.js';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('villagecare_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('villagecare_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'te' : 'en'));
  };

  const t = (key) => {
    const dict = lang === 'te' ? te : en;
    return dict[key] || en[key] || key;
  };

  const tContent = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj['en'] || Object.values(obj)[0] || '';
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, tContent }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
