import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import customOrderService from '@/services/api/customOrderService';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

const loadOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if user is admin to show all orders or user-specific orders
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const isAdmin = currentUser.role === 'admin';
      
      if (isAdmin) {
        // Admin sees all orders
        const ordersData = await customOrderService.getAll();
        setOrders(ordersData);
      } else {
        // Regular users see only their orders
        const ordersData = await customOrderService.getAll({ customerId: currentUser.id || 'CUST001' });
        setOrders(ordersData);
      }
    } catch (err) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'info';
      case 'design approval':
        return 'warning';
      case 'order received':
        return 'secondary';
      default:
        return 'primary';
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
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status.toLowerCase().includes(filter.toLowerCase());
  });

  const filterOptions = [
    { value: 'all', label: 'All Orders', count: orders.length },
    { value: 'in progress', label: 'In Progress', count: orders.filter(o => o.status.toLowerCase().includes('progress')).length },
    { value: 'completed', label: 'Completed', count: orders.filter(o => o.status.toLowerCase() === 'completed').length },
    { value: 'design', label: 'Awaiting Approval', count: orders.filter(o => o.status.toLowerCase().includes('approval')).length }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 bg-surface-200 rounded w-48 mb-4"></div>
            <div className="h-4 bg-surface-200 rounded w-96"></div>
          </div>
          <SkeletonLoader type="list" count={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <ErrorState
          title="Failed to load orders"
          message={error}
          onRetry={loadOrders}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
>
          <h1 className="text-3xl font-display font-bold text-secondary mb-2">
            {(() => {
              const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
              return currentUser.role === 'admin' ? 'All Orders' : 'My Orders';
            })()}
          </h1>
          <p className="text-surface-600">
            {(() => {
              const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
              return currentUser.role === 'admin' 
                ? 'Monitor and manage all customer orders across the platform'
                : 'Track your custom jewelry orders and view order history';
            })()}
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-200
                  ${filter === option.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-surface-200 hover:border-surface-300 text-surface-700 bg-white'
                  }
                `}
              >
                <span>{option.label}</span>
                <Badge
                  variant={filter === option.value ? 'primary' : 'secondary'}
                  size="xs"
                >
                  {option.count}
                </Badge>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon="Package"
            title={filter === 'all' ? 'No orders yet' : 'No orders match your filter'}
            description={
              filter === 'all'
                ? 'Start your custom jewelry journey by placing your first order.'
                : 'Try selecting a different filter to see more orders.'
            }
            actionLabel={filter === 'all' ? 'Create Custom Order' : 'View All Orders'}
            onAction={() => {
              if (filter === 'all') {
                navigate('/custom-order');
              } else {
                setFilter('all');
              }
            }}
          />
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-surface-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-secondary">
                          Order #{order.Id.toString().padStart(4, '0')}
                        </h3>
                        <Badge variant={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-surface-500">Jewelry Type:</span>
                          <span className="ml-2 font-medium text-secondary">
                            {order.specifications.type}
                          </span>
                        </div>
                        <div>
                          <span className="text-surface-500">Designer:</span>
                          <span className="ml-2 font-medium text-secondary">
                            {order.designerName || 'Assigning...'}
                          </span>
                        </div>
                        <div>
                          <span className="text-surface-500">Order Date:</span>
                          <span className="ml-2 font-medium text-secondary">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(order.budget)}
                        </div>
                        {order.estimatedCompletion && (
                          <div className="text-sm text-surface-500">
                            Est: {formatDate(order.estimatedCompletion)}
                          </div>
                        )}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/orders/${order.Id}`)}
                        icon="Eye"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Order Progress */}
                <div className="p-6 bg-surface-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-secondary">Progress</h4>
                    <span className="text-sm text-surface-600">
                      Current: {order.currentMilestone}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative">
                    <div className="h-2 bg-surface-200 rounded-full">
                      <div
                        className="h-2 bg-primary rounded-full transition-all duration-500"
                        style={{
                          width: `${(order.milestones.filter(m => m.status === 'completed').length / order.milestones.length) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Recent Milestones */}
                  <div className="mt-4">
                    <div className="flex items-center space-x-4 text-sm">
                      {order.milestones
                        .filter(m => m.status === 'completed')
                        .slice(-3)
                        .map((milestone, idx) => (
                          <div key={milestone.id} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-success rounded-full"></div>
                            <span className="text-surface-600">{milestone.name}</span>
                            {idx < 2 && <ApperIcon name="ChevronRight" className="w-3 h-3 text-surface-400" />}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Specifications */}
                    <div>
                      <h4 className="font-medium text-secondary mb-3">Specifications</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-surface-600">Metal:</span>
                          <span className="text-secondary">{order.specifications.metal}</span>
                        </div>
                        {order.specifications.gemstones?.length > 0 && (
                          <div className="flex justify-between">
                            <span className="text-surface-600">Gemstones:</span>
                            <span className="text-secondary">
                              {order.specifications.gemstones.join(', ')}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-surface-600">Occasion:</span>
                          <span className="text-secondary">{order.specifications.occasion}</span>
                        </div>
                        {order.specifications.style && (
                          <div className="flex justify-between">
                            <span className="text-surface-600">Style:</span>
                            <span className="text-secondary">{order.specifications.style}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recent Updates */}
                    <div>
                      <h4 className="font-medium text-secondary mb-3">Recent Updates</h4>
                      <div className="space-y-3">
                        {order.milestones
                          .filter(m => m.status === 'completed' && m.date)
                          .slice(-2)
                          .map((milestone) => (
                            <div key={milestone.id} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-secondary">
                                  {milestone.name}
                                </p>
                                <p className="text-xs text-surface-500">
                                  {formatDate(milestone.date)}
                                </p>
                                {milestone.notes && (
                                  <p className="text-xs text-surface-600 mt-1">
                                    {milestone.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Reference Images */}
                  {order.referenceImages?.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-surface-200">
                      <h4 className="font-medium text-secondary mb-3">Reference Images</h4>
                      <div className="flex space-x-3 overflow-x-auto pb-2">
                        {order.referenceImages.slice(0, 4).map((image, idx) => (
                          <div key={idx} className="flex-shrink-0">
                            <img
                              src={image}
                              alt={`Reference ${idx + 1}`}
                              className="w-16 h-16 object-cover rounded-lg border border-surface-200"
                            />
                          </div>
                        ))}
                        {order.referenceImages.length > 4 && (
                          <div className="flex-shrink-0 w-16 h-16 bg-surface-100 rounded-lg border border-surface-200 flex items-center justify-center">
                            <span className="text-xs text-surface-500">
                              +{order.referenceImages.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create Order CTA */}
        {filteredOrders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-secondary mb-2">
                Ready for Another Custom Piece?
              </h3>
              <p className="text-surface-600 mb-6">
                Create another unique jewelry piece with our expert craftsmen.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/custom-order')}
                icon="Plus"
              >
                Create New Order
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;