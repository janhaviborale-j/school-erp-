import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  UserPlus,
  Save,
  AlertCircle,
  Building2,
  Calendar,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { studentService } from '../../services/studentService';
import { mockStore } from '../../data/store';
import { useToast } from '../../context/ToastContext';

export default function AddStudent() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const activeClasses = mockStore.classes.filter((c) => c.status === 'Active');
  const existingParents = mockStore.parents;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '2021-05-15',
    gender: 'Male',
    studentId: `STU-2026-${String(mockStore.students.length + 10).padStart(3, '0')}`,
    rollNo: String(mockStore.students.length + 1).padStart(2, '0'),
    admissionDate: '2026-06-15',
    classId: activeClasses[0]?.id || 'cls-1',
    parentId: existingParents[0]?.id || 'new',
    parentName: '',
    parentRelation: 'Father',
    phone: '',
    email: '',
    address: '',
    bloodGroup: 'B+',
    totalFee: 30000,
    paidFee: 0,
    status: 'Active',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewParent, setIsNewParent] = useState(false);

  const handleClassChange = (classId) => {
    const cls = mockStore.classes.find((c) => c.id === classId);
    const feeObj = mockStore.fees.find((f) => f.className === cls?.name);
    setFormData((prev) => ({
      ...prev,
      classId,
      totalFee: feeObj?.annualFee || (cls?.name === 'Class 1' ? 35000 : 30000),
    }));
  };

  const handleParentSelect = (parentId) => {
    if (parentId === 'new') {
      setIsNewParent(true);
      setFormData((prev) => ({
        ...prev,
        parentId: 'new',
        parentName: '',
        phone: '',
        email: '',
        address: '',
      }));
    } else {
      setIsNewParent(false);
      const par = existingParents.find((p) => p.id === parentId);
      if (par) {
        setFormData((prev) => ({
          ...prev,
          parentId: par.id,
          parentName: par.name,
          parentRelation: par.relation,
          phone: par.phone,
          email: par.email || '',
          address: par.address || '',
        }));
      }
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.studentId.trim()) errs.studentId = 'Student ID is required';
    if (!formData.dateOfBirth) errs.dateOfBirth = 'Date of birth is required';
    if (!formData.classId) errs.classId = 'Class selection is required';

    if (isNewParent) {
      if (!formData.parentName.trim()) errs.parentName = 'Parent name is required';
      if (!formData.phone.trim()) errs.phone = 'Contact telephone is required';
    } else if (!formData.parentId) {
      errs.parentId = 'Please select or add a primary guardian';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please correct highlighted fields before submitting', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalParentId = formData.parentId;
      let finalParentName = formData.parentName;

      // If new parent, create parent record first
      if (isNewParent) {
        const newPar = {
          id: `par-${Date.now()}`,
          name: formData.parentName,
          relation: formData.parentRelation,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          studentsCount: 1,
        };
        mockStore.parents.push(newPar);
        mockStore.saveParents();
        finalParentId = newPar.id;
        finalParentName = newPar.name;
      } else {
        const existing = mockStore.parents.find((p) => p.id === formData.parentId);
        if (existing) {
          finalParentName = existing.name;
        }
      }

      const targetClass = mockStore.classes.find((c) => c.id === formData.classId);

      await studentService.createStudent({
        ...formData,
        parentId: finalParentId,
        parentName: finalParentName,
        className: targetClass?.name,
        section: targetClass?.section,
      });

      showToast(`Student ${formData.firstName} ${formData.lastName} registered successfully!`);
      navigate('/students');
    } catch (err) {
      showToast(err.message || 'Failed to register student', 'error');
      setErrors((prev) => ({ ...prev, studentId: err.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/students')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-xl transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students Roster</span>
        </button>

        <span className="text-xs font-medium text-slate-400">
          Academic Session 2026–27
        </span>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-6 lg:p-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                New Student Admission
              </h2>
              <p className="text-xs text-slate-500">
                Enroll a new student and link guardian records.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md">
            AY 2026-27 Intake
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-8">
          {/* Section 1: Academic & Identity Details */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display pb-3 border-b border-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              Personal & Student Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                />
                {errors.firstName && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sharma"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                />
                {errors.lastName && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Unique Student ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="STU-2026-050"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-mono focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                />
                {errors.studentId && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.studentId}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Blood Group
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Class & Academic Assignment */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display pb-3 border-b border-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              Class Assignment & Fee Setup
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Enrolling Class & Section <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.classId}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                >
                  {activeClasses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} - Section {c.section} (Capacity: {c.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Class Roll No.
                </label>
                <input
                  type="text"
                  placeholder="01"
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Annual Course Fee (₹)
                </label>
                <input
                  type="number"
                  value={formData.totalFee}
                  onChange={(e) => setFormData({ ...formData, totalFee: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-mono font-semibold focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Auto-populated from institutional fee structure
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Guardian Details */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                Primary Guardian & Contact
              </h3>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-indigo-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewParent}
                    onChange={(e) => handleParentSelect(e.target.checked ? 'new' : existingParents[0]?.id)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span>Create New Guardian Record</span>
                </label>
              </div>
            </div>

            {!isNewParent ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Select Existing Registered Parent
                  </label>
                  <select
                    value={formData.parentId}
                    onChange={(e) => handleParentSelect(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                  >
                    {existingParents.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.relation} - {p.phone})
                      </option>
                    ))}
                    <option value="new">+ Register New Guardian</option>
                  </select>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                  <span className="text-slate-400 block text-[11px]">Primary Contact</span>
                  <span className="font-semibold text-slate-800">
                    {formData.parentName || existingParents[0]?.name}
                  </span>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Tel: {formData.phone || existingParents[0]?.phone}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Guardian Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                  />
                  {errors.parentName && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.parentName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Relation to Pupil
                  </label>
                  <select
                    value={formData.parentRelation}
                    onChange={(e) => setFormData({ ...formData, parentRelation: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Contact Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>
                  )}
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

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Residential Address
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Flat / Building, Street, City, Pincode"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/students')}
              className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-md shadow-indigo-100 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering...' : 'Save & Admit Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
