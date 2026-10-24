import React from 'react';
import { ReceiptText, PlusCircle } from 'lucide-react';

export const EmptyState = ({ onAction, message, subtext }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon-wrap">
        <ReceiptText size={32} />
      </div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem', color: '#0f172a' }}>
        {message || 'No transactions found'}
      </h3>
      <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
        {subtext || 'Try adjusting your search filters or start recording new income and expenses.'}
      </p>
      {onAction && (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          <PlusCircle size={16} /> Add Transaction
        </button>
      )}
    </div>
  );
};
