import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import EmptyState from '@/components/molecules/EmptyState';
import designerService from '@/services/api/designerService';
import productService from '@/services/api/productService';
export default function DesignerDashboard() {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [orders, setOrders] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState({
    pendingOrders: 0,
    completedOrders: 0,
    totalEarnings: 0,
    avgRating: 0,
    totalProducts: 0
  });

  // Mock designer ID - in real app this would come from auth context
  const designerId = 1;

  useEffect(() => {
    loadDashboardData();
  }, []);

  const [uploadForm, setUploadForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    metal: '',
    gemstones: '',
    weight: '',
    purity: '',
    occasion: '',
    artform: '',
    stock: '',
    images: '',
    completionTime: '30 days'
  });

const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [designerData, productsData] = await Promise.all([
        designerService.getById(designerId),
        productService.getByDesignerId(designerId)
      ]);

      const mockOrders = [
        {
          id: 1,
          customerName: 'John Doe',
          product: 'Custom Ring Design',
          status: 'pending',
          deadline: '2024-01-15',
          amount: 25000,
          createdAt: '2024-01-01'
        },
        {
          id: 2,
          customerName: 'Jane Smith',
          product: 'Wedding Necklace',
          status: 'in-progress',
          deadline: '2024-01-20',
          amount: 45000,
          createdAt: '2023-12-28'
        }
      ];

      setOrders(mockOrders);
      setPortfolio(designerData.portfolio || []);
      setMyProducts(productsData);
      setStats({
        pendingOrders: mockOrders.filter(o => o.status === 'pending').length,
        completedOrders: mockOrders.filter(o => o.status === 'completed').length,
        totalEarnings: mockOrders.reduce((sum, o) => sum + o.amount, 0),
        avgRating: designerData.rating || 4.8,
        totalProducts: productsData.length
      });
      
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const jewelryData = {
        ...uploadForm,
        price: parseFloat(uploadForm.price),
        stock: parseInt(uploadForm.stock, 10),
        gemstones: uploadForm.gemstones.split(',').map(g => g.trim()).filter(g => g),
        images: uploadForm.images.split(',').map(img => img.trim()).filter(img => img)
      };

      const result = await designerService.uploadJewelry(designerId, jewelryData);
      
      // Update local state
      setPortfolio(result.designer.portfolio);
      setMyProducts(prev => [...prev, result.product]);
      setStats(prev => ({ ...prev, totalProducts: prev.totalProducts + 1 }));
      
      // Reset form and close modal
      setUploadForm({
        name: '',
        description: '',
        price: '',
        category: '',
        metal: '',
        gemstones: '',
        weight: '',
        purity: '',
        occasion: '',
        artform: '',
        stock: '',
        images: '',
        completionTime: '30 days'
      });
      setShowUploadModal(false);
      
      toast.success('Jewelry uploaded successfully! It will appear in the main shop.');
      
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Failed to upload jewelry. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({ ...prev, [name]: value }));
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

