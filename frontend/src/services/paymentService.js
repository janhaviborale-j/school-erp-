import api from './api';
import { mockStore } from '../data/store';

export const paymentService = {
  getPayments: async (filters = {}) => {
    try {
      const response = await api.get('/payments', { params: filters });
      return response.data;
    } catch {
      let list = [...mockStore.payments];
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(
          (p) =>
            p.receiptNo.toLowerCase().includes(q) ||
            p.studentName.toLowerCase().includes(q) ||
            p.refNo?.toLowerCase().includes(q)
        );
      }
      if (filters.studentId) {
        list = list.filter((p) => p.studentId === filters.studentId);
      }
      if (filters.mode && filters.mode !== 'All Modes') {
        list = list.filter((p) => p.mode.toLowerCase() === filters.mode.toLowerCase());
      }
      if (filters.date) {
        list = list.filter((p) => p.date === filters.date);
      }

      const totalCollected = list.reduce((sum, p) => sum + p.amount, 0);
      return {
        payments: list,
        total: list.length,
        totalCollected,
      };
    }
  },

  getPaymentById: async (id) => {
    try {
      const response = await api.get(`/payments/${id}`);
      return response.data;
    } catch {
      const payment = mockStore.payments.find((p) => p.id === id || p.receiptNo === id);
      if (!payment) throw new Error('Payment receipt not found');
      const student = mockStore.students.find((s) => s.id === payment.studentId);
      return {
        ...payment,
        student,
      };
    }
  },

  createPayment: async (data) => {
    try {
      const response = await api.post('/payments', data);
      return response.data;
    } catch {
      const student = mockStore.students.find((s) => s.id === data.studentId);
      if (!student) {
        throw new Error('Please select a valid enrolled student.');
      }

      const amount = Number(data.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Payment amount must be greater than zero.');
      }

      const pending = student.totalFee - student.paidFee;
      if (amount > pending) {
        throw new Error(`Amount exceeds pending fee of ₹${pending.toLocaleString('en-IN')}. Overpayment is strictly prohibited.`);
      }

      const nextReceiptNum = 1050 + mockStore.payments.length;
      const receiptNo = data.receiptNo || `REC-${nextReceiptNum}`;

      const newPayment = {
        id: `pay-${Date.now()}`,
        receiptNo,
        studentId: student.id,
        studentName: student.fullName,
        classSection: student.classSection,
        amount,
        date: data.date || new Date().toISOString().split('T')[0],
        dateTime: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: data.mode || 'Cash',
        refNo: data.refNo || (data.mode === 'Cash' ? 'CSH-COUNTER-01' : `REF-${Date.now().toString().slice(-6)}`),
        notes: data.notes || 'Tuition and academic fees',
        status: 'Paid',
      };

      // Update student balance
      student.paidFee += amount;
      mockStore.saveStudents();

      // Save payment
      mockStore.payments.unshift(newPayment);
      mockStore.savePayments();

      return {
        payment: newPayment,
        student,
        remainingBalance: student.totalFee - student.paidFee,
      };
    }
  },
};
