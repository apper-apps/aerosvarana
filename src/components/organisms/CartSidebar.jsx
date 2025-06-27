import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import cartService from '@/services/api/cartService';

const CartSidebar = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      loadCartData();
    }
  }, [isOpen]);

  const loadCartData = async () => {
    setLoading(true);
    try {
      const [items, total] = await Promise.all([
        cartService.getAll(),
        cartService.getTotal()
      ]);
      setCartItems(items);
      setCartTotal(total);
    } catch (error) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeItem(itemId);
      return;
    }

    try {
      await cartService.update(itemId, { quantity: newQuantity });
      await loadCartData();
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartService.remove(itemId);
      await loadCartData();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const proceedToCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const sidebarVariants = {
    closed: { x: '100%' },
    open: { x: 0 }
  };

  const backdropVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-surface-200">
              <h2 className="text-xl font-semibold text-secondary">Shopping Cart</h2>
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={onClose}
                className="text-surface-500 hover:text-secondary"
              />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mb-4">
                    <ApperIcon name="ShoppingCart" className="w-8 h-8 text-surface-400" />
                  </div>
                  <h3 className="text-lg font-medium text-secondary mb-2">Your cart is empty</h3>
                  <p className="text-surface-600 mb-4">Add some beautiful jewelry to get started</p>
                  <Button
                    variant="primary"
                    onClick={() => {
                      onClose();
                      navigate('/');
                    }}
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.Id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4 p-4 bg-surface-50 rounded-lg"
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-secondary truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-surface-600">
                          {item.product.metal} • {item.product.category}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-semibold text-primary">
                            {formatPrice(item.product.price)}
                          </span>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.Id, item.quantity - 1)}
                              className="w-8 h-8 p-0 text-surface-600"
                            >
                              <ApperIcon name="Minus" className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.Id, item.quantity + 1)}
                              className="w-8 h-8 p-0 text-surface-600"
                            >
                              <ApperIcon name="Plus" className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.Id)}
                        className="text-surface-400 hover:text-error"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && cartTotal && (
              <div className="border-t border-surface-200 p-6 space-y-4">
                {/* Cart Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-600">Subtotal</span>
                    <span className="text-secondary">{formatPrice(cartTotal.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-600">Tax (3%)</span>
                    <span className="text-secondary">{formatPrice(cartTotal.tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-600">Shipping</span>
                    <span className="text-secondary">
                      {cartTotal.shipping === 0 ? 'Free' : formatPrice(cartTotal.shipping)}
                    </span>
                  </div>
                  <div className="border-t border-surface-200 pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-secondary">Total</span>
                      <span className="font-bold text-primary text-lg">
                        {formatPrice(cartTotal.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={proceedToCheckout}
                  >
                    Checkout
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      onClose();
                      navigate('/');
                    }}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;