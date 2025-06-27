import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import CartSidebar from '@/components/organisms/CartSidebar';

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: 'Guest', role: 'customer' });
  const [cartItemCount, setCartItemCount] = useState(3);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navigationItems = [
    { path: '/', label: 'Shop', icon: 'Store' },
    { path: '/custom-order', label: 'Custom Orders', icon: 'Palette' },
    { path: '/my-orders', label: 'My Orders', icon: 'Package' }
  ];

  const roleBasedNavigation = {
    designer: [
      { path: '/designer', label: 'Designer Portal', icon: 'Brush' }
    ],
    admin: [
      { path: '/admin', label: 'Admin Dashboard', icon: 'Settings' }
    ]
  };

  const allNavItems = [
    ...navigationItems,
    ...(roleBasedNavigation[currentUser.role] || [])
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-surface-200 z-40 sticky top-0 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <NavLink to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-yellow-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Gem" className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-display font-semibold text-secondary">Svarana</span>
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {allNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'text-primary bg-primary/10 border-b-2 border-primary'
                        : 'text-secondary hover:text-primary hover:bg-primary/5'
                    }`
                  }
                >
                  <ApperIcon name={item.icon} className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-secondary hover:text-primary transition-colors duration-200"
              >
                <ApperIcon name="ShoppingCart" className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {cartItemCount}
                  </span>
                )}
              </button>
              
              <div className="flex items-center space-x-2 pl-4 border-l border-surface-200">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" className="w-4 h-4 text-primary" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-secondary">{currentUser.name}</div>
                  <div className="text-surface-500 capitalize">{currentUser.role}</div>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-secondary hover:text-primary transition-colors duration-200"
            >
              <ApperIcon name={isMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-surface-200 bg-white"
            >
              <div className="px-4 py-4 space-y-2">
                {allNavItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                        isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-secondary hover:text-primary hover:bg-primary/5'
                      }`
                    }
                  >
                    <ApperIcon name={item.icon} className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                ))}
                
                <div className="border-t border-surface-200 pt-4 mt-4">
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-secondary hover:text-primary hover:bg-primary/5 transition-colors duration-200 w-full"
                  >
                    <ApperIcon name="ShoppingCart" className="w-5 h-5" />
                    <span className="font-medium">Cart ({cartItemCount})</span>
                  </button>
                  
                  <div className="flex items-center space-x-3 px-4 py-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-secondary">{currentUser.name}</div>
                      <div className="text-sm text-surface-500 capitalize">{currentUser.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-surface-200 z-40">
        <div className="flex items-center justify-around py-2">
          {navigationItems.slice(0, 4).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center space-y-1 px-3 py-2 transition-colors duration-200 ${
                  isActive ? 'text-primary' : 'text-surface-500'
                }`
              }
            >
              <ApperIcon name={item.icon} className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label.split(' ')[0]}</span>
            </NavLink>
          ))}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center space-y-1 px-3 py-2 text-surface-500 relative"
          >
            <ApperIcon name="ShoppingCart" className="w-5 h-5" />
            <span className="text-xs font-medium">Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 right-2 w-4 h-4 bg-accent text-white text-xs rounded-full flex items-center justify-center font-medium">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Layout;