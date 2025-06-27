import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import userService from '@/services/api/userService';

const Login = ({ onLogin, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    role: 'customer'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const roles = [
    { value: 'customer', label: 'Customer', icon: 'User' },
    { value: 'designer', label: 'Designer', icon: 'Brush' },
    { value: 'admin', label: 'Admin', icon: 'Settings' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    
    try {
      const user = await userService.login(formData.email, formData.role);
      toast.success(`Welcome back, ${user.name}!`);
      
      if (onLogin) {
        onLogin(user);
      }
      
      if (onClose) {
        onClose();
      }
      
      // Navigate based on role
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'designer':
          navigate('/designer');
          break;
        default:
          navigate('/');
      }
      
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (email, role) => {
    setLoading(true);
    try {
      const user = await userService.login(email, role);
      toast.success(`Logged in as ${user.name} (${role})`);
      
      if (onLogin) {
        onLogin(user);
      }
      
      if (onClose) {
        onClose();
      }
      
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-semibold text-secondary">
            Sign In
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Email Address
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Login as
            </label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: role.value })}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    formData.role === role.value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-surface-200 hover:border-surface-300 text-surface-600'
                  }`}
                  disabled={loading}
                >
                  <ApperIcon name={role.icon} className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-xs font-medium">{role.label}</div>
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            loading={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-surface-200">
          <p className="text-sm text-surface-600 mb-4 text-center">
            Quick Demo Login:
          </p>
          <div className="space-y-2">
            <button
              onClick={() => handleQuickLogin('priya.sharma@gmail.com', 'customer')}
              className="w-full p-2 text-left rounded-lg hover:bg-surface-50 transition-colors text-sm"
              disabled={loading}
            >
              <div className="font-medium text-secondary">Priya Sharma</div>
              <div className="text-surface-500">Customer • priya.sharma@gmail.com</div>
            </button>
            <button
              onClick={() => handleQuickLogin('arjun.patel@gmail.com', 'designer')}
              className="w-full p-2 text-left rounded-lg hover:bg-surface-50 transition-colors text-sm"
              disabled={loading}
            >
              <div className="font-medium text-secondary">Arjun Patel</div>
              <div className="text-surface-500">Designer • arjun.patel@gmail.com</div>
            </button>
            <button
              onClick={() => handleQuickLogin('kavya.reddy@gmail.com', 'admin')}
              className="w-full p-2 text-left rounded-lg hover:bg-surface-50 transition-colors text-sm"
              disabled={loading}
            >
              <div className="font-medium text-secondary">Kavya Reddy</div>
              <div className="text-surface-500">Admin • kavya.reddy@gmail.com</div>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;