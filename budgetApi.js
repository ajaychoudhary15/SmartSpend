import api from './axiosClient';

export const budgetApi = {
  getBudget: async (month) => {
    const params = month ? { month } : {};
    const response = await api.get('/budget', { params });
    return response.data;
  },

  setBudget: async (budgetData) => {
    const response = await api.post('/budget', budgetData);
    return response.data;
  },
};
