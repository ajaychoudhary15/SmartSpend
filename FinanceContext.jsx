import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { transactionApi } from '../api/transactionApi';
import { budgetApi } from '../api/budgetApi';
import { useAuth } from './AuthContext';

const FinanceContext = createContext(null);

const getCurrentYearMonth = () => {
  const d = new Date();
  const yr = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  return `${yr}-${mo}`;
};

export const FinanceProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    summary: {
      totalIncome: 0,
      totalExpense: 0,
      netBalance: 0,
      savingsRate: 0,
      transactionCount: 0,
    },
    categoryBreakdown: [],
    monthlyTrends: [],
  });
  const [budget, setBudget] = useState({
    month: getCurrentYearMonth(),
    monthlyLimit: 0,
    alertThreshold: 80,
    spent: 0,
    remaining: 0,
    percentageUsed: 0,
    status: 'no_budget',
    hasBudgetSet: false,
  });
  const [categories, setCategories] = useState([
    'Food & Dining',
    'Housing & Rent',
    'Utilities & Bills',
    'Transportation',
    'Healthcare & Fitness',
    'Entertainment & Leisure',
    'Shopping & Groceries',
    'Education',
    'Salary',
    'Freelance & Side Hustle',
    'Investments & Dividends',
    'Gifts & Grants',
    'Other',
  ]);

  const [filters, setFilters] = useState({
    search: '',
    type: 'all', // 'all' | 'income' | 'expense'
    category: 'All',
    month: getCurrentYearMonth(),
    sort: 'date_desc',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev && prev.message === message ? null : prev));
    }, 4000);
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  // Fetch all categories once
  useEffect(() => {
    if (isAuthenticated) {
      transactionApi
        .getCategories()
        .then((res) => {
          if (res.success && res.data) {
            setCategories(res.data);
          }
        })
        .catch(() => {
          // Defaults already provided in state
        });
    }
  }, [isAuthenticated]);

  // Main data fetcher
  const refreshFinanceData = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);

    try {
      const queryParams = {
        sort: filters.sort,
      };

      if (filters.search) queryParams.search = filters.search;
      if (filters.type !== 'all') queryParams.type = filters.type;
      if (filters.category !== 'All') queryParams.category = filters.category;
      if (filters.month) queryParams.month = filters.month;

      const [txRes, statsRes, budgetRes] = await Promise.all([
        transactionApi.getTransactions(queryParams),
        transactionApi.getTransactionStats({ month: filters.month || undefined }),
        budgetApi.getBudget(filters.month || undefined),
      ]);

      if (txRes.success) setTransactions(txRes.data);
      if (statsRes.success) setStats(statsRes.data);
      if (budgetRes.success) setBudget(budgetRes.data);
    } catch (err) {
      console.error('Error fetching finance data:', err);
      setError(err.response?.data?.message || 'Failed to load financial records');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, filters]);

  useEffect(() => {
    refreshFinanceData();
  }, [refreshFinanceData]);

  // Add transaction
  const addTransaction = async (data) => {
    try {
      const res = await transactionApi.addTransaction(data);
      if (res.success) {
        showToast('Transaction recorded successfully!', 'success');
        await refreshFinanceData();
        return res.data;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add transaction';
      showToast(msg, 'error');
      throw new Error(msg);
    }
  };

  // Update transaction
  const updateTransaction = async (id, data) => {
    try {
      const res = await transactionApi.updateTransaction(id, data);
      if (res.success) {
        showToast('Transaction updated successfully!', 'success');
        await refreshFinanceData();
        return res.data;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update transaction';
      showToast(msg, 'error');
      throw new Error(msg);
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      const res = await transactionApi.deleteTransaction(id);
      if (res.success) {
        showToast('Transaction deleted successfully!', 'info');
        await refreshFinanceData();
        return res.data;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete transaction';
      showToast(msg, 'error');
      throw new Error(msg);
    }
  };

  // Save budget
  const saveBudget = async (monthlyLimit, alertThreshold = 80) => {
    try {
      const monthToSave = filters.month || getCurrentYearMonth();
      const res = await budgetApi.setBudget({
        month: monthToSave,
        monthlyLimit: parseFloat(monthlyLimit),
        alertThreshold: parseInt(alertThreshold, 10),
      });

      if (res.success) {
        showToast(`Budget for ${monthToSave} saved!`, 'success');
        await refreshFinanceData();
        return res.data;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save budget';
      showToast(msg, 'error');
      throw new Error(msg);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      category: 'All',
      month: getCurrentYearMonth(),
      sort: 'date_desc',
    });
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        stats,
        budget,
        categories,
        filters,
        loading,
        error,
        toast,
        showToast,
        dismissToast,
        refreshFinanceData,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        saveBudget,
        updateFilters,
        resetFilters,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
