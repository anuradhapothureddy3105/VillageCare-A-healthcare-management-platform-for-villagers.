import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Square, Pause } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';

export const AudioPlayerMock = ({ textEn, textTe, title }) => {
  const { lang } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSupported(true);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlay = () => {
    if (!supported) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    const textToSpeak = lang === 'te' ? textTe || textEn : textEn;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Try finding Telugu or Indian English voice
    const voices = window.speechSynthesis.getVoices();
    if (lang === 'te') {
      const teluguVoice = voices.find((v) => v.lang.startsWith('te') || v.name.includes('Telugu'));
      if (teluguVoice) utterance.voice = teluguVoice;
      utterance.lang = 'te-IN';
    } else {
      const indianVoice = voices.find((v) => v.lang === 'en-IN');
      if (indianVoice) utterance.voice = indianVoice;
      utterance.lang = 'en-IN';
    }

    utterance.rate = 0.9; // Slightly slower, clear village-friendly narration

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center space-x-3 w-full sm:w-auto">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
          isPlaying ? 'bg-brand-600 text-white animate-pulse' : 'bg-emerald-100 text-brand-700'
        }`}>
          <Volume2 className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-800">
            {lang === 'te' ? 'ఆడియో మార్గదర్శకత్వం (వాయిస్)' : 'Audio Guidance & Narration'}
          </div>
          <div className="text-[11px] text-slate-500">
            {lang === 'te' ? 'చదవలేని వారి కోసం తెలుగు వాయిస్' : 'Spoken in simple village terminology'}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
        {!isPlaying ? (
          <button
            onClick={handlePlay}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isPaused ? (lang === 'te' ? 'పునఃప్రారంభించు' : 'Resume') : (lang === 'te' ? 'వినండి' : 'Listen Audio')}</span>
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl shadow-sm transition"
          >
            <Pause className="w-3.5 h-3.5 fill-white" />
            <span>{lang === 'te' ? 'నిలుపు' : 'Pause'}</span>
          </button>
        )}

        {(isPlaying || isPaused) && (
          <button
            onClick={handleStop}
            className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition"
            title="Stop audio"
          >
            <Square className="w-3.5 h-3.5 fill-slate-700" />
          </button>
        )}
      </div>
    </div>
  );
};
