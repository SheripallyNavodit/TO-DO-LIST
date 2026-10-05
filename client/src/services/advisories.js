import { request } from './api';

export const advisoryService = {
  async createAdvisory(inputData) {
    const res = await request('/advisories', {
      method: 'POST',
      body: JSON.stringify(inputData)
    });
    return res.data?.advisory;
  },

  async getAdvisories(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.crop) searchParams.append('crop', params.crop);
    if (params.type) searchParams.append('type', params.type);
    if (params.page) searchParams.append('page', params.page);
    if (params.limit) searchParams.append('limit', params.limit);

    const queryStr = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await request(`/advisories${queryStr}`);
    return res.data;
  },

  async getAdvisoryById(id) {
    const res = await request(`/advisories/${id}`);
    return res.data;
  },

  async deleteAdvisory(id) {
    const res = await request(`/advisories/${id}`, {
      method: 'DELETE'
    });
    return res;
  },

  async updateActionStatus(actionId, status) {
    const res = await request(`/advisory-actions/${actionId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    return res.data?.action;
  }
};
