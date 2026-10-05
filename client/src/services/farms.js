import { request } from './api';

export const farmService = {
  async getFarms() {
    const res = await request('/farms');
    return res.data?.farms || [];
  },

  async getFarmById(id) {
    const res = await request(`/farms/${id}`);
    return res.data?.farm;
  },

  async createFarm(data) {
    const res = await request('/farms', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data?.farm;
  },

  async updateFarm(id, data) {
    const res = await request(`/farms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.data?.farm;
  },

  async deleteFarm(id) {
    const res = await request(`/farms/${id}`, {
      method: 'DELETE'
    });
    return res;
  }
};
