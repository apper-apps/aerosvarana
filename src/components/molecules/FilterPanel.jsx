import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  categories = [],
  metals = [],
  priceRange = { min: 0, max: 500000 },
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handlePriceChange = (min, max) => {
    const newFilters = { ...localFilters, minPrice: min, maxPrice: max };
    setLocalFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    if (onFilterChange) {
      onFilterChange(emptyFilters);
    }
  };

  const activeFilterCount = Object.keys(localFilters).filter(key => 
    localFilters[key] && localFilters[key] !== ''
  ).length;

  return (
    <div className={className}>
      {/* Mobile Toggle Button */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          icon={isOpen ? "X" : "Filter"}
          className="w-full justify-center"
        >
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="primary" size="xs" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filter Content */}
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 768) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg border border-surface-200 p-6 space-y-6"
          >
            {/* Filter Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-secondary">Filters</h3>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-primary"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="font-medium text-secondary mb-3">Category</h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center space-x-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={localFilters.category === category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-4 h-4 text-primary border-surface-300 focus:ring-primary"
                    />
                    <span className="text-surface-700 group-hover:text-primary transition-colors">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Metal Filter */}
            <div>
              <h4 className="font-medium text-secondary mb-3">Metal</h4>
              <div className="space-y-2">
                {metals.map((metal) => (
                  <label
                    key={metal}
                    className="flex items-center space-x-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="metal"
                      value={metal}
                      checked={localFilters.metal === metal}
                      onChange={(e) => handleFilterChange('metal', e.target.value)}
                      className="w-4 h-4 text-primary border-surface-300 focus:ring-primary"
                    />
                    <span className="text-surface-700 group-hover:text-primary transition-colors">
                      {metal}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="font-medium text-secondary mb-3">Price Range</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm text-surface-600 mb-1">Min Price</label>
                    <input
                      type="number"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={localFilters.minPrice || priceRange.min}
                      onChange={(e) => handlePriceChange(parseInt(e.target.value), localFilters.maxPrice)}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-surface-600 mb-1">Max Price</label>
                    <input
                      type="number"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={localFilters.maxPrice || priceRange.max}
                      onChange={(e) => handlePriceChange(localFilters.minPrice, parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                
                {/* Price Range Slider Visual */}
                <div className="relative">
                  <div className="h-2 bg-surface-200 rounded-full">
                    <div 
                      className="h-2 bg-primary rounded-full"
                      style={{
                        marginLeft: `${((localFilters.minPrice || priceRange.min) / priceRange.max) * 100}%`,
                        width: `${(((localFilters.maxPrice || priceRange.max) - (localFilters.minPrice || priceRange.min)) / priceRange.max) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <h4 className="font-medium text-secondary mb-3">Sort By</h4>
              <select
                value={localFilters.sortBy || ''}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            {/* Mobile Apply Button */}
            <div className="md:hidden pt-4 border-t border-surface-200">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterPanel;