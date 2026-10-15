import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Check, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';

export const TransactionModal = ({ isOpen, onClose, transactionToEdit }) => {
  const { addTransaction, updateTransaction, categories } = useFinance();
  const { user } = useAuth();
  const currency = user?.currency || '$';

  const [type, setType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const isEditing = Boolean(transactionToEdit);

  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type || 'expense');
      setTitle(transactionToEdit.title || '');
      setAmount(transactionToEdit.amount ? String(transactionToEdit.amount) : '');
      setCategory(transactionToEdit.category || 'Other');
      setDate(
        transactionToEdit.date
          ? new Date(transactionToEdit.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      );
      setNotes(transactionToEdit.notes || '');
    } else {
      setType('expense');
      setTitle('');
      setAmount('');
      setCategory('Food & Dining');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
    setFormError('');
  }, [transactionToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Please enter a transaction title');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setFormError('Please enter a valid amount greater than 0');
      return;
    }

    if (!date) {
      setFormError('Please select a valid date');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        amount: numAmount,
        type,
        category: category || 'Other',
        date,
        notes: notes.trim(),
      };

      if (isEditing) {
        await updateTransaction(transactionToEdit._id, payload);
      } else {
        await addTransaction(payload);
      }
      onClose();
    } catch (err) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {isEditing ? 'Edit Transaction' : 'Record New Transaction'}
          </h3>
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
            {formError && (
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
                {formError}
              </div>
            )}

            {/* Type Switcher */}
            <div className="form-group">
              <label className="form-label">Transaction Type</label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  style={{
                    padding: '0.65rem',
                    borderRadius: '8px',
                    border: '2px solid',
                    borderColor: type === 'expense' ? '#f43f5e' : '#e2e8f0',
                    background: type === 'expense' ? '#fff1f2' : '#ffffff',
                    color: type === 'expense' ? '#e11d48' : '#64748b',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                  }}
                >
                  <ArrowDownRight size={18} /> Expense
                </button>

                <button
                  type="button"
                  onClick={() => setType('income')}
                  style={{
                    padding: '0.65rem',
                    borderRadius: '8px',
                    border: '2px solid',
                    borderColor: type === 'income' ? '#10b981' : '#e2e8f0',
                    background: type === 'income' ? '#ecfdf5' : '#ffffff',
                    color: type === 'income' ? '#059669' : '#64748b',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                  }}
                >
                  <ArrowUpRight size={18} /> Income
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="form-group">
              <label className="form-label">Title / Description</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Grocery store, Salary payout, Electricity bill"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={100}
              />
            </div>

            {/* Amount and Category 2-Column Grid */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Amount ({currency})</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="form-control"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Notes */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Notes (Optional)</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="Add any additional details or receipts reference..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={500}
              />
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
              <span>{isEditing ? 'Save Changes' : 'Add Transaction'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
