import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  PiggyBank,
  Edit3,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';

export const BudgetProgress = ({ onOpenBudgetModal }) => {
  const { budget } = useFinance();
  const { user } = useAuth();
  const currency = user?.currency || '₹';

  const {
    month,
    monthlyLimit = 0,
    spent = 0,
    remaining = 0,
    percentageUsed = 0,
    status = 'no_budget',
    hasBudgetSet = false,
  } = budget || {};

  const formatMonth = (m) => {
    if (!m) return '';
    const [year, monthNum] = m.split('-');
    const date = new Date(year, parseInt(monthNum, 10) - 1, 1);
    return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  };

  const formatMoney = (val) => {
    return `${currency}${Number(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const cappedPercentage = Math.min(percentageUsed, 100);

  if (!hasBudgetSet) {
    return (
      <div className="card budget-card no-budget" id="budget">
        <div className="budget-header">
          <div className="budget-title-area">
            <div className="budget-icon-circle emerald-subtle">
              <PiggyBank size={22} className="text-emerald" />
            </div>
            <div>
              <h3 className="budget-heading">
                Monthly Spending Budget ({formatMonth(month)})
              </h3>
              <p className="budget-subheading">
                Set a monthly budget to keep expenses within your financial targets.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-emerald-primary btn-sm"
            onClick={onOpenBudgetModal}
          >
            <Edit3 size={14} /> Set Budget Target
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`card budget-card ${status}`} id="budget">
      <div className="budget-header">
        <div className="budget-title-area">
          <div
            className={`budget-icon-circle ${
              status === 'exceeded'
                ? 'rose-subtle'
                : status === 'warning'
                ? 'amber-subtle'
                : 'emerald-subtle'
            }`}
          >
            <PiggyBank
              size={22}
              style={{
                color:
                  status === 'exceeded'
                    ? '#f43f5e'
                    : status === 'warning'
                    ? '#f59e0b'
                    : '#059669',
              }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h3 className="budget-heading">
                Budget for {formatMonth(month)}
              </h3>
              <span className={`budget-badge ${status}`}>
                {status === 'safe' && <CheckCircle2 size={13} />}
                {status === 'warning' && <AlertTriangle size={13} />}
                {status === 'exceeded' && <AlertCircle size={13} />}
                {status === 'safe'
                  ? 'ON TRACK'
                  : status === 'warning'
                  ? 'BUDGET WARNING'
                  : 'BUDGET EXCEEDED'}
              </span>
            </div>
            <p className="budget-subheading">
              Monthly target limit: <strong>{formatMoney(monthlyLimit)}</strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onOpenBudgetModal}
        >
          <Edit3 size={14} /> Adjust Budget
        </button>
      </div>

      {/* Warning Notice if warning or exceeded */}
      {status === 'warning' && (
        <div className="budget-alert-box warning">
          <AlertTriangle size={16} />
          <span>
            <strong>Caution:</strong> You have consumed {percentageUsed}% of your budget limit. Only {formatMoney(remaining)} remaining this month.
          </span>
        </div>
      )}

      {status === 'exceeded' && (
        <div className="budget-alert-box exceeded">
          <AlertCircle size={16} />
          <span>
            <strong>Warning:</strong> You exceeded your monthly budget by {formatMoney(Math.abs(remaining))} ({percentageUsed}% consumed)!
          </span>
        </div>
      )}

      {/* Progress Bar Track */}
      <div className="progress-track" title={`${percentageUsed}% used`}>
        <div
          className={`progress-fill ${status}`}
          style={{ width: `${cappedPercentage}%` }}
        />
      </div>

      {/* Stats bottom row */}
      <div className="budget-stats-row">
        <span>
          Spent: <strong>{formatMoney(spent)}</strong> ({percentageUsed}%)
        </span>
        <span>
          {remaining >= 0 ? (
            <>
              Remaining:{' '}
              <strong className="text-emerald">{formatMoney(remaining)}</strong>
            </>
          ) : (
            <>
              Over Limit:{' '}
              <strong className="text-rose">{formatMoney(Math.abs(remaining))}</strong>
            </>
          )}
        </span>
      </div>
    </div>
  );
};
