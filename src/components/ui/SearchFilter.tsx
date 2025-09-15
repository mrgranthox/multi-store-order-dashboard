import React, { useState, useCallback } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { cn } from '../../utils';

interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'date' | 'range' | 'checkbox' | 'text';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
  filterOptions: FilterOption[];
  placeholder?: string;
  className?: string;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  filterOptions,
  placeholder = 'Search...',
  className,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = useCallback((key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  }, [localFilters, onFilterChange]);

  const handleClearFilters = useCallback(() => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  }, [onFilterChange]);

  const handleApplyFilters = useCallback(() => {
    onFilterChange(localFilters);
    setIsFilterOpen(false);
  }, [localFilters, onFilterChange]);

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== null && value !== ''
  ).length;

  const renderFilterInput = (option: FilterOption) => {
    switch (option.type) {
      case 'select':
        return (
          <select
            value={localFilters[option.key] || ''}
            onChange={(e) => handleFilterChange(option.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All {option.label}</option>
            {option.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'date':
        return (
          <input
            type="date"
            value={localFilters[option.key] || ''}
            onChange={(e) => handleFilterChange(option.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'range':
        return (
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={localFilters[`${option.key}_min`] || ''}
              onChange={(e) => handleFilterChange(`${option.key}_min`, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={localFilters[`${option.key}_max`] || ''}
              onChange={(e) => handleFilterChange(`${option.key}_max`, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {option.options?.map((opt) => (
              <label key={opt.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters[option.key]?.includes(opt.value) || false}
                  onChange={(e) => {
                    const currentValues = localFilters[option.key] || [];
                    const newValues = e.target.checked
                      ? [...currentValues, opt.value]
                      : currentValues.filter((v: string) => v !== opt.value);
                    handleFilterChange(option.key, newValues);
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case 'text':
        return (
          <input
            type="text"
            placeholder={option.placeholder || `Filter by ${option.label}`}
            value={localFilters[option.key] || ''}
            onChange={(e) => handleFilterChange(option.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and Filter Bar */}
      <div className="flex items-center space-x-4">
        {/* Search Input */}
        <div className="flex-1 max-w-sm">
          <Input
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>

        {/* Filter Button */}
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            leftIcon={<Filter className="h-4 w-4" />}
            rightIcon={<ChevronDown className="h-4 w-4" />}
          >
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>

          {/* Filter Dropdown */}
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {filterOptions.map((option) => (
                  <div key={option.key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {option.label}
                    </label>
                    {renderFilterInput(option)}
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={handleApplyFilters}
                  className="w-full"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
          {Object.entries(filters).map(([key, value]) => {
            if (!value || value === '') return null;
            
            const option = filterOptions.find(opt => opt.key === key);
            if (!option) return null;

            let displayValue = value;
            if (Array.isArray(value)) {
              displayValue = value.join(', ');
            } else if (option.type === 'select' && option.options) {
              const selectedOption = option.options.find(opt => opt.value === value);
              displayValue = selectedOption?.label || value;
            }

            return (
              <span
                key={key}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              >
                {option.label}: {displayValue}
                <button
                  onClick={() => handleFilterChange(key, '')}
                  className="ml-2 hover:text-blue-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-red-600 hover:text-red-700"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};
