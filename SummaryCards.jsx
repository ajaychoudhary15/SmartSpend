import React from 'react';
import {
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  PiggyBank,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';

export const SummaryCards = () => {
  const { stats } = useFinance();
  const { user } = useAuth();
  const currency = user?.currency || '₹';

  const { totalIncome = 0, totalExpense = 0, netBalance = 0, savingsRate = 0 } =
    stats?.summary || {};

  const formatMoney = (val) => {
    return `${currency}${Number(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const isPositiveBalance = netBalance >= 0;

  return (
    <div className="summary-grid" id="dashboard">
      {/* 1. Net Balance Card */}
      <div className={`card summary-card balance-card ${isPositiveBalance ? 'is-positive' : 'is-negative'}`}>
        <div className="summary-card-header">
          <div className="summary-title-wrap">
            <span className="summary-card-title">Net Balance</span>
            <span className={`status-pill ${isPositiveBalance ? 'pill-emerald' : 'pill-rose'}`}>
              {isPositiveBalance ? 'Surplus' : 'Deficit'}
            </span>
          </div>
          <div className={`summary-icon-box ${isPositiveBalance ? 'balance-positive' : 'balance-negative'}`}>
            <Wallet size={20} />
          </div>
        </div>
        <div className="summary-amount-row">
          <div className={`summary-amount ${isPositiveBalance ? 'text-slate' : 'text-rose'}`}>
            {netBalance < 0 && '-'}
            {formatMoney(Math.abs(netBalance))}
          </div>
        </div>
        <div className="summary-footer">
          <span>Income minus overall expenses</span>
        </div>
      </div>

      {/* 2. Total Income Card */}
      <div className="card summary-card income-card">
        <div className="summary-card-header">
          <div className="summary-title-wrap">
            <span className="summary-card-title">Total Inflow</span>
            <span className="status-pill pill-emerald">Earned</span>
          </div>
          <div className="summary-icon-box income">
            <ArrowUpRight size={20} />
          </div>
        </div>
        <div className="summary-amount-row">
          <div className="summary-amount text-emerald">
            +{formatMoney(totalIncome)}
          </div>
        </div>
        <div className="summary-footer">
          <span className="text-emerald font-semibold">Active revenues & deposits</span>
        </div>
      </div>

      {/* 3. Total Expenses Card */}
      <div className="card summary-card expense-card">
        <div className="summary-card-header">
          <div className="summary-title-wrap">
            <span className="summary-card-title">Total Spending</span>
            <span className="status-pill pill-rose">Outflow</span>
          </div>
          <div className="summary-icon-box expense">
            <ArrowDownRight size={20} />
          </div>
        </div>
        <div className="summary-amount-row">
          <div className="summary-amount text-rose">
            -{formatMoney(totalExpense)}
          </div>
        </div>
        <div className="summary-footer">
          <span className="text-rose font-semibold">Overall monthly outflow</span>
        </div>
      </div>

      {/* 4. Savings Rate Card */}
      <div className="card summary-card savings-card">
        <div className="summary-card-header">
          <div className="summary-title-wrap">
            <span className="summary-card-title">Savings Rate</span>
            <span className="status-pill pill-amber">Retained</span>
          </div>
          <div className="summary-icon-box savings">
            <PiggyBank size={20} />
          </div>
        </div>
        <div className="summary-amount-row">
          <div className="summary-amount text-amber">
            {savingsRate}%
          </div>
        </div>
        <div className="summary-footer">
          <span>{totalIncome > 0 ? 'Retained capital proportion' : 'No income recorded yet'}</span>
        </div>
      </div>
    </div>
  );
};
