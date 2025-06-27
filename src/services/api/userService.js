import mockUsers from '@/services/mockData/users.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock authentication service
class UserService {
  constructor() {
    this.currentUser = this.getCurrentUser();
  }

  // Get current authenticated user from localStorage
  getCurrentUser() {
    try {
      const stored = localStorage.getItem('currentUser');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  }

  // Login with email and role
  async login(email, role = 'customer') {
    await delay(300);
    
    // Find user by email
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new Error('User not found. Please check your email address.');
    }

    // For demo purposes, allow role switching
    const authenticatedUser = {
      ...user,
      role: role // Allow role override for demo
    };

    // Store in localStorage
    localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
    this.currentUser = authenticatedUser;

    return authenticatedUser;
  }

  // Logout current user
  async logout() {
    await delay(200);
    
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    
    return true;
  }

  // Get user profile
  async getProfile() {
    await delay(200);
    
    if (!this.currentUser) {
      throw new Error('No authenticated user found');
    }

    return { ...this.currentUser };
  }

  // Update user profile
  async updateProfile(updates) {
    await delay(300);
    
    if (!this.currentUser) {
      throw new Error('No authenticated user found');
    }

    const updatedUser = {
      ...this.currentUser,
      ...updates,
      Id: this.currentUser.Id // Preserve ID
    };

    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    this.currentUser = updatedUser;

    return updatedUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Check user role
  hasRole(role) {
    return this.currentUser && this.currentUser.role === role;
  }

  // Get all users (admin only)
  async getAllUsers() {
    await delay(200);
    
    if (!this.hasRole('admin')) {
      throw new Error('Access denied. Admin role required.');
    }

    return [...mockUsers];
  }
}

const userService = new UserService();
export default userService;