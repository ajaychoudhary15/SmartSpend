import api from './axiosClient';

export const transactionApi = {
  getTransactions: async (params = {}) => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  getTransactionStats: async (params = {}) => {
    const response = await api.get('/transactions/stats', { params });
    return response.data;
  },

  addTransaction: async (data) => {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  updateTransaction: async (id, data) => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  },

  deleteTransaction: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/transactions/categories');
    return response.data;
  },
};
