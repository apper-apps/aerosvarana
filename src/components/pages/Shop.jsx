import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import productService from "@/services/api/productService";
import designerService from "@/services/api/designerService";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import FilterPanel from "@/components/molecules/FilterPanel";
import ProductGrid from "@/components/organisms/ProductGrid";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [metals, setMetals] = useState([]);
  const [designers, setDesigners] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 });
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filters, searchTerm]);

const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [productsData, categoriesData, metalsData, priceRangeData, designersData] = await Promise.all([
        productService.getAll(),
        productService.getCategories(),
        productService.getMetalTypes(),
        productService.getPriceRange(),
        designerService.getAll()
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
      setMetals(metalsData);
      setPriceRange(priceRangeData);
      setDesigners(designersData);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      const searchFilters = {
        ...filters,
        search: searchTerm
      };
      
      const filtered = await productService.getAll(searchFilters);
      setFilteredProducts(filtered);
    } catch (err) {
      setError(err.message || 'Failed to filter products');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const activeFilterCount = Object.keys(filters).filter(key => 
    filters[key] && filters[key] !== ''
  ).length + (searchTerm ? 1 : 0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary mb-4">
              Exquisite Jewelry Collection
            </h1>
<p className="text-lg text-surface-600 max-w-2xl mx-auto">
              Discover our curated selection of traditional and contemporary jewelry, 
              crafted with precision and artistry by master designers.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search for jewelry, gemstones, or metals..."
            />
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
<FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                categories={categories}
                metals={metals}
                designers={designers}
                priceRange={priceRange}
              />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              {/* Results Info */}
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-secondary">
                  {loading ? 'Loading...' : `${filteredProducts.length} Products`}
                </h2>
                
                {activeFilterCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="primary" size="sm">
                      {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-primary hover:text-primary/80"
                    >
                      Clear all
                    </Button>
                  </div>
                )}
              </div>

              {/* View Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  icon="Grid3X3"
                  onClick={() => setViewMode('grid')}
                />
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  icon="List"
                  onClick={() => setViewMode('list')}
                />
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || Object.keys(filters).some(key => filters[key])) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2 mb-6 p-4 bg-white rounded-lg border border-surface-200"
              >
                <span className="text-sm font-medium text-surface-600">Active filters:</span>
                
                {searchTerm && (
                  <Badge variant="primary" className="flex items-center gap-1">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm('')}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <ApperIcon name="X" className="w-3 h-3" />
                    </button>
                  </Badge>
                )}

                {Object.entries(filters).map(([key, value]) => {
                  if (!value) return null;
                  
                  let displayValue = value;
                  if (key === 'minPrice' || key === 'maxPrice') {
                    displayValue = formatPrice(value);
                  }
                  
                  return (
                    <Badge key={key} variant="secondary" className="flex items-center gap-1">
                      {key}: {displayValue}
                      <button
                        onClick={() => handleFilterChange({ ...filters, [key]: '' })}
                        className="hover:bg-secondary/20 rounded-full p-0.5"
                      >
                        <ApperIcon name="X" className="w-3 h-3" />
                      </button>
                    </Badge>
                  );
                })}
              </motion.div>
            )}

            {/* Products Grid */}
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              error={error}
              emptyStateProps={{
                title: searchTerm || activeFilterCount > 0 
                  ? 'No products match your search' 
                  : 'No products available',
                description: searchTerm || activeFilterCount > 0
                  ? 'Try adjusting your filters or search terms to find what you\'re looking for.'
                  : 'Check back soon for new arrivals.',
                actionLabel: activeFilterCount > 0 ? 'Clear Filters' : undefined,
                onAction: activeFilterCount > 0 ? clearAllFilters : undefined
              }}
            />
          </main>
        </div>
      </div>

      {/* Featured Categories */}
      {!loading && !error && filteredProducts.length === 0 && !searchTerm && activeFilterCount === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-secondary mb-4">
              Explore Our Categories
            </h2>
            <p className="text-surface-600">
              Discover jewelry for every occasion and style preference
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleFilterChange({ category })}
                className="group p-6 bg-white rounded-xl border border-surface-200 hover:border-primary transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <ApperIcon 
                    name={
                      category === 'Necklaces' ? 'Heart' :
                      category === 'Earrings' ? 'Circle' :
                      category === 'Rings' ? 'Circle' :
                      category === 'Bracelets' ? 'Circle' :
                      'Gem'
                    } 
                    className="w-8 h-8 text-primary" 
                  />
                </div>
                <h3 className="font-medium text-secondary group-hover:text-primary transition-colors">
                  {category}
                </h3>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;