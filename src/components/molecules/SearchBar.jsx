import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search jewelry...",
  className = '' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`relative ${className}`}
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400">
          <ApperIcon name="Search" className="w-5 h-5" />
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={`
            w-full pl-12 pr-12 py-3 text-base border-2 rounded-xl
            transition-all duration-200 bg-white
            ${focused
              ? 'border-primary shadow-lg shadow-primary/10'
              : 'border-surface-200 hover:border-surface-300'
            }
            focus:outline-none focus:ring-0
            placeholder:text-surface-400
          `}
        />

        {/* Clear Button */}
        {searchTerm && (
          <motion.button
            type="button"
            onClick={handleClear}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* Search Suggestions */}
      {focused && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-surface-200 shadow-lg z-10"
        >
          <div className="p-4">
            <h4 className="text-sm font-medium text-surface-700 mb-2">Popular Searches</h4>
            <div className="space-y-2">
              {['Gold Necklace', 'Diamond Rings', 'Temple Jewelry', 'Kundan Earrings'].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setSearchTerm(suggestion);
                    if (onSearch) onSearch(suggestion);
                  }}
                  className="flex items-center w-full p-2 text-sm text-surface-600 hover:bg-surface-50 rounded-md transition-colors"
                >
                  <ApperIcon name="Clock" className="w-4 h-4 mr-3 text-surface-400" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.form>
  );
};

export default SearchBar;