const tabs = [
    { id: 'portfolio', label: 'My Portfolio', icon: 'Palette' },
    { id: 'products', label: 'My Products', icon: 'Package' },
    { id: 'orders', label: 'Orders', icon: 'ShoppingBag' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Designer Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your designs and customer orders</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ApperIcon name="Clock" size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ApperIcon name="CheckCircle" size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
              </div>
            </div>
          </div>
          
<div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ApperIcon name="Package" size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>
          
<div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ApperIcon name="DollarSign" size={24} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalEarnings.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <ApperIcon name={tab.icon} size={20} className="mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

<div className="p-6">
            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">My Portfolio</h2>
                  <Button onClick={() => setShowUploadModal(true)}>
                    <ApperIcon name="Upload" size={20} className="mr-2" />
                    Upload New Jewelry
                  </Button>
                </div>
                
                {portfolio.length === 0 ? (
                  <EmptyState
                    icon="Palette"
                    title="No Portfolio Items"
                    description="Start by uploading your jewelry designs to showcase your work."
                    actionLabel="Upload Jewelry"
                    onAction={() => setShowUploadModal(true)}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolio.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="w-full h-48 object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-48">
                              <ApperIcon name="Image" size={48} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.tags?.slice(0, 3).map((tag, index) => (
                              <Badge key={index} size="sm" variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-xs text-gray-500">
                            <p>Metal: {item.metal}</p>
                            <p>Completion: {item.completionTime}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">My Products in Shop</h2>
                  <Badge variant="primary">{myProducts.length} products listed</Badge>
                </div>
                
                {myProducts.length === 0 ? (
                  <EmptyState
                    icon="Package"
                    title="No Products Listed"
                    description="Upload jewelry to make it available for customers to purchase."
                    actionLabel="Upload Jewelry"
                    onAction={() => setShowUploadModal(true)}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myProducts.map((product) => (
                      <motion.div
                        key={product.Id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                          {product.images?.[0] ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-full h-48 object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-48">
                              <ApperIcon name="Image" size={48} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                          <div className="flex items-center justify-between text-sm mb-3">
                            <span className="font-semibold text-lg">₹{product.price?.toLocaleString()}</span>
                            <span className="text-gray-500">Stock: {product.stock}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              View in Shop
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              Edit
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Customer Orders</h2>
                  <Button>
                    <ApperIcon name="Plus" size={20} className="mr-2" />
                    New Design Quote
                  </Button>
                </div>
                
                {orders.length === 0 ? (
                  <EmptyState
                    icon="ShoppingBag"
                    title="No Orders Yet"
                    description="You haven't received any custom orders yet."
                  />
                ) : (
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer & Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Deadline
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                                <div className="text-sm text-gray-500">{order.product}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.replace('-', ' ')}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(order.deadline).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹{order.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}


{/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Analytics</h2>
                <div className="text-center py-12">
                  <ApperIcon name="BarChart3" size={64} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
                  <p className="text-gray-600">Detailed analytics and insights coming soon.</p>
                </div>
              </div>
            )}
</div>
        </motion.div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Upload New Jewelry</h2>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <ApperIcon name="X" size={24} />
                  </button>
                </div>

                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Jewelry Name"
                      name="name"
                      value={uploadForm.name}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Price (₹)"
                      name="price"
                      type="number"
                      value={uploadForm.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <Input
                    label="Description"
                    name="description"
                    value={uploadForm.description}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Category"
                      name="category"
                      value={uploadForm.category}
                      onChange={handleInputChange}
                      placeholder="e.g., Rings, Necklaces, Earrings"
                      required
                    />
                    <Input
                      label="Metal"
                      name="metal"
                      value={uploadForm.metal}
                      onChange={handleInputChange}
                      placeholder="e.g., Gold, Silver, Platinum"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Weight"
                      name="weight"
                      value={uploadForm.weight}
                      onChange={handleInputChange}
                      placeholder="e.g., 15g"
                    />
                    <Input
                      label="Purity"
                      name="purity"
                      value={uploadForm.purity}
                      onChange={handleInputChange}
                      placeholder="e.g., 22K Gold, 18K Gold"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Stock Quantity"
                      name="stock"
                      type="number"
                      value={uploadForm.stock}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Occasion"
                      name="occasion"
                      value={uploadForm.occasion}
                      onChange={handleInputChange}
                      placeholder="e.g., Wedding, Party, Daily Wear"
                    />
                  </div>

                  <Input
                    label="Gemstones (comma-separated)"
                    name="gemstones"
                    value={uploadForm.gemstones}
                    onChange={handleInputChange}
                    placeholder="e.g., Diamond, Ruby, Emerald"
                  />

                  <Input
                    label="Art Form"
                    name="artform"
                    value={uploadForm.artform}
                    onChange={handleInputChange}
                    placeholder="e.g., Kundan, Polki, Contemporary"
                  />

                  <Input
                    label="Images (comma-separated URLs)"
                    name="images"
                    value={uploadForm.images}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    multiline
                    rows={2}
                    required
                  />

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowUploadModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={uploading}>
                      {uploading ? (
                        <>
                          <ApperIcon name="Loader2" size={20} className="mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="Upload" size={20} className="mr-2" />
                          Upload Jewelry
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}