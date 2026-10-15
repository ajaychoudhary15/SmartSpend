import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const NotificationToast = () => {
  const { toast, dismissToast } = useFinance();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'error':
        return <AlertCircle size={18} />;
      case 'info':
        return <Info size={18} />;
      default:
        return <CheckCircle2 size={18} />;
    }
  };

  return (
    <div className="toast-container">
      <div className={`toast ${toast.type || 'success'}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {getIcon()}
          <span>{toast.message}</span>
        </div>
        <button
          type="button"
          onClick={dismissToast}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            opacity: 0.8,
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
