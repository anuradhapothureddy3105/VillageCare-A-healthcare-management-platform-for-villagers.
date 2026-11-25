import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Home,
  Search,
  Filter,
  Plus,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  Phone,
  MapPin,
  Users,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const HouseholdManagement = () => {
  const { t, lang } = useLanguage();
  const { isAdmin, isHealthWorker } = useAuth();
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [streetFilter, setStreetFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState(null);

  // New Household Form State
  const [formData, setFormData] = useState({
    householdId: '',
    headOfHousehold: '',
    street: 'Ramalayam Veedhi',
    totalMembers: 4,
    children: 1,
    adults: 2,
    elderly: 1,
    contactNumber: '',
    notes: '',
  });

  const streets = [
    'All',
    'Ramalayam Veedhi',
    'Gandhi Bomma Center',
    'Main Bazaar Road',
    'SC Colony',
    'BC Colony',
    'Canal Bund Road',
    'Subba Rao Peta',
    'ZP High School Road',
    'Rythu Sangham Street',
    'Panchayat Office Road',
  ];

  const fetchHouseholds = async () => {
    setLoading(true);
    try {
      let url = `/households?street=${streetFilter}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await apiFetch(url);
      if (res.success) setHouseholds(res.households);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouseholds();
  }, [streetFilter, search]);

  const handleDelete = async (id, hhId) => {
    if (!window.confirm(`Delete household ${hhId} and associated records?`)) return;
    try {
      await apiFetch(`/households/${id}`, { method: 'DELETE' });
      setHouseholds((prev) => prev.filter((h) => h.householdId !== hhId && h._id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/households', {
        method: 'POST',
        body: JSON.stringify({
          householdId: formData.householdId,
          headOfHousehold: formData.headOfHousehold,
          street: formData.street,
          totalMembers: Number(formData.totalMembers),
          ageGroups: {
            children: Number(formData.children),
            adults: Number(formData.adults),
            elderly: Number(formData.elderly),
          },
          contactNumber: formData.contactNumber,
          notes: formData.notes,
        }),
      });

      if (res.success) {
        setShowAddModal(false);
        setFormData({
          householdId: '',
          headOfHousehold: '',
          street: 'Ramalayam Veedhi',
          totalMembers: 4,
          children: 1,
          adults: 2,
          elderly: 1,
          contactNumber: '',
          notes: '',
        });
        fetchHouseholds();
      }
    } catch (err) {
      alert('Failed to register household: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-700 uppercase tracking-wider">
            <Home className="w-4 h-4" />
            <span>Pentapadu Village Households</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            {lang === 'te' ? 'గ్రామ గృహాల నిర్వహణ' : 'Household Registry & Monitoring'}
          </h1>
          <p className="text-xs text-slate-500">
            Search, register and track hygiene survey completion for every residence.
          </p>
        </div>

        {(isAdmin || isHealthWorker) && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Household</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Head of Household, ID, Phone or Street..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={streetFilter}
            onChange={(e) => setStreetFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            {streets.map((st) => (
              <option key={st} value={st}>
                {st === 'All' ? 'All Streets' : st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Household Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs">Loading households...</div>
      ) : households.length === 0 ? (
        <div className="py-12 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
          No households found matching criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {households.map((hh) => (
            <div
              key={hh.householdId}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                    {hh.householdId}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      hh.surveyStatus === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {hh.surveyStatus === 'completed' ? 'Surveyed' : 'Survey Pending'}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 mt-2">
                  {hh.headOfHousehold}
                </h3>

                <div className="space-y-1.5 mt-3 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{hh.street}, Pentapadu</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {hh.totalMembers} members ({hh.ageGroups?.children || 0} kids, {hh.ageGroups?.elderly || 0} elderly)
                    </span>
                  </div>
                  {hh.contactNumber && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{hh.contactNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/surveys/conduct/${hh.householdId}`}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
                >
                  {hh.surveyStatus === 'completed' ? 'Update Survey' : 'Conduct Survey'}
                </Link>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedHousehold(hh)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                    title="Quick Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(hh._id || hh.id, hh.householdId)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="Delete Household"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Household Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Register Pentapadu Household</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 mt-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Household ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HH-PTP-021"
                    value={formData.householdId}
                    onChange={(e) => setFormData({ ...formData, householdId: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Head of Family</label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={formData.headOfHousehold}
                    onChange={(e) => setFormData({ ...formData, headOfHousehold: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pentapadu Street / Area</label>
                <select
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {streets.filter((s) => s !== 'All').map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Total</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.totalMembers}
                    onChange={(e) => setFormData({ ...formData, totalMembers: e.target.value })}
                    className="w-full px-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Kids &lt;10</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.children}
                    onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                    className="w-full px-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Adults</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.adults}
                    onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
                    className="w-full px-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Elderly 60+</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.elderly}
                    onChange={(e) => setFormData({ ...formData, elderly: e.target.value })}
                    className="w-full px-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone (Consented)</label>
                <input
                  type="tel"
                  placeholder="98480xxxxx"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Landmark / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Near Ramalayam Temple"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition"
                >
                  Save Household
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Household Quick Details Modal */}
      {selectedHousehold && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-brand-600">{selectedHousehold.householdId}</span>
                <h3 className="font-bold text-base text-slate-900">{selectedHousehold.headOfHousehold}</h3>
              </div>
              <button
                onClick={() => setSelectedHousehold(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 py-4 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Street / Area</span>
                <span className="font-semibold text-slate-800">{selectedHousehold.street}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Total Family Members</span>
                <span className="font-semibold text-slate-800">{selectedHousehold.totalMembers}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Survey Completion</span>
                <span className="font-semibold text-brand-700">{selectedHousehold.surveyStatus}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Registered By</span>
                <span className="font-semibold text-slate-800">{selectedHousehold.registeredBy}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <Link
                to={`/surveys/conduct/${selectedHousehold.householdId}`}
                onClick={() => setSelectedHousehold(null)}
                className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
              >
                Go to Survey
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
