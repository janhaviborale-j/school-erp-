import api from './api';
import { mockStore } from '../data/store';

export const feeService = {
  getFeeStructures: async () => {
    try {
      const response = await api.get('/fees/structures');
      return response.data;
    } catch {
      return [...mockStore.fees];
    }
  },

  createFeeStructure: async (data) => {
    try {
      const response = await api.post('/fees/structures', data);
      return response.data;
    } catch {
      if (!data.className || !data.annualFee) {
        throw new Error('Class Name and Annual Fee are required.');
      }
      const existing = mockStore.fees.find(
        (f) => f.className.toLowerCase() === data.className.toLowerCase() && f.academicYear === (data.academicYear || '2026–27')
      );
      if (existing) {
        throw new Error(`Fee structure for ${data.className} (${data.academicYear || '2026–27'}) already exists. Edit the existing record.`);
      }

      const newFee = {
        id: `fee-${Date.now()}`,
        classId: data.classId || 'cls-1',
        className: data.className,
        academicYear: data.academicYear || '2026–27',
        annualFee: Number(data.annualFee),
        status: data.status || 'Active',
      };
      mockStore.fees.push(newFee);
      mockStore.saveFees();
      return newFee;
    }
  },

  updateFeeStructure: async (id, data) => {
    try {
      const response = await api.put(`/fees/structures/${id}`, data);
      return response.data;
    } catch {
      const index = mockStore.fees.findIndex((f) => f.id === id);
      if (index === -1) throw new Error('Fee structure not found');
      const updated = { ...mockStore.fees[index], ...data, annualFee: Number(data.annualFee) };
      mockStore.fees[index] = updated;
      mockStore.saveFees();
      return updated;
    }
  },

  getPendingFees: async (filters = {}) => {
    try {
      const response = await api.get('/fees/pending', { params: filters });
      return response.data;
    } catch {
      let pendingList = mockStore.students
        .filter((s) => s.status === 'Active' && s.totalFee > s.paidFee)
        .map((s) => {
          const pending = s.totalFee - s.paidFee;
          const pct = Math.round((s.paidFee / s.totalFee) * 100);
          return {
            id: s.id,
            studentId: s.studentId,
            fullName: s.fullName,
            classSection: s.classSection,
            className: s.className,
            parentName: s.parentName,
            parentRelation: s.parentRelation,
            phone: s.phone,
            totalFee: s.totalFee,
            paidFee: s.paidFee,
            pendingFee: pending,
            paidPercent: pct,
            dueTier: pending >= 15000 ? 'High' : pending >= 10000 ? 'Medium' : 'Low',
          };
        });

      if (filters.class && filters.class !== 'All') {
        pendingList = pendingList.filter((p) => p.className.toLowerCase().includes(filters.class.toLowerCase()));
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        pendingList = pendingList.filter(
          (p) => p.fullName.toLowerCase().includes(q) || p.studentId.toLowerCase().includes(q) || p.parentName.toLowerCase().includes(q)
        );
      }

      const totalPendingAmount = pendingList.reduce((sum, p) => sum + p.pendingFee, 0);
      return {
        students: pendingList,
        count: pendingList.length,
        totalPendingAmount,
      };
    }
  },
};
