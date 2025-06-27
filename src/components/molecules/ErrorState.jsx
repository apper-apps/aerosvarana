import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({
  title = 'Something went wrong',
  message = 'We encountered an unexpected error. Please try again.',
  onRetry,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
    >
      {/* Error Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-6"
      >
        <ApperIcon name="AlertTriangle" className="w-10 h-10 text-error" />
      </motion.div>

      {/* Content */}
      <div className="max-w-md">
        <h3 className="text-xl font-semibold text-secondary mb-2">
          {title}
        </h3>
        <p className="text-surface-600 mb-6 leading-relaxed">
          {message}
        </p>

        {/* Retry Button */}
        {onRetry && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="primary"
              onClick={onRetry}
              icon="RefreshCw"
              className="shadow-lg"
            >
              Try Again
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ErrorState;