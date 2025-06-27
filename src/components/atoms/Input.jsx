import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  iconPosition = 'left',
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasValue = value && value.toString().length > 0;
  const isFloatingLabel = label && (focused || hasValue);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const inputClasses = `
    w-full px-4 py-3 text-base border-2 rounded-lg transition-all duration-200
    focus:outline-none focus:ring-0
    ${error 
      ? 'border-error focus:border-error' 
      : focused
        ? 'border-primary focus:border-primary'
        : 'border-surface-300 focus:border-primary hover:border-surface-400'
    }
    ${disabled ? 'bg-surface-100 cursor-not-allowed opacity-50' : 'bg-white'}
    ${icon && iconPosition === 'left' ? 'pl-12' : ''}
    ${icon && iconPosition === 'right' ? 'pr-12' : ''}
    ${type === 'password' ? 'pr-12' : ''}
    ${label ? 'pt-6 pb-2' : ''}
    ${className}
  `.trim();

  return (
    <div className="relative">
      {/* Floating Label */}
      {label && (
        <label
          className={`
            absolute left-4 transition-all duration-200 pointer-events-none
            ${isFloatingLabel
              ? 'top-2 text-xs text-primary font-medium'
              : 'top-1/2 -translate-y-1/2 text-surface-500'
            }
          `}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400">
            <ApperIcon name={icon} className="w-5 h-5" />
          </div>
        )}

        {/* Input Field */}
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={isFloatingLabel ? '' : placeholder}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />

        {/* Right Icon */}
        {icon && iconPosition === 'right' && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400">
            <ApperIcon name={icon} className="w-5 h-5" />
          </div>
        )}

        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
          >
            <ApperIcon name={showPassword ? 'EyeOff' : 'Eye'} className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center mt-2 text-error text-sm">
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Input;