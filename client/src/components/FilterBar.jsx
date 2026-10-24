import React from 'react';
import { Search, Filter, RotateCcw, Calendar, ArrowUpDown, X } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const FilterBar = () => {
  const { filters, updateFilters, resetFilters, categories } = useFinance();

  const getMonthOptions = () => {
    const options = [];
    const date = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
      const yr = d.getFullYear();
      const mo = String(d.getMonth() + 1).padStart(2, '0');
      const val = `${yr}-${mo}`;
      const label = d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
      options.push({ val, label });
    }
    return options;
  };

  const monthOptions = getMonthOptions();

  return (
    <div className="filter-bar" id="transactions">
      {/* Top Row: Search and Type Pills */}
      <div className="filter-row-top">
        <div className="search-input-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by title, description or notes..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
          {filters.search && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => updateFilters({ search: '' })}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Emerald Type Toggle Group */}
        <div className="type-toggle-group">
          <button
            type="button"
            className={`type-toggle-btn ${filters.type === 'all' ? 'active' : ''}`}
            onClick={() => updateFilters({ type: 'all' })}
          >
            All Entries
          </button>
          <button
            type="button"
            className={`type-toggle-btn ${filters.type === 'expense' ? 'active' : ''}`}
            onClick={() => updateFilters({ type: 'expense' })}
          >
            Expenses
          </button>
          <button
            type="button"
            className={`type-toggle-btn ${filters.type === 'income' ? 'active' : ''}`}
            onClick={() => updateFilters({ type: 'income' })}
          >
            Incomes
          </button>
        </div>
      </div>

      {/* Bottom Row: Category, Month, Sort & Reset */}
      <div className="filter-row-bottom">
        {/* Category Select */}
        <div className="filter-select-group">
          <Filter size={14} className="text-muted" />
          <select
            className="filter-select"
            value={filters.category}
            onChange={(e) => updateFilters({ category: e.target.value })}
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Month Selector */}
        <div className="filter-select-group">
          <Calendar size={14} className="text-muted" />
          <select
            className="filter-select"
            value={filters.month}
            onChange={(e) => updateFilters({ month: e.target.value })}
          >
            <option value="">All Time</option>
            {monthOptions.map((opt) => (
              <option key={opt.val} value={opt.val}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Select */}
        <div className="filter-select-group">
          <ArrowUpDown size={14} className="text-muted" />
          <select
            className="filter-select"
            value={filters.sort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
          >
            <option value="date_desc">Date: Newest First</option>
            <option value="date_asc">Date: Oldest First</option>
            <option value="amount_desc">Amount: High to Low</option>
            <option value="amount_asc">Amount: Low to High</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        <button
          type="button"
          className="btn btn-secondary btn-sm reset-filter-btn"
          onClick={resetFilters}
          title="Reset all filters to current month defaults"
        >
          <RotateCcw size={13} />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
};
