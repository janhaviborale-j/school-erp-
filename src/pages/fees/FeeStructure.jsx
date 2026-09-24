import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  IndianRupee,
  Edit2,
  Trash2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import { feeService } from '../../services/feeService';
import { mockStore } from '../../data/store';
import { useToast } from '../../context/ToastContext';

export default function FeeStructure() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    className: 'Class 3',
    academicYear: '2026–27',
    annualFee: 35000,
    tuitionFee: 28000,
    activityFee: 4000,
    examFee: 3000,
    status: 'Active',
  });

  const fetchStructures = async () => {
    setLoading(true);
    try {
      const data = await feeService.getFeeStructures();
      setStructures(data);
    } catch {
      showToast('Failed to load fee structures', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStructures();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      className: '',
      academicYear: '2026–27',
      annualFee: 30000,
      tuitionFee: 24000,
      activityFee: 3500,
      examFee: 2500,
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      className: item.className,
      academicYear: item.academicYear,
      annualFee: item.annualFee,
      tuitionFee: item.tuitionFee || Math.round(item.annualFee * 0.8),
      activityFee: item.activityFee || Math.round(item.annualFee * 0.1),
      examFee: item.examFee || Math.round(item.annualFee * 0.1),
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.className.trim() || formData.annualFee <= 0) {
      showToast('Please enter a valid class name and annual fee', 'error');
      return;
    }

    try {
      if (editingItem) {
        await feeService.updateFeeStructure(editingItem.id, formData);
        showToast(`Fee structure for ${formData.className} updated!`);
      } else {
        await feeService.createFeeStructure(formData);
        showToast(`Fee structure for ${formData.className} created!`);
      }
      setIsModalOpen(false);
      fetchStructures();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/fees')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl transition-colors shadow-2xs mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Fee Desk</span>
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
            Institutional Fee Structures
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Standard annual tuition, laboratory, and activity schedules per grade.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Structure</span>
        </button>
      </div>

      {/* Grid of Structures */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {structures.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-all"
          >
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    {item.className}
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">
                    AY {item.academicYear}
                  </span>
                </div>
                <StatusBadge status={item.status} />
              </div>

              {/* Total Annual Fee Callout */}
              <div className="my-4 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-900">
                  Total Annual Fee
                </span>
                <span className="text-xl font-bold text-indigo-700 font-display tabular-nums">
                  ₹{item.annualFee.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-2 text-xs text-slate-600 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Core Tuition Fee:</span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    ₹{(item.tuitionFee || Math.round(item.annualFee * 0.8)).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Activities & Sports:</span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    ₹{(item.activityFee || Math.round(item.annualFee * 0.1)).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Examination & Material:</span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    ₹{(item.examFee || Math.round(item.annualFee * 0.1)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Applied to all admitted students
              </span>
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Edit Structure"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Fee Structure' : 'Create New Fee Structure'}
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
              value={formData.className}
              onChange={(e) => setFormData({ ...formData, className: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Annual Course Fee Total (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              value={formData.annualFee}
              onChange={(e) => setFormData({ ...formData, annualFee: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Core Tuition (₹)
              </label>
              <input
                type="number"
                value={formData.tuitionFee}
                onChange={(e) => setFormData({ ...formData, tuitionFee: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Activities & Lab (₹)
              </label>
              <input
                type="number"
                value={formData.activityFee}
                onChange={(e) => setFormData({ ...formData, activityFee: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none"
              />
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
              {editingItem ? 'Save Changes' : 'Create Structure'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
