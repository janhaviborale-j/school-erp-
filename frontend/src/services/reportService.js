import api from './api';
import { mockStore } from '../data/store';

export const reportService = {
  getStudentReport: async () => {
    try {
      const response = await api.get('/reports/students');
      return response.data;
    } catch {
      const students = mockStore.students;
      const total = students.length;
      const active = students.filter((s) => s.status === 'Active').length;
      const inactive = students.filter((s) => s.status === 'Inactive').length;

      // Group by class
      const byClass = {};
      students.forEach((s) => {
        byClass[s.className] = (byClass[s.className] || 0) + 1;
      });

      return {
        total,
        active,
        inactive,
        byClass,
        students,
      };
    }
  },

  getAttendanceReport: async () => {
    try {
      const response = await api.get('/reports/attendance');
      return response.data;
    } catch {
      const students = mockStore.students.filter((s) => s.status === 'Active');
      const avgAttendance = (
        students.reduce((sum, s) => sum + (s.attendancePercent || 90), 0) / (students.length || 1)
      ).toFixed(1);

      return {
        averageAttendanceRate: avgAttendance,
        totalTracked: students.length,
        chronicAbsenteesCount: students.filter((s) => (s.attendancePercent || 90) < 85).length,
        classBreakdown: [
          { name: 'Nursery A', rate: '92.5%', present: 20, absent: 2 },
          { name: 'Junior KG A', rate: '94.2%', present: 22, absent: 2 },
          { name: 'Senior KG A', rate: '96.0%', present: 21, absent: 1 },
          { name: 'Class 1 A', rate: '88.0%', present: 25, absent: 3 },
          { name: 'Class 2 A', rate: '81.2%', present: 27, absent: 5 },
        ],
      };
    }
  },

  getFeeReport: async () => {
    try {
      const response = await api.get('/reports/fees');
      return response.data;
    } catch {
      const students = mockStore.students;
      const totalExpected = students.reduce((sum, s) => sum + s.totalFee, 0);
      const totalCollected = students.reduce((sum, s) => sum + s.paidFee, 0);
      const totalPending = totalExpected - totalCollected;
      const collectionRate = Math.round((totalCollected / totalExpected) * 100);

      // Mode distribution
      const payments = mockStore.payments;
      const byMode = {
        UPI: payments.filter((p) => p.mode === 'UPI').reduce((sum, p) => sum + p.amount, 0),
        Cash: payments.filter((p) => p.mode === 'Cash').reduce((sum, p) => sum + p.amount, 0),
        'Bank Transfer': payments.filter((p) => p.mode === 'Bank Transfer').reduce((sum, p) => sum + p.amount, 0),
      };

      return {
        totalExpected,
        totalCollected,
        totalPending,
        collectionRate,
        byMode,
        recentPayments: payments.slice(0, 10),
      };
    }
  },
};
