import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorState from '@/components/molecules/ErrorState';
import productService from '@/services/api/productService';
import cartService from '@/services/api/cartService';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({
    size: 'Standard',
    engraving: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const productData = await productService.getById(id);
      setProduct(productData);
    } catch (err) {
      setError(err.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await cartService.add(product.Id, quantity, selectedOptions);
      toast.success('Added to cart successfully!', {
        duration: 2000
      });
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/checkout');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-surface-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <ErrorState
          title="Product not found"
          message={error}
          onRetry={loadProduct}
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <ErrorState
          title="Product not found"
          message="The product you're looking for doesn't exist."
          actionLabel="Back to Shop"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => navigate('/')}
              className="text-surface-600 hover:text-primary transition-colors"
            >
              Shop
            </button>
            <ApperIcon name="ChevronRight" className="w-4 h-4 text-surface-400" />
            <button
              onClick={() => navigate(`/?category=${product.category}`)}
              className="text-surface-600 hover:text-primary transition-colors"
            >
              {product.category}
            </button>
            <ApperIcon name="ChevronRight" className="w-4 h-4 text-surface-400" />
            <span className="text-secondary font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg cursor-zoom-in"
              onClick={() => setShowImageModal(true)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`
                      flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200
                      ${selectedImage === index
                        ? 'border-primary shadow-md'
                        : 'border-surface-200 hover:border-surface-300'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="primary" size="sm">
                  {product.category}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Heart"
                  className="text-surface-500 hover:text-error"
                />
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-secondary mb-3">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.stock <= 5 && (
                  <Badge variant="warning" size="sm">
                    Only {product.stock} left
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-surface-100 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-secondary">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-surface-600">Metal:</span>
                  <span className="ml-2 font-medium text-secondary">{product.metal}</span>
                </div>
                {product.weight && (
                  <div>
                    <span className="text-surface-600">Weight:</span>
                    <span className="ml-2 font-medium text-secondary">{product.weight}</span>
                  </div>
                )}
                {product.purity && (
                  <div>
                    <span className="text-surface-600">Purity:</span>
                    <span className="ml-2 font-medium text-secondary">{product.purity}</span>
                  </div>
                )}
                {product.occasion && (
                  <div>
                    <span className="text-surface-600">Occasion:</span>
                    <span className="ml-2 font-medium text-secondary">{product.occasion}</span>
                  </div>
                )}
              </div>
              
              {product.gemstones && product.gemstones.length > 0 && (
                <div>
                  <span className="text-surface-600 text-sm">Gemstones:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.gemstones.map((stone, index) => (
                      <Badge key={index} variant="secondary" size="xs">
                        {stone}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold text-secondary mb-3">Description</h3>
                <p className="text-surface-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Options */}
            <div className="space-y-4">
              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Size
                </label>
                <div className="flex space-x-2">
                  {['Small', 'Standard', 'Large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedOptions(prev => ({ ...prev, size }))}
                      className={`
                        px-4 py-2 text-sm rounded-lg border-2 transition-all duration-200
                        ${selectedOptions.size === size
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-surface-200 hover:border-surface-300 text-surface-700'
                        }
                      `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Engraving */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Engraving (Optional)
                </label>
                <input
                  type="text"
                  value={selectedOptions.engraving}
                  onChange={(e) => setSelectedOptions(prev => ({ ...prev, engraving: e.target.value }))}
                  placeholder="Enter text for engraving"
                  maxLength={20}
                  className="w-full px-4 py-2 border-2 border-surface-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                />
                <p className="text-xs text-surface-500 mt-1">
                  {selectedOptions.engraving.length}/20 characters
                </p>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <ApperIcon name="Minus" className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium text-lg">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <ApperIcon name="Plus" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Buy Now
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                loading={addingToCart}
                disabled={product.stock === 0}
                icon="ShoppingCart"
              >
                Add to Cart
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="w-full text-primary"
                onClick={() => navigate('/custom-order')}
                icon="Palette"
              >
                Request Custom Design
              </Button>
            </div>

            {/* Additional Info */}
            <div className="bg-primary/5 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Shield" className="w-4 h-4 text-primary" />
                <span>Lifetime authenticity guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Truck" className="w-4 h-4 text-primary" />
                <span>Free shipping on orders above ₹50,000</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="RotateCcw" className="w-4 h-4 text-primary" />
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setShowImageModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-4xl max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain rounded-lg"
                />
                
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={() => setShowImageModal(false)}
                  className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
                />

                {/* Navigation */}
                {product.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="ChevronLeft"
                      onClick={() => setSelectedImage((prev) => 
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    />
                    <Button
                      variant="ghost"
                      size="sm" 
                      icon="ChevronRight"
                      onClick={() => setSelectedImage((prev) => 
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    />
                  </>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;