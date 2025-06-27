import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorState from '@/components/molecules/ErrorState';
import customOrderService from '@/services/api/customOrderService';

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const orderData = await customOrderService.getById(id);
      setOrder(orderData);
    } catch (err) {
      setError(err.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'info';
      case 'awaiting_approval':
        return 'warning';
      case 'pending':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  const getMilestoneIcon = (milestoneName) => {
    switch (milestoneName?.toLowerCase()) {
      case 'order received':
        return 'FileText';
      case 'design sketch':
        return 'Brush';
      case 'wax model creation':
        return 'Box';
      case 'metal casting':
        return 'Flame';
      case 'stone setting':
        return 'Gem';
      case 'final polish':
        return 'Sparkles';
      case 'quality check':
        return 'Shield';
      case 'delivery':
        return 'Truck';
      default:
        return 'Circle';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Pending';
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-surface-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <ErrorState
          title="Order not found"
          message={error || "The order you're looking for doesn't exist."}
          actionLabel="Back to Orders"
          onAction={() => navigate('/my-orders')}
        />
      </div>
    );
  }

  const completedMilestones = order.milestones.filter(m => m.status === 'completed').length;
  const progressPercentage = (completedMilestones / order.milestones.length) * 100;

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/my-orders')}
                className="flex items-center text-surface-600 hover:text-primary transition-colors mb-4"
              >
                <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                Back to My Orders
              </button>
              
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-display font-bold text-secondary">
                  Order #{order.Id.toString().padStart(4, '0')}
                </h1>
                <Badge variant={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
              
              <p className="text-surface-600 mt-1">
                {order.specifications.type} • Ordered on {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {formatPrice(order.budget)}
              </div>
              {order.estimatedCompletion && (
                <p className="text-sm text-surface-500">
                  Est. Completion: {formatDate(order.estimatedCompletion)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Timeline */}
          <div className="lg:col-span-2">
            {/* Progress Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-secondary">Progress Overview</h2>
                <span className="text-sm text-surface-600">
                  {completedMilestones} of {order.milestones.length} completed
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative mb-6">
                <div className="h-3 bg-surface-200 rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-3 bg-gradient-to-r from-primary to-secondary rounded-full"
                  />
                </div>
                <span className="absolute -top-8 right-0 text-sm font-medium text-primary">
                  {Math.round(progressPercentage)}%
                </span>
              </div>

              <p className="text-surface-600">
                Current Stage: <span className="font-medium text-secondary">{order.currentMilestone}</span>
              </p>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-secondary mb-6">Order Timeline</h2>

              <div className="space-y-6">
                {order.milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex items-start space-x-4"
                  >
                    {/* Timeline Line */}
                    {index < order.milestones.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-16 bg-surface-200"></div>
                    )}

                    {/* Milestone Icon */}
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center border-2 z-10
                      ${milestone.status === 'completed'
                        ? 'bg-success border-success text-white'
                        : milestone.status === 'in_progress'
                        ? 'bg-info border-info text-white animate-pulse'
                        : milestone.status === 'awaiting_approval'
                        ? 'bg-warning border-warning text-white'
                        : 'bg-white border-surface-300 text-surface-400'
                      }
                    `}>
                      <ApperIcon name={getMilestoneIcon(milestone.name)} className="w-5 h-5" />
                    </div>

                    {/* Milestone Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-secondary">{milestone.name}</h3>
                        <span className="text-sm text-surface-500">
                          {formatDate(milestone.date)}
                        </span>
                      </div>

                      {milestone.notes && (
                        <p className="text-surface-600 text-sm mb-3">{milestone.notes}</p>
                      )}

                      {/* Milestone Images */}
                      {milestone.images && milestone.images.length > 0 && (
                        <div className="flex space-x-2 mb-3">
                          {milestone.images.map((image, imgIndex) => (
                            <button
                              key={imgIndex}
                              onClick={() => setSelectedImage(image)}
                              className="w-20 h-20 rounded-lg overflow-hidden border border-surface-200 hover:border-primary transition-colors"
                            >
                              <img
                                src={image}
                                alt={`${milestone.name} progress`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Status Badge */}
                      <Badge variant={getStatusColor(milestone.status)} size="xs">
                        {milestone.status === 'completed' ? 'Completed' :
                         milestone.status === 'in_progress' ? 'In Progress' :
                         milestone.status === 'awaiting_approval' ? 'Awaiting Approval' : 'Pending'}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="font-semibold text-secondary mb-4">Order Details</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-surface-600">Jewelry Type:</span>
                  <span className="text-secondary font-medium">{order.specifications.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Metal:</span>
                  <span className="text-secondary font-medium">{order.specifications.metal}</span>
                </div>
                {order.specifications.gemstones?.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-surface-600">Gemstones:</span>
                    <span className="text-secondary font-medium">
                      {order.specifications.gemstones.join(', ')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-surface-600">Occasion:</span>
                  <span className="text-secondary font-medium">{order.specifications.occasion}</span>
                </div>
                {order.specifications.style && (
                  <div className="flex justify-between">
                    <span className="text-surface-600">Style:</span>
                    <span className="text-secondary font-medium">{order.specifications.style}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-surface-600">Budget:</span>
                  <span className="text-secondary font-medium">{formatPrice(order.budget)}</span>
                </div>
              </div>

              {order.specifications.notes && (
                <div className="mt-4 pt-4 border-t border-surface-200">
                  <h4 className="text-sm font-medium text-secondary mb-2">Special Notes</h4>
                  <p className="text-sm text-surface-600">{order.specifications.notes}</p>
                </div>
              )}
            </motion.div>

            {/* Designer Info */}
            {order.designerName && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h3 className="font-semibold text-secondary mb-4">Your Designer</h3>
                
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-secondary">{order.designerName}</h4>
                    <p className="text-sm text-surface-600">Master Craftsman</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  icon="MessageCircle"
                >
                  Contact Designer
                </Button>
              </motion.div>
            )}

            {/* Reference Images */}
            {order.referenceImages && order.referenceImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h3 className="font-semibold text-secondary mb-4">Reference Images</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {order.referenceImages.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className="aspect-square rounded-lg overflow-hidden border border-surface-200 hover:border-primary transition-colors"
                    >
                      <img
                        src={image}
                        alt={`Reference ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
                
                {order.referenceImages.length > 4 && (
                  <p className="text-sm text-surface-500 mt-3 text-center">
                    +{order.referenceImages.length - 4} more images
                  </p>
                )}
              </motion.div>
            )}

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="font-semibold text-secondary mb-4">Actions</h3>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  icon="Download"
                >
                  Download Invoice
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  icon="Share"
                >
                  Share Progress
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  icon="HelpCircle"
                >
                  Need Help?
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-4xl max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage}
                  alt="Progress"
                  className="w-full h-full object-contain rounded-lg"
                />
                
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
                />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderTracking;