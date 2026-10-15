import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { SummaryCards } from '../components/SummaryCards';
import { BudgetProgress } from '../components/BudgetProgress';
import { AnalyticsCharts } from '../components/AnalyticsCharts';
import { FilterBar } from '../components/FilterBar';
import { TransactionList } from '../components/TransactionList';
import { TransactionModal } from '../components/TransactionModal';
import { SetBudgetModal } from '../components/SetBudgetModal';
import { NotificationToast } from '../components/NotificationToast';
import { useFinance } from '../context/FinanceContext';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const Dashboard = () => {
  const { error, refreshFinanceData, loading } = useFinance();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txToEdit, setTxToEdit] = useState(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const handleOpenAddModal = () => {
    setTxToEdit(null);
    setIsTxModalOpen(true);
  };

  const handleEditTransaction = (tx) => {
    setTxToEdit(tx);
    setIsTxModalOpen(true);
  };

  const handleCloseTxModal = () => {
    setIsTxModalOpen(false);
    setTxToEdit(null);
  };

  return (
    <div className="dashboard-layout">
      {/* 1. Modern Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={handleOpenAddModal}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
      />

      {/* 2. Main Dashboard Content Column */}
      <div className="dashboard-main-area">
        {/* Top Header / Greeting Bar */}
        <Navbar
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenAddModal={handleOpenAddModal}
          onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        />

        <main className="dashboard-scrollable-content">
          {/* Global Error Banner */}
          {error && (
            <div className="global-error-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={refreshFinanceData}
                disabled={loading}
              >
                <RefreshCw size={14} className={loading ? 'spinner' : ''} />
                Retry
              </button>
            </div>
          )}

          {/* 1. Summary Cards (Balance, Income, Expense, Savings Rate) */}
          <SummaryCards />

          {/* 2. Monthly Budget Progress & Warnings */}
          <BudgetProgress onOpenBudgetModal={() => setIsBudgetModalOpen(true)} />

          {/* 3. Interactive Charts (Category Donut & Cash Flow Bar/Trend) */}
          <AnalyticsCharts />

          {/* 4. Filtering, Searching, and Sorting Bar */}
          <FilterBar />

          {/* 5. Polished Transaction Table */}
          <TransactionList
            onEditTransaction={handleEditTransaction}
            onOpenAddModal={handleOpenAddModal}
          />
        </main>
      </div>

      {/* Modals & Overlays */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={handleCloseTxModal}
        transactionToEdit={txToEdit}
      />

      <SetBudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
      />

      {/* Dynamic Toast Alerts */}
      <NotificationToast />
    </div>
  );
};
