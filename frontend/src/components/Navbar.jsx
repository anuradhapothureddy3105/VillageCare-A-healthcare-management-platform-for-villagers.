import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import {
  Heart,
  Globe,
  Bell,
  Menu,
  X,
  LogOut,
  User,
  Shield,
  HeartPulse,
  Home,
  BookOpen,
  BarChart2,
  Users,
  ClipboardCheck,
  Baby,
  Sliders,
  CheckCircle2,
  Video,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAdmin, isHealthWorker, isVillager } = useAuth();
  const { lang, toggleLang, t, tContent } = useLanguage();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Village Badge */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-brand-600 transition">
                  VILLAGE<span className="text-brand-600">CARE</span>
                </span>
                <span className="block text-[10px] font-semibold text-slate-500 tracking-wider uppercase">
                  Pentapadu • West Godavari
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links - Distinct Per Role */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-xs font-bold transition ${
                isActive('/') ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
              }`}
            >
              {t('navHome')}
            </Link>

            {/* Telugu Health Videos */}
            <Link
              to="/awareness"
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1 transition ${
                isActive('/awareness') ? 'text-red-700 bg-red-50' : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-red-600" />
              <span>{t('navAwareness')}</span>
            </Link>

            {/* ADMIN ONLY NAVIGATION */}
            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition ${
                    isActive('/admin') ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center space-x-1">
                    <BarChart2 className="w-3.5 h-3.5" />
                    <span>{t('navDashboard')}</span>
                  </span>
                </Link>

                <Link
                  to="/households"
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition ${
                    isActive('/households') ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                  }`}
                >
                  {t('navHouseholds')}
                </Link>

                <Link
                  to="/admin/users"
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition ${
                    isActive('/admin/users') ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-purple-600" />
                    <span>{t('navUsers')}</span>
                  </span>
                </Link>

                <Link
                  to="/admin/rules"
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition ${
                    isActive('/admin/rules') ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center space-x-1">
                    <Sliders className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t('navSettings')}</span>
                  </span>
                </Link>
              </>
            )}

            {/* ASHA WORKER ONLY NAVIGATION */}
            {isHealthWorker && (
              <>
                <Link
                  to="/health-worker"
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition ${
                    isActive('/health-worker') ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center space-x-1">
                    <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t('navAshaDashboard')}</span>
                  </span>
                </Link>

                <Link
                  to="/households"
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition ${
                    isActive('/households') ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                  }`}
                >
                  {t('navHouseholds')}
                </Link>

                <Link
                  to="/surveys"
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition ${
                    isActive('/surveys') ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center space-x-1">
                    <ClipboardCheck className="w-3.5 h-3.5 text-sky-600" />
                    <span>{t('navSurveys')}</span>
                  </span>
                </Link>

                <Link
                  to="/maternal"
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition ${
                    isActive('/maternal') ? 'text-rose-700 bg-rose-50' : 'text-slate-600 hover:text-rose-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center space-x-1">
                    <Baby className="w-3.5 h-3.5 text-rose-600" />
                    <span>{t('navMaternal')}</span>
                  </span>
                </Link>
              </>
            )}

            {/* VILLAGER ONLY NAVIGATION */}
            {isVillager && (
              <>
                <Link
                  to="/villager"
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition ${
                    isActive('/villager') ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center space-x-1">
                    <Home className="w-3.5 h-3.5" />
                    <span>My Household</span>
                  </span>
                </Link>

                <Link
                  to="/villager/maternal"
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition ${
                    isActive('/villager/maternal') ? 'text-rose-700 bg-rose-50' : 'text-slate-600 hover:text-rose-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center space-x-1">
                    <Baby className="w-3.5 h-3.5 text-rose-600" />
                    <span>My Antenatal Care</span>
                  </span>
                </Link>

                <Link
                  to="/villager/consent"
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition ${
                    isActive('/villager/consent') ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                  }`}
                >
                  DPDP Consent
                </Link>
              </>
            )}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Bilingual Toggle Button */}
            <button
              onClick={toggleLang}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-brand-300 transition"
              title="Switch language between English and Telugu"
            >
              <Globe className="w-3.5 h-3.5 text-brand-600" />
              <span>{lang === 'en' ? 'తెలుగు' : 'English'}</span>
            </button>

            {/* Notifications Menu */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-800">{t('notifications')}</h4>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-brand-600 hover:underline font-medium"
                        >
                          {t('markAllRead')}
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">
                          {t('noNotifications')}
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n.notificationId || n._id}
                            onClick={() => markAsRead(n.notificationId || n._id)}
                            className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition ${
                              !n.isRead ? 'bg-emerald-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <span className="font-semibold text-slate-800">
                                {tContent(n.title)}
                              </span>
                              {!n.isRead && (
                                <span className="w-2 h-2 rounded-full bg-brand-500 mt-1"></span>
                              )}
                            </div>
                            <p className="text-slate-600 mt-1 line-clamp-2">
                              {tContent(n.message)}
                            </p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="px-4 pt-2 border-t border-slate-100 text-center">
                      <Link
                        to="/notifications"
                        onClick={() => setNotifDropdownOpen(false)}
                        className="text-xs font-semibold text-brand-600 hover:underline"
                      >
                        View All Notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile or Login */}
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {user.fullName}
                  </div>
                  <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : user.role === 'health_worker'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {user.role === 'admin'
                      ? 'PHC Medical Officer'
                      : user.role === 'health_worker'
                      ? 'ASHA Field Worker'
                      : 'Villager'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title={t('navLogout')}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl shadow-sm transition"
              >
                {t('navLogin')}
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-brand-50"
          >
            {t('navHome')}
          </Link>

          <Link
            to="/awareness"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-red-700 bg-red-50"
          >
            {t('navAwareness')}
          </Link>

          {isAdmin && (
            <>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-brand-50"
              >
                {t('navDashboard')}
              </Link>
              <Link
                to="/households"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-brand-50"
              >
                {t('navHouseholds')}
              </Link>
              <Link
                to="/admin/users"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-brand-50"
              >
                {t('navUsers')}
              </Link>
              <Link
                to="/admin/rules"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-brand-50"
              >
                {t('navSettings')}
              </Link>
            </>
          )}

          {isHealthWorker && (
            <>
              <Link
                to="/health-worker"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-brand-700 bg-brand-50"
              >
                {t('navAshaDashboard')}
              </Link>
              <Link
                to="/households"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-brand-50"
              >
                {t('navHouseholds')}
              </Link>
              <Link
                to="/surveys"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-brand-50"
              >
                {t('navSurveys')}
              </Link>
              <Link
                to="/maternal"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-brand-50"
              >
                {t('navMaternal')}
              </Link>
            </>
          )}

          {isVillager && (
            <>
              <Link
                to="/villager"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-brand-700 bg-brand-50"
              >
                My Household
              </Link>
              <Link
                to="/villager/maternal"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-brand-50"
              >
                My Antenatal Care
              </Link>
              <Link
                to="/villager/consent"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-brand-50"
              >
                DPDP Consent Preferences
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
