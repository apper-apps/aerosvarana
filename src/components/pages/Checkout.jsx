import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import cartService from '@/services/api/cartService';

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [formData, setFormData] = useState({
    shipping: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    payment: {
      method: 'card',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: ''
    }
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const items = await cartService.getCartItems();
      if (!items || items.length === 0) {
        navigate('/cart');
        return;
      }
      setCartItems(items);
    } catch (err) {
      console.error('Failed to load cart:', err);
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
      const { shipping } = formData;
      if (!shipping.firstName) newErrors.firstName = 'First name is required';
      if (!shipping.lastName) newErrors.lastName = 'Last name is required';
      if (!shipping.email) newErrors.email = 'Email is required';
      if (!shipping.phone) newErrors.phone = 'Phone number is required';
      if (!shipping.address) newErrors.address = 'Address is required';
      if (!shipping.city) newErrors.city = 'City is required';
      if (!shipping.state) newErrors.state = 'State is required';
      if (!shipping.pincode) newErrors.pincode = 'PIN code is required';
    }
    
    if (stepNumber === 2 && formData.payment.method === 'card') {
      const { payment } = formData;
      if (!payment.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!payment.expiryDate) newErrors.expiryDate = 'Expiry date is required';
      if (!payment.cvv) newErrors.cvv = 'CVV is required';
      if (!payment.nameOnCard) newErrors.nameOnCard = 'Name on card is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep(prev => prev - 1);
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 99;
    const tax = subtotal * 0.18; // 18% GST
    return { subtotal, shipping, tax, total: subtotal + shipping + tax };
  };

  const handlePlaceOrder = async () => {
    try {
      setProcessing(true);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and redirect to success
      await cartService.clearCart();
      navigate('/order-success', { 
        state: { 
          orderData: { ...formData, items: cartItems, ...calculateTotal() } 
        } 
      });
    } catch (err) {
      console.error('Order placement failed:', err);
      setErrors({ general: 'Failed to place order. Please try again.' });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const { subtotal, shipping, tax, total } = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {/* Progress Steps */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((stepNumber) => (
                    <div key={stepNumber} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {stepNumber}
                      </div>
                      <span className={`ml-2 text-sm font-medium ${
                        step >= stepNumber ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {stepNumber === 1 ? 'Shipping' : stepNumber === 2 ? 'Payment' : 'Review'}
                      </span>
                      {stepNumber < 3 && (
                        <div className={`ml-4 h-px w-16 ${
                          step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {/* Step 1: Shipping Information */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="First Name"
                        value={formData.shipping.firstName}
                        onChange={(e) => handleInputChange('shipping', 'firstName', e.target.value)}
                        error={errors.firstName}
                        required
                      />
                      <Input
                        label="Last Name"
                        value={formData.shipping.lastName}
                        onChange={(e) => handleInputChange('shipping', 'lastName', e.target.value)}
                        error={errors.lastName}
                        required
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={formData.shipping.email}
                        onChange={(e) => handleInputChange('shipping', 'email', e.target.value)}
                        error={errors.email}
                        required
                      />
                      <Input
                        label="Phone"
                        value={formData.shipping.phone}
                        onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
                        error={errors.phone}
                        required
                      />
                      <div className="md:col-span-2">
                        <Input
                          label="Address"
                          value={formData.shipping.address}
                          onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
                          error={errors.address}
                          required
                        />
                      </div>
                      <Input
                        label="City"
                        value={formData.shipping.city}
                        onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                        error={errors.city}
                        required
                      />
                      <Input
                        label="State"
                        value={formData.shipping.state}
                        onChange={(e) => handleInputChange('shipping', 'state', e.target.value)}
                        error={errors.state}
                        required
                      />
                      <Input
                        label="PIN Code"
                        value={formData.shipping.pincode}
                        onChange={(e) => handleInputChange('shipping', 'pincode', e.target.value)}
                        error={errors.pincode}
                        required
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Payment Information */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
                    
                    <div className="mb-6">
                      <label className="text-sm font-medium text-gray-700 mb-3 block">Payment Method</label>
                      <div className="space-y-3">
                        {['card', 'upi', 'cod'].map((method) => (
                          <label key={method} className="flex items-center">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method}
                              checked={formData.payment.method === method}
                              onChange={(e) => handleInputChange('payment', 'method', e.target.value)}
                              className="mr-3"
                            />
                            <span className="text-gray-700">
                              {method === 'card' ? 'Credit/Debit Card' : 
                               method === 'upi' ? 'UPI Payment' : 'Cash on Delivery'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {formData.payment.method === 'card' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <Input
                            label="Card Number"
                            value={formData.payment.cardNumber}
                            onChange={(e) => handleInputChange('payment', 'cardNumber', e.target.value)}
                            error={errors.cardNumber}
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                        </div>
                        <Input
                          label="Expiry Date"
                          value={formData.payment.expiryDate}
                          onChange={(e) => handleInputChange('payment', 'expiryDate', e.target.value)}
                          error={errors.expiryDate}
                          placeholder="MM/YY"
                          required
                        />
                        <Input
                          label="CVV"
                          value={formData.payment.cvv}
                          onChange={(e) => handleInputChange('payment', 'cvv', e.target.value)}
                          error={errors.cvv}
                          placeholder="123"
                          required
                        />
                        <div className="md:col-span-2">
                          <Input
                            label="Name on Card"
                            value={formData.payment.nameOnCard}
                            onChange={(e) => handleInputChange('payment', 'nameOnCard', e.target.value)}
                            error={errors.nameOnCard}
                            required
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 3: Review Order */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Order</h2>
                    
                    {errors.general && (
                      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{errors.general}</p>
                      </div>
                    )}

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                        <div className="text-sm text-gray-600">
                          <p>{formData.shipping.firstName} {formData.shipping.lastName}</p>
                          <p>{formData.shipping.address}</p>
                          <p>{formData.shipping.city}, {formData.shipping.state} {formData.shipping.pincode}</p>
                          <p>{formData.shipping.phone}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                        <p className="text-sm text-gray-600">
                          {formData.payment.method === 'card' ? `Card ending in ${formData.payment.cardNumber.slice(-4)}` :
                           formData.payment.method === 'upi' ? 'UPI Payment' : 'Cash on Delivery'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={step === 1 ? () => navigate('/cart') : handlePreviousStep}
                  >
                    <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
                    {step === 1 ? 'Back to Cart' : 'Previous'}
                  </Button>
                  
                  {step < 3 ? (
                    <Button onClick={handleNextStep}>
                      Next
                      <ApperIcon name="ArrowRight" size={20} className="ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={processing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {processing ? (
                        <>
                          <LoadingSpinner size="small" className="mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="Check" size={20} className="mr-2" />
                          Place Order
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6 sticky top-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="divide-y divide-gray-200 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">₹{shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (GST)</span>
                  <span className="text-gray-900">₹{tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}