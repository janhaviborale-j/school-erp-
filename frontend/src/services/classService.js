import api from './api';
import { mockStore } from '../data/store';

export const classService = {
  getClasses: async () => {
    try {
      const response = await api.get('/classes');
      return response.data;
    } catch {
      return mockStore.classes.map((cls) => {
        const studentCount = mockStore.students.filter(
          (s) => s.classId === cls.id || s.className.toLowerCase() === cls.name.toLowerCase()
        ).length;
        return {
          ...cls,
          enrolled: studentCount || cls.enrolled,
        };
      });
    }
  },

  getClassById: async (id) => {
    try {
      const response = await api.get(`/classes/${id}`);
      return response.data;
    } catch {
      const cls = mockStore.classes.find((c) => c.id === id);
      if (!cls) throw new Error('Class not found');
      const students = mockStore.students.filter(
        (s) => s.classId === cls.id || s.className.toLowerCase() === cls.name.toLowerCase()
      );
      return { ...cls, students };
    }
  },

  createClass: async (data) => {
    try {
      const response = await api.post('/classes', data);
      return response.data;
    } catch {
      if (!data.name || !data.section) {
        throw new Error('Class Name and Section are required.');
      }
      const newClass = {
        id: `cls-${Date.now()}`,
        name: data.name,
        section: data.section,
        academicYear: data.academicYear || '2026–27',
        teacherName: data.teacherName || 'Not Assigned',
        status: data.status || 'Active',
        capacity: Number(data.capacity) || 25,
        enrolled: 0,
      };
      mockStore.classes.push(newClass);
      mockStore.saveClasses();
      return newClass;
    }
  },

  updateClass: async (id, data) => {
    try {
      const response = await api.put(`/classes/${id}`, data);
      return response.data;
    } catch {
      const index = mockStore.classes.findIndex((c) => c.id === id);
      if (index === -1) throw new Error('Class not found');
      const updated = { ...mockStore.classes[index], ...data };
      mockStore.classes[index] = updated;
      mockStore.saveClasses();
      return updated;
    }
  },

  deactivateClass: async (id) => {
    try {
      const response = await api.delete(`/classes/${id}`);
      return response.data;
    } catch {
      const cls = mockStore.classes.find((c) => c.id === id);
      if (!cls) throw new Error('Class not found');
      cls.status = cls.status === 'Active' ? 'Inactive' : 'Active';
      mockStore.saveClasses();
      return cls;
    }
  },
};
