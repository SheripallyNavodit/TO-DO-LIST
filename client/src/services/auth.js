import { request } from './api';

export const authService = {
  async register(userData) {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (res.data?.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async login(credentials) {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    if (res.data?.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async logout() {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  async getMe() {
    const res = await request('/auth/me');
    return res.data?.user;
  },

  async getProfile() {
    const res = await request('/users/me');
    return res.data?.profile;
  },

  async updateProfile(profileData) {
    const res = await request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
    if (res.data?.profile) {
      localStorage.setItem('user', JSON.stringify(res.data.profile));
    }
    return res.data?.profile;
  }
};
