import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import customOrderService from '@/services/api/customOrderService';

const CustomOrderForm = ({ onSubmit, className = '' }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    specifications: {
      type: '',
      metal: '',
      gemstones: [],
      occasion: '',
      style: '',
      notes: ''
    },
    budget: '',
    referenceImages: [],
    customerDetails: {
      name: '',
      email: '',
      phone: '',
      address: ''
    }
  });

  const steps = [
    { id: 1, title: 'Jewelry Details', icon: 'Gem' },
    { id: 2, title: 'Budget & Style', icon: 'DollarSign' },
    { id: 3, title: 'Reference Images', icon: 'Image' },
    { id: 4, title: 'Contact Info', icon: 'User' }
  ];

  const jewelryTypes = [
    'Necklace Set', 'Earrings', 'Ring', 'Bracelet', 'Pendant', 
    'Bangles', 'Anklet', 'Nose Ring', 'Mangalsutra', 'Other'
  ];

  const metals = [
    '22K Gold', '18K Gold', '14K Gold', 'White Gold', 'Rose Gold', 
    'Platinum', 'Silver', 'Other'
  ];

  const gemstones = [
    'Diamond', 'Ruby', 'Emerald', 'Sapphire', 'Pearl', 'Kundan', 
    'Polki', 'Coral', 'Turquoise', 'Other'
  ];

  const occasions = [
    'Wedding', 'Engagement', 'Festival', 'Party', 'Daily Wear', 
    'Anniversary', 'Traditional', 'Contemporary', 'Other'
  ];

  const styles = [
    'Traditional', 'Contemporary', 'Fusion', 'Antique', 'Temple', 
    'Kundan', 'Polki', 'Meenakari', 'Filigree', 'Other'
  ];

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateSpecifications = (field, value) => {
    updateFormData('specifications', field, value);
  };

  const handleFileUpload = (files) => {
    const newImages = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    
    setFormData(prev => ({
      ...prev,
      referenceImages: [...prev.referenceImages, ...newImages]
    }));
  };

  const removeImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      referenceImages: prev.referenceImages.filter(img => img.id !== imageId)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const orderData = {
        customerId: 'CUST001', // This would come from auth context
        customerName: formData.customerDetails.name,
        specifications: formData.specifications,
        budget: parseInt(formData.budget, 10),
        referenceImages: formData.referenceImages.map(img => img.preview),
        estimatedCompletion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };

      const result = await customOrderService.create(orderData);
      toast.success('Custom order submitted successfully!');
      
      if (onSubmit) {
        onSubmit(result);
      }
      
      // Reset form
      setCurrentStep(1);
      setFormData({
        specifications: {
          type: '',
          metal: '',
          gemstones: [],
          occasion: '',
          style: '',
          notes: ''
        },
        budget: '',
        referenceImages: [],
        customerDetails: {
          name: '',
          email: '',
          phone: '',
          address: ''
        }
      });
    } catch (error) {
      toast.error('Failed to submit order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formData.specifications.type && formData.specifications.metal;
      case 2:
        return formData.budget && formData.specifications.occasion;
      case 3:
        return true; // Reference images are optional
      case 4:
        return formData.customerDetails.name && formData.customerDetails.email;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 4 && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-surface-200">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Step Indicators */}
          {steps.map((step) => (
            <div key={step.id} className="relative flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                ${currentStep >= step.id 
                  ? 'bg-primary border-primary text-white' 
                  : 'bg-white border-surface-300 text-surface-500'
                }
              `}>
                <ApperIcon name={step.icon} className="w-5 h-5" />
              </div>
              <span className={`
                mt-2 text-sm font-medium transition-colors duration-300
                ${currentStep >= step.id ? 'text-primary' : 'text-surface-500'}
              `}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        {/* Step 1: Jewelry Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-display font-semibold text-secondary mb-2">
                Tell us about your jewelry
              </h3>
              <p className="text-surface-600">
                What type of jewelry would you like us to create for you?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-3">
                  Jewelry Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {jewelryTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => updateSpecifications('type', type)}
                      className={`
                        p-3 text-sm rounded-lg border-2 transition-all duration-200
                        ${formData.specifications.type === type
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-surface-200 hover:border-surface-300 text-surface-700'
                        }
                      `}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-3">
                  Metal Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {metals.map((metal) => (
                    <button
                      key={metal}
                      onClick={() => updateSpecifications('metal', metal)}
                      className={`
                        p-3 text-sm rounded-lg border-2 transition-all duration-200
                        ${formData.specifications.metal === metal
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-surface-200 hover:border-surface-300 text-surface-700'
                        }
                      `}
                    >
                      {metal}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-3">
                Gemstones (Select multiple if needed)
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {gemstones.map((stone) => (
                  <button
                    key={stone}
                    onClick={() => {
                      const current = formData.specifications.gemstones || [];
                      const updated = current.includes(stone)
                        ? current.filter(s => s !== stone)
                        : [...current, stone];
                      updateSpecifications('gemstones', updated);
                    }}
                    className={`
                      p-2 text-sm rounded-lg border-2 transition-all duration-200
                      ${(formData.specifications.gemstones || []).includes(stone)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-surface-200 hover:border-surface-300 text-surface-700'
                      }
                    `}
                  >
                    {stone}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Budget & Style */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-display font-semibold text-secondary mb-2">
                Budget and Style
              </h3>
              <p className="text-surface-600">
                Help us understand your budget and preferred style.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Budget (INR)"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  placeholder="50000"
                  required
                  icon="DollarSign"
                />
                <p className="text-sm text-surface-500 mt-2">
                  This helps us recommend the best materials and design complexity.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-3">
                  Occasion *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {occasions.map((occasion) => (
                    <button
                      key={occasion}
                      onClick={() => updateSpecifications('occasion', occasion)}
                      className={`
                        p-3 text-sm rounded-lg border-2 transition-all duration-200
                        ${formData.specifications.occasion === occasion
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-surface-200 hover:border-surface-300 text-surface-700'
                        }
                      `}
                    >
                      {occasion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-3">
                Style Preference
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {styles.map((style) => (
                  <button
                    key={style}
                    onClick={() => updateSpecifications('style', style)}
                    className={`
                      p-3 text-sm rounded-lg border-2 transition-all duration-200
                      ${formData.specifications.style === style
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-surface-200 hover:border-surface-300 text-surface-700'
                      }
                    `}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-3">
                Additional Notes
              </label>
              <textarea
                value={formData.specifications.notes}
                onChange={(e) => updateSpecifications('notes', e.target.value)}
                placeholder="Any specific requirements, inspirations, or details you'd like to share..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-surface-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>
        )}

        {/* Step 3: Reference Images */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-display font-semibold text-secondary mb-2">
                Reference Images
              </h3>
              <p className="text-surface-600">
                Upload images that inspire your design (optional but helpful).
              </p>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-surface-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <ApperIcon name="Upload" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-secondary mb-2">
                  Upload Reference Images
                </h4>
                <p className="text-surface-600 mb-4">
                  Drag and drop or click to browse
                </p>
                <Button variant="outline" type="button">
                  Choose Files
                </Button>
              </label>
            </div>

            {/* Image Preview */}
            {formData.referenceImages.length > 0 && (
              <div>
                <h4 className="font-medium text-secondary mb-3">
                  Uploaded Images ({formData.referenceImages.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.referenceImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.preview}
                        alt={image.name}
                        className="w-full h-24 object-cover rounded-lg border border-surface-200"
                      />
                      <button
                        onClick={() => removeImage(image.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ApperIcon name="X" className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-surface-600 mt-1 truncate">
                        {image.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Contact Info */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-display font-semibold text-secondary mb-2">
                Contact Information
              </h3>
              <p className="text-surface-600">
                We'll use this information to keep you updated on your order.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                value={formData.customerDetails.name}
                onChange={(e) => updateFormData('customerDetails', 'name', e.target.value)}
                required
                icon="User"
              />

              <Input
                label="Email Address"
                type="email"
                value={formData.customerDetails.email}
                onChange={(e) => updateFormData('customerDetails', 'email', e.target.value)}
                required
                icon="Mail"
              />

              <Input
                label="Phone Number"
                type="tel"
                value={formData.customerDetails.phone}
                onChange={(e) => updateFormData('customerDetails', 'phone', e.target.value)}
                required
                icon="Phone"
              />

              <div className="md:col-span-2">
                <Input
                  label="Address"
                  value={formData.customerDetails.address}
                  onChange={(e) => updateFormData('customerDetails', 'address', e.target.value)}
                  icon="MapPin"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-surface-50 rounded-lg p-6">
              <h4 className="font-medium text-secondary mb-4">Order Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-surface-600">Jewelry Type:</span>
                  <span className="text-secondary">{formData.specifications.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Metal:</span>
                  <span className="text-secondary">{formData.specifications.metal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Budget:</span>
                  <span className="text-secondary">₹{parseInt(formData.budget || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Occasion:</span>
                  <span className="text-secondary">{formData.specifications.occasion}</span>
                </div>
                {formData.specifications.gemstones?.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-surface-600">Gemstones:</span>
                    <span className="text-secondary">{formData.specifications.gemstones.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-surface-200">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            icon="ChevronLeft"
          >
            Previous
          </Button>

          <div className="text-sm text-surface-500">
            Step {currentStep} of {steps.length}
          </div>

          {currentStep < 4 ? (
            <Button
              variant="primary"
              onClick={nextStep}
              disabled={!isStepValid(currentStep)}
              icon="ChevronRight"
              iconPosition="right"
            >
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={loading}
              disabled={!isStepValid(currentStep)}
              icon="Send"
            >
              Submit Order
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CustomOrderForm;