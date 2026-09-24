import api from './api';
import { mockStore } from '../data/store';

export const parentService = {
  getParents: async (search = '') => {
    try {
      const response = await api.get('/parents', { params: { search } });
      return response.data;
    } catch {
      let list = [...mockStore.parents];
      if (search) {
        const q = search.toLowerCase().trim();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.phone.includes(q) ||
            p.email.toLowerCase().includes(q)
        );
      }
      // Attach linked students
      return list.map((parent) => {
        const linkedStudents = mockStore.students.filter((s) => s.parentId === parent.id);
        return {
          ...parent,
          students: linkedStudents,
          studentsCount: linkedStudents.length,
        };
      });
    }
  },

  getParentById: async (id) => {
    try {
      const response = await api.get(`/parents/${id}`);
      return response.data;
    } catch {
      const parent = mockStore.parents.find((p) => p.id === id);
      if (!parent) throw new Error('Parent not found');
      const linkedStudents = mockStore.students.filter((s) => s.parentId === parent.id);
      return {
        ...parent,
        students: linkedStudents,
      };
    }
  },

  createParent: async (data) => {
    try {
      const response = await api.post('/parents', data);
      return response.data;
    } catch {
      if (!data.name || !data.phone) {
        throw new Error('Parent Name and Phone Number are required.');
      }
      const newParent = {
        id: `par-${Date.now()}`,
        name: data.name,
        relation: data.relation || 'Parent',
        phone: data.phone,
        email: data.email || '',
        address: data.address || '',
        studentsCount: 0,
      };
      mockStore.parents.unshift(newParent);
      mockStore.saveParents();
      return newParent;
    }
  },

  updateParent: async (id, data) => {
    try {
      const response = await api.put(`/parents/${id}`, data);
      return response.data;
    } catch {
      const index = mockStore.parents.findIndex((p) => p.id === id);
      if (index === -1) throw new Error('Parent not found');
      const updated = { ...mockStore.parents[index], ...data };
      mockStore.parents[index] = updated;
      mockStore.saveParents();
      return updated;
    }
  },
};
