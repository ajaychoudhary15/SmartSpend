import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { PieChart as PieIcon, BarChart3, LineChart as TrendIcon } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';

const CATEGORY_COLORS = [
  '#059669', // Emerald
  '#6366f1', // Indigo
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#f97316', // Orange
  '#14b8a6', // Teal
  '#10b981', // Mint
  '#64748b', // Slate
];

export const AnalyticsCharts = () => {
  const { stats } = useFinance();
  const { user } = useAuth();
  const currency = user?.currency || '₹';

  const [flowView, setFlowView] = useState('bar'); // 'bar' | 'area'

  const categoryData = stats?.categoryBreakdown || [];
  const monthlyTrends = stats?.monthlyTrends || [];

  const formatMoney = (val) =>
    `${currency}${Number(val).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;

  // Custom tooltip for Pie Chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-custom-tooltip">
          <p className="tooltip-title">{data.category}</p>
          <p className="tooltip-amount text-emerald">
            {formatMoney(data.total)} ({data.percentage}%)
          </p>
          <p className="tooltip-sub">{data.count} transaction{data.count === 1 ? '' : 's'}</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for Bar / Area charts
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-custom-tooltip">
          <p className="tooltip-title">{label}</p>
          {payload.map((entry, index) => (
            <p
              key={`item-${index}`}
              style={{
                color: entry.color,
                fontWeight: 600,
                fontSize: '0.8125rem',
                margin: '0.2rem 0',
              }}
            >
              {entry.name}: {formatMoney(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="charts-grid" id="analytics">
      {/* 1. Category Expense Breakdown Card */}
      <div className="card chart-card">
        <div className="chart-card-header">
          <div className="chart-title">
            <div className="chart-icon-box emerald">
              <PieIcon size={18} />
            </div>
            <span>Expense by Category</span>
          </div>
          <span className="chart-badge">
            {categoryData.length} active {categoryData.length === 1 ? 'category' : 'categories'}
          </span>
        </div>

        <div className="chart-container">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={290}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="46%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(val) => (
                    <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 500 }}>
                      {val}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-empty-state">
              <PieIcon size={36} />
              <p>No expense transactions found for this period</p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Monthly Cash Flow & Trend Card */}
      <div className="card chart-card">
        <div className="chart-card-header">
          <div className="chart-title">
            <div className="chart-icon-box indigo">
              <BarChart3 size={18} />
            </div>
            <span>Cash Flow Trends</span>
          </div>

          <div className="type-toggle-group">
            <button
              type="button"
              className={`type-toggle-btn ${flowView === 'bar' ? 'active' : ''}`}
              onClick={() => setFlowView('bar')}
              title="Bar comparison"
            >
              <BarChart3 size={13} style={{ marginRight: '4px', display: 'inline' }} />
              Bars
            </button>
            <button
              type="button"
              className={`type-toggle-btn ${flowView === 'area' ? 'active' : ''}`}
              onClick={() => setFlowView('area')}
              title="Net savings area trend"
            >
              <TrendIcon size={13} style={{ marginRight: '4px', display: 'inline' }} />
              Trend
            </button>
          </div>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={290}>
            {flowView === 'bar' ? (
              <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(val) => (
                    <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 500 }}>
                      {val}
                    </span>
                  )}
                />
                <Bar dataKey="income" name="Inflow" fill="#059669" radius={[5, 5, 0, 0]} maxBarSize={30} />
                <Bar dataKey="expense" name="Outflow" fill="#f43f5e" radius={[5, 5, 0, 0]} maxBarSize={30} />
              </BarChart>
            ) : (
              <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="emeraldSavingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(val) => (
                    <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 500 }}>
                      {val}
                    </span>
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="savings"
                  name="Net Savings"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#emeraldSavingsGrad)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
