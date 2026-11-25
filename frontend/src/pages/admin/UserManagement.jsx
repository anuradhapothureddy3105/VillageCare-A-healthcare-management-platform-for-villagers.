import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Users, UserPlus, Shield, HeartPulse, User, Phone, CheckCircle2, X } from 'lucide-react';

export const UserManagement = () => {
  const { lang } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    fullName: '',
    phone: '',
    role: 'health_worker',
    householdId: '',
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/auth/users');
      if (res.success) setUsers(res.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateWorker = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(newUser),
      });

      if (res.success) {
        setShowAddModal(false);
        setNewUser({
          username: '',
          password: '',
          fullName: '',
          phone: '',
          role: 'health_worker',
          householdId: '',
        });
        fetchUsers();
      }
    } catch (err) {
      alert('Failed to create health worker account: ' + err.message);
    }
  };

  const filtered = users.filter((u) => (roleFilter === 'all' ? true : u.role === roleFilter));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-700 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Staff & Villager Accounts</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            {lang === 'te' ? 'యూజర్ & ఆశా కార్యకర్తల నిర్వహణ' : 'User Roles & Health Worker Management'}
          </h1>
          <p className="text-xs text-slate-500">
            Authorize community health workers and manage role-based access for Pentapadu Village.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Authorized Health Worker</span>
        </button>
      </div>

      {/* Role filter bar */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 w-max text-xs font-bold">
        {['all', 'admin', 'health_worker', 'villager'].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-3 py-1.5 rounded-xl capitalize transition ${
              roleFilter === r ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {r === 'all' ? 'All Roles' : r === 'health_worker' ? 'Health Workers' : r}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading accounts...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 uppercase text-[10px] font-extrabold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Full Name</th>
                  <th className="py-3.5 px-6">Username</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">Contact Phone</th>
                  <th className="py-3.5 px-6">Household ID</th>
                  <th className="py-3.5 px-6">Enrolled On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-6 font-bold text-slate-900">{u.fullName}</td>
                    <td className="py-3 px-6 text-slate-500">{u.username}</td>
                    <td className="py-3 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'health_worker'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role === 'health_worker' ? 'ASHA Worker' : u.role}
                      </span>
                    </td>
                    <td className="py-3 px-6">{u.phone || '—'}</td>
                    <td className="py-3 px-6">{u.householdId || '—'}</td>
                    <td className="py-3 px-6 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Worker Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Authorize New Health Worker</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWorker} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. M. Padmavathi"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. asha_ptp_02"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  placeholder="98480xxxxx"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  Create Authorized Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
