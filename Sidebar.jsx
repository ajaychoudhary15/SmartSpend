import React, { useState } from 'react';
import {
  LayoutDashboard,
  Receipt,
  PieChart as ChartIcon,
  PiggyBank,
  PlusCircle,
  LogOut,
  Wallet,
  ChevronDown,
  X,
  CreditCard,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenBudgetModal,
}) => {
  const { user, logout, updateUserCurrency } = useAuth();
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);

  const currencies = ['₹', '$', '€', '£', '¥', 'C$'];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'budget', label: 'Monthly Budget', icon: PiggyBank },
    { id: 'analytics', label: 'Analytics', icon: ChartIcon },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (id === 'budget') {
      onOpenBudgetModal();
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    if (onClose) onClose();
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="brand-logo">
            <div className="brand-icon emerald-glow">
              <Wallet size={20} />
            </div>
            <div className="brand-text">
              Smart<span className="text-emerald">Spend</span>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              className="btn-icon sidebar-close-btn"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Quick Action Primary Button */}
        <div className="sidebar-action-wrap">
          <button
            type="button"
            className="btn btn-emerald-primary btn-full"
            onClick={() => {
              onOpenAddModal();
              if (onClose) onClose();
            }}
          >
            <PlusCircle size={18} />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          <div className="nav-group-title">Navigation</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={18} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {isActive && <div className="active-pill-indicator" />}
              </button>
            );
          })}
        </nav>

        {/* Currency & Quick Stats widget */}
        <div className="sidebar-widget">
          <div className="widget-header">
            <span className="widget-title">Active Currency</span>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="currency-pill-btn"
                onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
                title="Change active currency"
              >
                <span>{user?.currency || '₹'}</span>
                <ChevronDown size={12} />
              </button>
              {showCurrencyMenu && (
                <div className="currency-popover">
                  {currencies.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`currency-popover-item ${
                        user?.currency === c ? 'active' : ''
                      }`}
                      onClick={() => {
                        updateUserCurrency(c);
                        setShowCurrencyMenu(false);
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="widget-caption">
            All amounts & charts reflect this symbol.
          </div>
        </div>

        {/* User Profile & Logout Section at Bottom */}
        <div className="sidebar-footer">
          <div className="user-profile-card">
            <div className="user-avatar-emerald">
              {getInitials(user?.name)}
            </div>
            <div className="user-info">
              <span className="user-display-name">{user?.name || 'User'}</span>
              <span className="user-email-caption">{user?.email || ''}</span>
            </div>
            <button
              type="button"
              className="btn-icon danger logout-btn"
              onClick={logout}
              title="Log out of SmartSpend"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
