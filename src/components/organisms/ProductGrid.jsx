import { motion } from 'framer-motion';
import ProductCard from '@/components/molecules/ProductCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';

const ProductGrid = ({ 
  products, 
  loading = false, 
  error = null,
  emptyStateProps = {},
  className = '' 
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        <SkeletonLoader type="card" count={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-full">
        <EmptyState
          icon="AlertTriangle"
          title="Failed to load products"
          description={error}
          actionLabel="Retry"
          onAction={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="col-span-full">
        <EmptyState
          icon="Search"
          title="No products found"
          description="We couldn't find any products matching your criteria. Try adjusting your filters or search terms."
          actionLabel="Clear Filters"
          {...emptyStateProps}
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
    >
      {products.map((product) => (
        <motion.div
          key={product.Id}
          variants={itemVariants}
          layout
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductGrid;