import React from 'react';
import { Menu, PlusCircle, PiggyBank, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';

export const Navbar = ({ onOpenSidebar, onOpenAddModal, onOpenBudgetModal }) => {
  const { user } = useAuth();
  const { filters } = useFinance();

  const formatMonth = (m) => {
    if (!m) return 'All Time';
    const [year, monthNum] = m.split('-');
    const date = new Date(year, parseInt(monthNum, 10) - 1, 1);
    return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  };

  return (
    <header className="top-header">
      <div className="top-header-left">
        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="btn-icon mobile-menu-toggle"
          onClick={onOpenSidebar}
          aria-label="Open sidebar menu"
        >
          <Menu size={20} />
        </button>

        {/* Brand indicator for mobile */}
        <div className="mobile-brand">
          <div className="brand-icon emerald-glow" style={{ width: '32px', height: '32px' }}>
            <Wallet size={16} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>
            Smart<span style={{ color: '#059669' }}>Spend</span>
          </span>
        </div>

        {/* Desktop Greeting & Subtitle */}
        <div className="desktop-greeting">
          <h1 className="greeting-title">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'there'} 👋
          </h1>
          <p className="greeting-subtitle">
            Overview for <strong>{formatMonth(filters.month)}</strong>
          </p>
        </div>
      </div>

      <div className="top-header-right">
        {/* Quick Set Budget Button */}
        <button
          type="button"
          className="btn btn-secondary btn-sm budget-header-btn"
          onClick={onOpenBudgetModal}
          title="Adjust Monthly Budget Target"
        >
          <PiggyBank size={16} className="text-emerald" />
          <span>Budget Target</span>
        </button>

        {/* Primary Add Transaction Button */}
        <button
          type="button"
          className="btn btn-emerald-primary btn-sm"
          onClick={onOpenAddModal}
        >
          <PlusCircle size={16} />
          <span>Add Transaction</span>
        </button>
      </div>
    </header>
  );
};
