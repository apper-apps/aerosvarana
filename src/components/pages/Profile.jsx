import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    personal: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+91 9876543210',
      dateOfBirth: '1990-01-15',
      gender: 'male'
    },
    address: {
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      privacy: {
        profileVisibility: 'public',
        orderHistory: 'private'
      },
      communication: {
        marketing: false,
        updates: true,
        newsletters: true
      }
    }
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: 'User' },
    { id: 'address', label: 'Address', icon: 'MapPin' },
    { id: 'orders', label: 'Order History', icon: 'Package' },
    { id: 'preferences', label: 'Preferences', icon: 'Settings' },
    { id: 'security', label: 'Security', icon: 'Shield' }
  ];

  const handleInputChange = (section, field, value) => {
    setProfileData(prev => ({
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

  const handleNestedInputChange = (section, subsection, field, value) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const validateSection = (section) => {
    const newErrors = {};
    
    if (section === 'personal') {
      const { personal } = profileData;
      if (!personal.firstName) newErrors.firstName = 'First name is required';
      if (!personal.lastName) newErrors.lastName = 'Last name is required';
      if (!personal.email) newErrors.email = 'Email is required';
      if (!personal.phone) newErrors.phone = 'Phone number is required';
    }
    
    if (section === 'address') {
      const { address } = profileData;
      if (!address.street) newErrors.street = 'Street address is required';
      if (!address.city) newErrors.city = 'City is required';
      if (!address.state) newErrors.state = 'State is required';
      if (!address.pincode) newErrors.pincode = 'PIN code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (section) => {
    if (!validateSection(section)) return;
    
    try {
      setSaving(true);
      setSuccessMessage('');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err) {
      console.error('Failed to save profile:', err);
      setErrors({ general: 'Failed to save changes. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your personal information and preferences</p>
        </motion.div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center">
              <ApperIcon name="CheckCircle" size={20} className="text-green-600 mr-2" />
              <p className="text-green-800">{successMessage}</p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {profileData.personal.firstName} {profileData.personal.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{profileData.personal.email}</p>
                  </div>
                </div>
                
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <ApperIcon name={tab.icon} size={20} className="mr-3" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                {/* Personal Information Tab */}
                {activeTab === 'personal' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
                    
                    {errors.general && (
                      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{errors.general}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="First Name"
                        value={profileData.personal.firstName}
                        onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
                        error={errors.firstName}
                        required
                      />
                      <Input
                        label="Last Name"
                        value={profileData.personal.lastName}
                        onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
                        error={errors.lastName}
                        required
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={profileData.personal.email}
                        onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                        error={errors.email}
                        required
                      />
                      <Input
                        label="Phone"
                        value={profileData.personal.phone}
                        onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                        error={errors.phone}
                        required
                      />
                      <Input
                        label="Date of Birth"
                        type="date"
                        value={profileData.personal.dateOfBirth}
                        onChange={(e) => handleInputChange('personal', 'dateOfBirth', e.target.value)}
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender
                        </label>
                        <select
                          value={profileData.personal.gender}
                          onChange={(e) => handleInputChange('personal', 'gender', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <Button
                        onClick={() => handleSave('personal')}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {saving ? (
                          <>
                            <LoadingSpinner size="small" className="mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <ApperIcon name="Save" size={20} className="mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Address Tab */}
                {activeTab === 'address' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Address Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <Input
                          label="Street Address"
                          value={profileData.address.street}
                          onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                          error={errors.street}
                          required
                        />
                      </div>
                      <Input
                        label="City"
                        value={profileData.address.city}
                        onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                        error={errors.city}
                        required
                      />
                      <Input
                        label="State"
                        value={profileData.address.state}
                        onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                        error={errors.state}
                        required
                      />
                      <Input
                        label="PIN Code"
                        value={profileData.address.pincode}
                        onChange={(e) => handleInputChange('address', 'pincode', e.target.value)}
                        error={errors.pincode}
                        required
                      />
                      <Input
                        label="Country"
                        value={profileData.address.country}
                        onChange={(e) => handleInputChange('address', 'country', e.target.value)}
                        disabled
                      />
                    </div>
                    
                    <div className="mt-8">
                      <Button
                        onClick={() => handleSave('address')}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {saving ? (
                          <>
                            <LoadingSpinner size="small" className="mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <ApperIcon name="Save" size={20} className="mr-2" />
                            Save Address
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Order History Tab */}
                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Order History</h2>
                    <div className="text-center py-12">
                      <ApperIcon name="Package" size={64} className="text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
                      <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                      <Button>
                        <ApperIcon name="Store" size={20} className="mr-2" />
                        Start Shopping
                      </Button>
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>
                    
                    <div className="space-y-8">
                      {/* Notifications */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                        <div className="space-y-4">
                          {Object.entries(profileData.preferences.notifications).map(([key, value]) => (
                            <label key={key} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => handleNestedInputChange('preferences', 'notifications', key, e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-3 text-sm text-gray-700 capitalize">
                                {key === 'sms' ? 'SMS' : key} notifications
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Communication */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Communication</h3>
                        <div className="space-y-4">
                          {Object.entries(profileData.preferences.communication).map(([key, value]) => (
                            <label key={key} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => handleNestedInputChange('preferences', 'communication', key, e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-3 text-sm text-gray-700 capitalize">
                                {key === 'newsletters' ? 'Newsletter subscriptions' : 
                                 key === 'marketing' ? 'Marketing communications' : 
                                 'Product updates'}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <Button
                        onClick={() => handleSave('preferences')}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {saving ? (
                          <>
                            <LoadingSpinner size="small" className="mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <ApperIcon name="Save" size={20} className="mr-2" />
                            Save Preferences
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                    <div className="text-center py-12">
                      <ApperIcon name="Shield" size={64} className="text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Security Settings</h3>
                      <p className="text-gray-600">Password change and security features coming soon.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}