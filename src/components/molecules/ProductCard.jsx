import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import cartService from '@/services/api/cartService';

const ProductCard = ({ product, className = '' }) => {
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      await cartService.add(product.Id, 1);
      toast.success('Added to cart successfully!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const cardVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className={`bg-white rounded-xl overflow-hidden shadow-md cursor-pointer transition-all duration-300 ${className}`}
      onClick={() => navigate(`/product/${product.Id}`)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-surface-50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          loading="lazy"
        />
        
        {/* Quick Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4"
        >
          <Button
            icon="Heart"
            variant="ghost"
            size="sm"
            className="bg-white/90 backdrop-blur-sm text-surface-600 hover:text-error hover:bg-white/100 shadow-md"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>

        {/* Stock Badge */}
        {product.stock <= 2 && (
          <div className="absolute top-4 left-4">
            <Badge variant="warning" size="xs">
              Only {product.stock} left
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category & Metal */}
        <div className="flex items-center justify-between mb-2">
          <Badge variant="primary" size="xs">
            {product.category}
          </Badge>
          <span className="text-sm text-surface-500 font-medium">
            {product.metal}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-display font-semibold text-lg text-secondary mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Gemstones */}
        {product.gemstones && product.gemstones.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.gemstones.slice(0, 2).map((stone, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-surface-100 text-surface-600 rounded-full"
              >
                {stone}
              </span>
            ))}
            {product.gemstones.length > 2 && (
              <span className="text-xs px-2 py-1 bg-surface-100 text-surface-600 rounded-full">
                +{product.gemstones.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mb-4">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.Id}`);
            }}
          >
            View Details
          </Button>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              icon="ShoppingCart"
              variant="primary"
              size="sm"
              onClick={handleAddToCart}
              className="px-3"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;