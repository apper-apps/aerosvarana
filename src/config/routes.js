import Shop from '@/components/pages/Shop';
import ProductDetail from '@/components/pages/ProductDetail';
import CustomOrder from '@/components/pages/CustomOrder';
import Cart from '@/components/pages/Cart';
import Checkout from '@/components/pages/Checkout';
import OrderTracking from '@/components/pages/OrderTracking';
import DesignerDashboard from '@/components/pages/DesignerDashboard';
import AdminDashboard from '@/components/pages/AdminDashboard';
import Profile from '@/components/pages/Profile';
import MyOrders from '@/components/pages/MyOrders';
import Login from '@/components/pages/Login';
export const routes = {
  shop: {
    id: 'shop',
    label: 'Shop',
    path: '/',
    icon: 'Store',
    component: Shop
  },
  customOrder: {
    id: 'customOrder',
    label: 'Custom Orders',
    path: '/custom-order',
    icon: 'Palette',
    component: CustomOrder
  },
  myOrders: {
    id: 'myOrders',
    label: 'My Orders',
    path: '/my-orders',
    icon: 'Package',
    component: MyOrders
  },
  cart: {
    id: 'cart',
    label: 'Cart',
    path: '/cart',
    icon: 'ShoppingCart',
    component: Cart
  },
  checkout: {
    id: 'checkout',
    label: 'Checkout',
    path: '/checkout',
    icon: 'CreditCard',
    component: Checkout
  },
  orderTracking: {
    id: 'orderTracking',
    label: 'Order Tracking',
    path: '/orders/:id',
    icon: 'MapPin',
    component: OrderTracking
  },
  productDetail: {
    id: 'productDetail',
    label: 'Product Detail',
    path: '/product/:id',
    icon: 'Eye',
    component: ProductDetail
  },
  designerDashboard: {
    id: 'designerDashboard',
    label: 'Designer Portal',
    path: '/designer',
    icon: 'Brush',
    component: DesignerDashboard
  },
  adminDashboard: {
    id: 'adminDashboard',
    label: 'Admin Dashboard',
    path: '/admin',
    icon: 'Settings',
    component: AdminDashboard
  },
profile: {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: 'User',
    component: Profile
  },
  login: {
    id: 'login',
    label: 'Login',
    path: '/login',
    icon: 'LogIn',
    component: Login
  }
};

export const routeArray = Object.values(routes);
export default routes;