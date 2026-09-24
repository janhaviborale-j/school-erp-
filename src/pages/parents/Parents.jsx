import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Search,
  Phone,
  Mail,
  MapPin,
  Edit2,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { parentService } from '../../services/parentService';
import { useToast } from '../../context/ToastContext';

export default function Parents() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Add / Edit Parent Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    relation: 'Father',
    phone: '',
    email: '',
    address: '',
  });

  const fetchParents = async () => {
    setLoading(true);
    try {
      const data = await parentService.getParents(search);
      setParents(data);
    } catch {
      showToast('Failed to load parents directory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, [search]);

  const handleOpenAdd = () => {
    setEditingParent(null);
    setFormData({
      name: '',
      relation: 'Father',
      phone: '',
      email: '',
      address: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (parent) => {
    setEditingParent(parent);
    setFormData({
      name: parent.name,
      relation: parent.relation,
      phone: parent.phone,
      email: parent.email || '',
      address: parent.address || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      showToast('Name and Phone number are required', 'error');
      return;
    }

    try {
      if (editingParent) {
        await parentService.updateParent(editingParent.id, formData);
        showToast('Parent details updated successfully!');
      } else {
        await parentService.createParent(formData);
        showToast('New guardian record registered!');
      }
      setIsModalOpen(false);
      fetchParents();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
            Parents & Guardians Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verified emergency contacts, communication channels, and linked pupils.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-2xs"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>+ Add Parent</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by parent name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Parents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {parents.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              title="No parent records found"
              description="Register new parents to link them with admitted students."
              actionLabel="Add Parent"
              onAction={handleOpenAdd}
            />
          </div>
        ) : (
          parents.map((parent) => (
            <div
              key={parent.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-all"
            >
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-sm flex items-center justify-center shrink-0">
                      {parent.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 font-display">
                        {parent.name}
                      </h3>
                      <span className="text-xs text-indigo-600 font-medium">
                        {parent.relation}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenEdit(parent)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Contact list */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`tel:${parent.phone}`} className="hover:text-indigo-600 hover:underline">
                      {parent.phone}
                    </a>
                  </div>
                  {parent.email && (
                    <div className="flex items-center gap-2 text-slate-700">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a href={`mailto:${parent.email}`} className="hover:text-indigo-600 hover:underline truncate">
                        {parent.email}
                      </a>
                    </div>
                  )}
                  {parent.address && (
                    <div className="flex items-start gap-2 text-slate-500 text-[11px] pt-1 leading-relaxed">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{parent.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Linked Students Section */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Enrolled Wards ({parent.students?.length || 0})
                </span>
                {(!parent.students || parent.students.length === 0) ? (
                  <p className="text-xs text-slate-400 italic">No students linked</p>
                ) : (
                  <div className="space-y-1.5">
                    {parent.students.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => navigate(`/students/${s.id}`)}
                        className="p-2 bg-slate-50 hover:bg-indigo-50/60 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="text-xs font-semibold text-slate-800">
                            {s.fullName}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {s.classSection}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingParent ? 'Edit Guardian Details' : 'Register New Parent / Guardian'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Patel"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Relationship to Pupil
            </label>
            <select
              value={formData.relation}
              onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
            >
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Guardian">Guardian</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Contact Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="+91 98200 XXXXX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="parent@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Residential Address
            </label>
            <textarea
              rows={2}
              placeholder="Flat / Building, Sector, City"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-2xs"
            >
              {editingParent ? 'Save Changes' : 'Register Parent'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
