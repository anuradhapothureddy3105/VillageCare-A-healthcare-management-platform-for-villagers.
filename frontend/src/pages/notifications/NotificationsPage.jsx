import React, { useState } from 'react';
import { useNotification } from '../../context/NotificationContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiFetch } from '../../services/api.js';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Send,
  Sparkles,
  ShieldCheck,
  Megaphone,
} from 'lucide-react';

export const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, browserPermission, requestBrowserPermission, fetchNotifications } = useNotification();
  const { t, lang, tContent } = useLanguage();
  const { isAdmin, isHealthWorker } = useAuth();

  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    titleEn: '',
    titleTe: '',
    messageEn: '',
    messageTe: '',
    recipientRole: 'all',
  });
  const [broadcasting, setBroadcasting] = useState(false);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setBroadcasting(true);
    try {
      const res = await apiFetch('/notifications', {
        method: 'POST',
        body: JSON.stringify({
          recipientRole: broadcastForm.recipientRole,
          title: { en: broadcastForm.titleEn, te: broadcastForm.titleTe || broadcastForm.titleEn },
          message: { en: broadcastForm.messageEn, te: broadcastForm.messageTe || broadcastForm.messageEn },
          type: 'awareness_campaign',
        }),
      });

      if (res.success) {
        setShowBroadcastModal(false);
        setBroadcastForm({ titleEn: '', titleTe: '', messageEn: '', messageTe: '', recipientRole: 'all' });
        fetchNotifications();
      }
    } catch (err) {
      alert('Broadcast failed: ' + err.message);
    } finally {
      setBroadcasting(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'maternal_reminder': return Calendar;
      case 'missed_appointment': return AlertTriangle;
      case 'awareness_campaign': return Megaphone;
      default: return Bell;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-700 uppercase tracking-wider">
            <Bell className="w-4 h-4" />
            <span>Village Health Alerts & Reminders</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            {lang === 'te' ? 'నోటిఫికేషన్ల కేంద్రం' : 'Notification & Reminder Hub'}
          </h1>
          <p className="text-xs text-slate-500">
            Real-time maternal appointment reminders, survey notifications, and public health campaigns.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
            >
              {t('markAllRead')}
            </button>
          )}

          {(isAdmin || isHealthWorker) && (
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Broadcast Campaign</span>
            </button>
          )}
        </div>
      </div>

      {/* Browser Notification Permission Banner */}
      {browserPermission !== 'granted' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5 text-emerald-900">
            <Bell className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              Enable browser notifications to receive instant audio-visual alerts for upcoming antenatal visits and Pentapadu hygiene drives.
            </span>
          </div>
          <button
            onClick={requestBrowserPermission}
            className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl whitespace-nowrap self-start sm:self-center"
          >
            Enable Notifications
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            {t('noNotifications')}
          </div>
        ) : (
          notifications.map((n) => {
            const Icon = getTypeIcon(n.type);
            return (
              <div
                key={n.notificationId || n._id}
                onClick={() => markAsRead(n.notificationId || n._id)}
                className={`p-4 rounded-2xl border text-xs transition cursor-pointer flex items-start space-x-3.5 ${
                  !n.isRead
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : 'bg-slate-50/50 border-slate-200/70 hover:bg-slate-50'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  n.type === 'missed_appointment'
                    ? 'bg-rose-100 text-rose-700'
                    : n.type === 'maternal_reminder'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-brand-100 text-brand-700'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-sm">
                      {tContent(n.title)}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-slate-600 mt-1 leading-relaxed">
                    {tContent(n.message)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="font-bold text-base text-slate-900 mb-3">
              Broadcast Community Health Campaign
            </h3>

            <form onSubmit={handleBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Audience</label>
                <select
                  value={broadcastForm.recipientRole}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, recipientRole: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="all">All Villagers & Health Workers</option>
                  <option value="villager">Villagers Only</option>
                  <option value="health_worker">Health Workers (ASHA) Only</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Title (English)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Village Chlorination Drive Tomorrow"
                  value={broadcastForm.titleEn}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, titleEn: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Title (Telugu)</label>
                <input
                  type="text"
                  placeholder="e.g. రేపు గ్రామంలో తాగునీటి క్లోరినేషన్ డ్రైవ్"
                  value={broadcastForm.titleTe}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, titleTe: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Message (English)</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Details of the awareness drive..."
                  value={broadcastForm.messageEn}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, messageEn: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Message (Telugu)</label>
                <textarea
                  rows="2"
                  placeholder="తెలుగు సందేశం..."
                  value={broadcastForm.messageTe}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, messageTe: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={broadcasting}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md"
                >
                  {broadcasting ? 'Broadcasting...' : 'Send Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
