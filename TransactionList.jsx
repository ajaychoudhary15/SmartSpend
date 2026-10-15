import React, { useState } from 'react';
import {
  Calendar,
  Edit2,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Utensils,
  Home,
  Zap,
  Car,
  HeartPulse,
  Film,
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Layers,
  Gift,
  Tag,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { EmptyState } from './EmptyState';

const CATEGORY_META = {
  'Food & Dining': { icon: Utensils, bg: '#ecfdf5', color: '#059669' },
  'Housing & Rent': { icon: Home, bg: '#eff6ff', color: '#2563eb' },
  'Utilities & Bills': { icon: Zap, bg: '#fef3c7', color: '#d97706' },
  'Transportation': { icon: Car, bg: '#f5f3ff', color: '#7c3aed' },
  'Healthcare & Fitness': { icon: HeartPulse, bg: '#ffe4e6', color: '#e11d48' },
  'Entertainment & Leisure': { icon: Film, bg: '#fae8ff', color: '#c026d3' },
  'Shopping & Groceries': { icon: ShoppingBag, bg: '#fdf2f8', color: '#db2777' },
  'Education': { icon: GraduationCap, bg: '#e0e7ff', color: '#4f46e5' },
  'Salary': { icon: Briefcase, bg: '#ecfdf5', color: '#059669' },
  'Freelance & Side Hustle': { icon: Layers, bg: '#f0fdfa', color: '#0d9488' },
  'Investments & Dividends': { icon: ArrowUpRight, bg: '#f0fdf4', color: '#16a34a' },
  'Gifts & Grants': { icon: Gift, bg: '#fff1f2', color: '#e11d48' },
  'Other': { icon: Tag, bg: '#f1f5f9', color: '#64748b' },
};

export const TransactionList = ({ onEditTransaction, onOpenAddModal }) => {
  const { transactions, loading, deleteTransaction } = useFinance();
  const { user } = useAuth();
  const currency = user?.currency || '₹';

  const [deletingId, setDeletingId] = useState(null);

  const formatMoney = (val) =>
    `${currency}${Number(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setDeletingId(id);
      try {
        await deleteTransaction(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="card tx-card-wrapper" style={{ padding: '3.5rem', textAlign: 'center' }}>
        <div className="spinner dark" style={{ width: '36px', height: '36px', margin: '0 auto 1rem' }} />
        <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
          Loading your financial transactions...
        </p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="card tx-card-wrapper">
        <EmptyState onAction={onOpenAddModal} />
      </div>
    );
  }

  return (
    <div className="card tx-card-wrapper">
      <div className="tx-header-bar">
        <div>
          <h3 className="tx-main-title">Transaction History</h3>
          <p className="tx-sub-title">
            Showing {transactions.length} record{transactions.length === 1 ? '' : 's'} matching current filters
          </p>
        </div>
      </div>

      <div className="table-container">
        <table className="tx-table">
          <thead>
            <tr>
              <th style={{ width: '45px' }}>Type</th>
              <th>Description</th>
              <th>Category</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
              <th style={{ textAlign: 'center', width: '90px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const isIncome = tx.type === 'income';
              const isDeleting = deletingId === tx._id;
              const meta = CATEGORY_META[tx.category] || CATEGORY_META['Other'];
              const CategoryIcon = meta.icon;

              return (
                <tr key={tx._id} className="tx-row" style={{ opacity: isDeleting ? 0.4 : 1 }}>
                  {/* Type Icon Indicator */}
                  <td>
                    <div
                      className={`tx-type-chip ${isIncome ? 'income' : 'expense'}`}
                      title={isIncome ? 'Inflow' : 'Outflow'}
                    >
                      {isIncome ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    </div>
                  </td>

                  {/* Title & Notes */}
                  <td>
                    <div className="tx-title-cell">
                      <span className="tx-title">{tx.title}</span>
                      {tx.notes && <span className="tx-notes">{tx.notes}</span>}
                    </div>
                  </td>

                  {/* Category Pill with Icon */}
                  <td>
                    <span
                      className="category-pill"
                      style={{ background: meta.bg, color: meta.color }}
                    >
                      <CategoryIcon size={13} style={{ marginRight: '5px', display: 'inline' }} />
                      {tx.category}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="tx-date-cell">
                    <Calendar size={13} style={{ marginRight: '4px', display: 'inline', color: '#94a3b8' }} />
                    {formatDate(tx.date)}
                  </td>

                  {/* Amount */}
                  <td style={{ textAlign: 'right' }}>
                    <span className={`tx-amount-badge ${isIncome ? 'income' : 'expense'}`}>
                      {isIncome ? '+' : '-'}
                      {formatMoney(tx.amount)}
                    </span>
                  </td>

                  {/* Action buttons */}
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => onEditTransaction(tx)}
                        title="Edit transaction"
                        disabled={isDeleting}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        className="btn-icon danger"
                        onClick={() => handleDelete(tx._id, tx.title)}
                        title="Delete transaction"
                        disabled={isDeleting}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
