import api from './api';
import { mockStore } from '../data/store';

export const settingsService = {
  getSettings: async () => {
    try {
      const response = await api.get('/settings');
      return response.data;
    } catch {
      return { ...mockStore.settings };
    }
  },

  updateSettings: async (data) => {
    try {
      const response = await api.put('/settings', data);
      return response.data;
    } catch {
      mockStore.settings = {
        ...mockStore.settings,
        ...data,
      };
      mockStore.saveSettings();
      return { ...mockStore.settings };
    }
  },
};
