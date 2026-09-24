import api from './api';

const MOCK_ADMIN_USER = {
  id: 'usr-admin-1',
  name: 'Mrs. Sunita Sharma',
  email: 'admin@stjudeschool.edu.in',
  role: 'Admin / School Owner',
  institution: 'St. Jude Early Learners Academy',
  academicYear: '2026–27',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwfMcTHOKdZ9R1AjClue4H4B3CUUarAPxfFDR7yG8w9mg0dRvoH1tn23omVCMEab2Xv-mncVXcGgFC-uNdt-XN6fFOKNYwcxSEd4vCH_QX-s0e3Hs6CMUAqrZDrkrkJxdRwR-YZyPSIalylkp0n8FEVCWTJ5fFKQya-1xijeb50gpYX2EzdGkqJup1QS0vUDJ2-ybm33w6VfS6eaLvaRnTzWIpKJl063doMQH4tp35u_IicqP9R7um',
};

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response?.data?.token) {
        localStorage.setItem('schoolerp_token', response.data.token);
        localStorage.setItem('schoolerp_user', JSON.stringify(response.data.user));
        return response.data;
      }
    } catch {
      // Mock fallback: validate credentials
      if (
        (email.trim().toLowerCase() === 'admin@stjudeschool.edu.in' || email.trim().toLowerCase() === 'admin@schoolerp.in') &&
        (password === 'password123' || password === 'admin123')
      ) {
        const mockToken = 'mock_jwt_token_schoolerp_session_2026';
        const user = { ...MOCK_ADMIN_USER, email: email.trim() };
        localStorage.setItem('schoolerp_token', mockToken);
        localStorage.setItem('schoolerp_user', JSON.stringify(user));
        return { token: mockToken, user };
      }
      // Demo ease: if any non-empty credentials are provided in demo
      if (email.includes('@') && password.length >= 6) {
        const mockToken = 'mock_jwt_token_schoolerp_custom';
        const user = { ...MOCK_ADMIN_USER, email: email.trim() };
        localStorage.setItem('schoolerp_token', mockToken);
        localStorage.setItem('schoolerp_user', JSON.stringify(user));
        return { token: mockToken, user };
      }

      throw new Error('Invalid email or password. Please use admin@stjudeschool.edu.in / password123');
    }
  },

  logout: () => {
    localStorage.removeItem('schoolerp_token');
    localStorage.removeItem('schoolerp_user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('schoolerp_user');
    const token = localStorage.getItem('schoolerp_token');
    if (!token || !userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem('schoolerp_token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('schoolerp_token');
  },
};
