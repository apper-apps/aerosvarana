import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({
  icon = 'Package',
  title = 'No items found',
  description = 'We couldn\'t find any items matching your criteria.',
  actionLabel,
  onAction,
  illustration,
  className = ''
}) => {
  const iconVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
    >
      {/* Icon or Illustration */}
      <motion.div
        variants={iconVariants}
        animate="animate"
        className="mb-6"
      >
        {illustration ? (
          <img src={illustration} alt="" className="w-32 h-32 opacity-60" />
        ) : (
          <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center">
            <ApperIcon name={icon} className="w-10 h-10 text-surface-400" />
          </div>
        )}
      </motion.div>

      {/* Content */}
      <div className="max-w-md">
        <h3 className="text-xl font-semibold text-secondary mb-2">
          {title}
        </h3>
        <p className="text-surface-600 mb-6 leading-relaxed">
          {description}
        </p>

        {/* Action Button */}
        {actionLabel && onAction && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="primary"
              onClick={onAction}
              className="shadow-lg"
            >
              {actionLabel}
            </Button>
          </motion.div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-secondary/20 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-accent/10 rounded-full animate-pulse"></div>
      </div>
    </motion.div>
  );
};

export default EmptyState;