import { motion } from 'framer-motion';

const SkeletonLoader = ({ 
  type = 'card', 
  count = 1, 
  className = '' 
}) => {
  const shimmerVariants = {
    initial: { backgroundPosition: '-200px 0' },
    animate: { 
      backgroundPosition: 'calc(200px + 100%) 0',
      transition: {
        duration: 1.5,
        ease: 'linear',
        repeat: Infinity
      }
    }
  };

  const skeletonBase = `
    bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200
    bg-[length:200px_100%] animate-pulse
  `;

  const renderCardSkeleton = () => (
    <div className="bg-white rounded-xl overflow-hidden shadow-md">
      {/* Image Skeleton */}
      <motion.div
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        className={`aspect-square ${skeletonBase}`}
      />
      
      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <motion.div
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            className={`h-4 w-16 rounded ${skeletonBase}`}
          />
          <motion.div
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            className={`h-4 w-12 rounded ${skeletonBase}`}
          />
        </div>
        
        <motion.div
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          className={`h-6 w-3/4 rounded ${skeletonBase}`}
        />
        
        <div className="flex gap-2">
          <motion.div
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            className={`h-6 w-16 rounded-full ${skeletonBase}`}
          />
          <motion.div
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            className={`h-6 w-20 rounded-full ${skeletonBase}`}
          />
        </div>
        
        <motion.div
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          className={`h-8 w-24 rounded ${skeletonBase}`}
        />
        
        <div className="flex gap-2">
          <motion.div
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            className={`h-10 flex-1 rounded-lg ${skeletonBase}`}
          />
          <motion.div
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            className={`h-10 w-12 rounded-lg ${skeletonBase}`}
          />
        </div>
      </div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className="bg-white rounded-lg border border-surface-200 p-4">
      <div className="flex items-center space-x-4">
        <motion.div
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          className={`w-16 h-16 rounded-lg ${skeletonBase}`}
        />
        <div className="flex-1 space-y-2">
          <motion.div
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            className={`h-5 w-3/4 rounded ${skeletonBase}`}
          />
          <motion.div
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            className={`h-4 w-1/2 rounded ${skeletonBase}`}
          />
        </div>
        <motion.div
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          className={`h-8 w-20 rounded ${skeletonBase}`}
        />
      </div>
    </div>
  );

  const renderTableSkeleton = () => (
    <div className="bg-white rounded-lg border border-surface-200 overflow-hidden">
      {/* Table Header */}
      <div className="border-b border-surface-200 p-4">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((col) => (
            <motion.div
              key={col}
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              className={`h-5 flex-1 rounded ${skeletonBase}`}
            />
          ))}
        </div>
      </div>
      
      {/* Table Rows */}
      {Array.from({ length: 3 }).map((_, rowIndex) => (
        <div key={rowIndex} className="border-b border-surface-200 p-4">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((col) => (
              <motion.div
                key={col}
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                className={`h-4 flex-1 rounded ${skeletonBase}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'list':
        return renderListSkeleton();
      case 'table':
        return renderTableSkeleton();
      default:
        return renderCardSkeleton();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;