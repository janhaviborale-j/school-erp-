import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Users,
  GraduationCap,
  Edit2,
  Trash2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import StatusBadge from '../../components/common/StatusBadge';
import { classService } from '../../services/classService';
import { mockStore } from '../../data/store';
import { useToast } from '../../context/ToastContext';

export default function Classes() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    name: 'Class 3',
    section: 'A',
    academicYear: '2026–27',
    teacherName: 'Mrs. Aarti Rao',
    capacity: 30,
    status: 'Active',
  });

  // Deactivate state
  const [targetClass, setTargetClass] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const data = await classService.getClasses();
      setClasses(data);
    } catch {
      showToast('Failed to load classes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleOpenAdd = () => {
    setEditingClass(null);
    setFormData({
      name: '',
      section: 'A',
      academicYear: '2026–27',
      teacherName: '',
      capacity: 30,
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cls) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      section: cls.section,
      academicYear: cls.academicYear,
      teacherName: cls.teacherName,
      capacity: cls.capacity,
      status: cls.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.section.trim()) {
      showToast('Class Name and Section are required', 'error');
      return;
    }

    try {
      if (editingClass) {
        await classService.updateClass(editingClass.id, formData);
        showToast(`Class ${formData.name} - ${formData.section} updated!`);
      } else {
        await classService.createClass(formData);
        showToast(`Class ${formData.name} - ${formData.section} created!`);
      }
      setIsModalOpen(false);
      fetchClasses();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleToggleStatus = async () => {
    if (!targetClass) return;
    try {
      const updated = await classService.deactivateClass(targetClass.id);
      showToast(
        `Class ${updated.name} ${updated.section} marked as ${updated.status}.`,
        updated.status === 'Active' ? 'success' : 'info'
      );
      setIsConfirmOpen(false);
      setTargetClass(null);
      fetchClasses();
    } catch (err) {
      showToast(err.message || 'Failed to update class', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
            Classes & Divisions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Section management, classroom seat capacities, and assigned educators.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Class Section</span>
        </button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {classes.map((cls) => {
          const studentCount = mockStore.students.filter(
            (s) => s.classId === cls.id || s.className.toLowerCase() === cls.name.toLowerCase()
          ).length;
          const enrolled = studentCount || cls.enrolled;
          const occupancyPct = Math.round((enrolled / cls.capacity) * 100);

          return (
            <div
              key={cls.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-all"
            >
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-display">
                        {cls.name}
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">
                        Section {cls.section} • {cls.academicYear}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={cls.status} />
                </div>

                {/* Details */}
                <div className="mt-4 space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Class Teacher</span>
                    <span className="font-semibold text-slate-800">
                      {cls.teacherName || 'Not Assigned'}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Seat Occupancy</span>
                      <span className="font-bold text-slate-900 tabular-nums">
                        {enrolled} / {cls.capacity} ({occupancyPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          occupancyPct >= 100
                            ? 'bg-rose-500'
                            : occupancyPct >= 80
                            ? 'bg-amber-500'
                            : 'bg-indigo-600'
                        }`}
                        style={{ width: `${Math.min(occupancyPct, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => navigate(`/students?class=${encodeURIComponent(cls.name)}`)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>View Students</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cls)}
                    title="Edit Class"
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setTargetClass(cls);
                      setIsConfirmOpen(true);
                    }}
                    title={cls.status === 'Active' ? 'Deactivate Class' : 'Activate Class'}
                    className={`p-1.5 rounded-lg transition-colors ${
                      cls.status === 'Active'
                        ? 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                        : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClass ? 'Edit Class Division' : 'Add New Class Section'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Class Grade / Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Nursery, Junior KG, Class 3"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Section / Division <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="A, B, C"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Classroom Capacity
              </label>
              <input
                type="number"
                min="10"
                max="60"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Assigned Class Teacher
            </label>
            <input
              type="text"
              placeholder="e.g. Mrs. Anjali Deshmukh"
              value={formData.teacherName}
              onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Academic Session
              </label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
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
              {editingClass ? 'Update Class' : 'Create Class'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleToggleStatus}
        title={targetClass?.status === 'Active' ? 'Deactivate Class Section' : 'Activate Class Section'}
        message={`Are you sure you want to change the status of ${targetClass?.name} - Section ${targetClass?.section} to ${
          targetClass?.status === 'Active' ? 'Inactive' : 'Active'
        }? Enrolled students will remain in the database.`}
        confirmText={targetClass?.status === 'Active' ? 'Deactivate' : 'Activate'}
        isDestructive={targetClass?.status === 'Active'}
      />
    </div>
  );
}
