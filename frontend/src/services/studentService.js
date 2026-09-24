import api from './api';
import { mockStore } from '../data/store';

export const studentService = {
  getStudents: async (filters = {}) => {
    try {
      const response = await api.get('/students', { params: filters });
      return response.data;
    } catch {
      // Mock fallback
      let list = [...mockStore.students];
      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        list = list.filter(
          (s) =>
            s.fullName.toLowerCase().includes(q) ||
            s.studentId.toLowerCase().includes(q) ||
            s.parentName.toLowerCase().includes(q) ||
            s.phone.includes(q)
        );
      }
      if (filters.class && filters.class !== 'All Classes' && filters.class !== 'All') {
        list = list.filter(
          (s) =>
            s.className.toLowerCase() === filters.class.toLowerCase() ||
            s.classSection.toLowerCase().includes(filters.class.toLowerCase())
        );
      }
      if (filters.status && filters.status !== 'All' && filters.status !== 'All Statuses') {
        const statusClean = filters.status.includes('Active') ? 'Active' : filters.status.includes('Inactive') ? 'Inactive' : filters.status;
        list = list.filter((s) => s.status.toLowerCase() === statusClean.toLowerCase());
      }
      if (filters.sortBy) {
        if (filters.sortBy === 'name-asc') {
          list.sort((a, b) => a.fullName.localeCompare(b.fullName));
        } else if (filters.sortBy === 'name-desc') {
          list.sort((a, b) => b.fullName.localeCompare(a.fullName));
        } else if (filters.sortBy === 'id') {
          list.sort((a, b) => a.studentId.localeCompare(b.studentId));
        }
      }
      return {
        students: list,
        total: list.length,
        totalActive: mockStore.students.filter((s) => s.status === 'Active').length,
        totalInactive: mockStore.students.filter((s) => s.status === 'Inactive').length,
      };
    }
  },

  getStudentById: async (id) => {
    try {
      const response = await api.get(`/students/${id}`);
      return response.data;
    } catch {
      const student = mockStore.students.find((s) => s.id === id || s.studentId === id);
      if (!student) throw new Error('Student not found');
      const parent = mockStore.parents.find((p) => p.id === student.parentId);
      const studentPayments = mockStore.payments.filter((p) => p.studentId === student.id);
      return {
        ...student,
        parent,
        payments: studentPayments,
      };
    }
  },

  createStudent: async (data) => {
    try {
      const response = await api.post('/students', data);
      return response.data;
    } catch {
      // Validate unique student ID
      const existingId = mockStore.students.find(
        (s) => s.studentId.trim().toLowerCase() === data.studentId.trim().toLowerCase()
      );
      if (existingId) {
        throw new Error(`Student ID "${data.studentId}" is already assigned to ${existingId.fullName}. Student IDs must be unique.`);
      }

      // Check class exists
      const targetClass = mockStore.classes.find((c) => c.id === data.classId || c.name === data.className);
      if (targetClass && targetClass.status === 'Inactive') {
        throw new Error('Cannot assign a new active student to an inactive class.');
      }

      const initials = (data.firstName[0] + (data.lastName ? data.lastName[0] : '')).toUpperCase();
      const newStudent = {
        id: `stu-${Date.now()}`,
        studentId: data.studentId,
        rollNo: data.rollNo || String(mockStore.students.length + 1).padStart(2, '0'),
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`.trim(),
        gender: data.gender || 'Male',
        dateOfBirth: data.dateOfBirth,
        admissionDate: data.admissionDate || 'Today, 22 Sep 2026',
        classId: data.classId || (targetClass ? targetClass.id : 'cls-1'),
        className: targetClass ? targetClass.name : data.className || 'Nursery',
        section: data.section || (targetClass ? targetClass.section : 'A'),
        classSection: `${targetClass ? targetClass.name : data.className} - ${data.section || 'A'}`,
        parentId: data.parentId || 'par-1',
        parentName: data.parentName || 'Parent',
        parentRelation: data.parentRelation || 'Father',
        phone: data.phone,
        address: data.address || '',
        bloodGroup: data.bloodGroup || 'B+',
        totalFee: Number(data.totalFee) || (targetClass?.name === 'Class 1' ? 35000 : 30000),
        paidFee: Number(data.paidFee) || 0,
        status: data.status || 'Active',
        attendancePercent: 100,
        recentAttendance: ['P', 'P', 'P', 'P', 'P'],
        avatarInitials: initials,
        avatarBg: 'bg-primary-container text-on-primary',
      };

      mockStore.students.unshift(newStudent);
      mockStore.saveStudents();
      return newStudent;
    }
  },

  updateStudent: async (id, data) => {
    try {
      const response = await api.put(`/students/${id}`, data);
      return response.data;
    } catch {
      const index = mockStore.students.findIndex((s) => s.id === id || s.studentId === id);
      if (index === -1) throw new Error('Student not found');

      // Check unique ID if changed
      if (data.studentId && data.studentId !== mockStore.students[index].studentId) {
        const dup = mockStore.students.find((s) => s.studentId === data.studentId && s.id !== id);
        if (dup) throw new Error(`Student ID ${data.studentId} is already in use.`);
      }

      const updated = {
        ...mockStore.students[index],
        ...data,
        fullName: data.firstName ? `${data.firstName} ${data.lastName || ''}`.trim() : mockStore.students[index].fullName,
      };

      mockStore.students[index] = updated;
      mockStore.saveStudents();
      return updated;
    }
  },

  deactivateStudent: async (id) => {
    try {
      const response = await api.delete(`/students/${id}`);
      return response.data;
    } catch {
      const student = mockStore.students.find((s) => s.id === id || s.studentId === id);
      if (!student) throw new Error('Student not found');
      student.status = student.status === 'Active' ? 'Inactive' : 'Active';
      mockStore.saveStudents();
      return student;
    }
  },
};
