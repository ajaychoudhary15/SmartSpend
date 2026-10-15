import React, { useState, useEffect } from 'react';
import { X, PiggyBank, Check } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';

export const SetBudgetModal = ({ isOpen, onClose }) => {
  const { budget, saveBudget, filters } = useFinance();
  const { user } = useAuth();
  const currency = user?.currency || '$';

  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [alertThreshold, setAlertThreshold] = useState('80');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (budget) {
      setMonthlyLimit(budget.monthlyLimit > 0 ? String(budget.monthlyLimit) : '');
      setAlertThreshold(budget.alertThreshold ? String(budget.alertThreshold) : '80');
    }
    setErrorMsg('');
  }, [budget, isOpen]);

  if (!isOpen) return null;

  const currentMonth = filters.month || new Date().toISOString().slice(0, 7);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const limit = parseFloat(monthlyLimit);
    if (isNaN(limit) || limit <= 0) {
      setErrorMsg('Please enter a budget limit amount greater than 0');
      return;
    }

    const threshold = parseInt(alertThreshold, 10);
    if (isNaN(threshold) || threshold < 10 || threshold > 100) {
      setErrorMsg('Alert threshold must be between 10% and 100%');
      return;
    }

    setSubmitting(true);
    try {
      await saveBudget(limit, threshold);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update budget');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PiggyBank size={20} style={{ color: '#4f46e5' }} />
            <h3 className="modal-title">Configure Monthly Budget</h3>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errorMsg && (
              <div
                style={{
                  background: '#ffe4e6',
                  color: '#9f1239',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                  fontWeight: 500,
                }}
              >
                {errorMsg}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Month Target</label>
              <input
                type="text"
                className="form-control"
                value={currentMonth}
                disabled
                style={{ background: '#f8fafc', color: '#64748b' }}
              />
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Budget applies to the currently active month view
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Spending Limit ({currency})</label>
              <input
                type="number"
                step="1"
                min="1"
                className="form-control"
                placeholder="e.g. 2500"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <label className="form-label">
                  Warning Alert Threshold: <strong>{alertThreshold}%</strong>
                </label>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                className="form-control"
                style={{ padding: '0.2rem 0', cursor: 'pointer' }}
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(e.target.value)}
              />
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                SmartSpend will show a caution banner when your spending reaches {alertThreshold}% of your budget limit.
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-emerald-primary"
              disabled={submitting}
            >
              {submitting ? (
                <div className="spinner" style={{ width: '16px', height: '16px' }} />
              ) : (
                <Check size={16} />
              )}
              <span>Save Budget</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
