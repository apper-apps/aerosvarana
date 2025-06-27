import cartData from '../mockData/cart.json';
import productService from './productService.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CartService {
  constructor() {
    this.cartItems = [...cartData];
  }

  async getAll() {
    await delay(250);
    const cartWithProducts = await Promise.all(
      this.cartItems.map(async (item) => {
        try {
          const product = await productService.getById(item.productId);
          return {
            ...item,
            product
          };
        } catch (error) {
          return null;
        }
      })
    );
    
    return cartWithProducts.filter(item => item !== null);
  }

  async add(productId, quantity = 1, selectedOptions = {}) {
    await delay(300);
    
    const existingItemIndex = this.cartItems.findIndex(
      item => item.productId === productId
    );

    if (existingItemIndex !== -1) {
      this.cartItems[existingItemIndex].quantity += quantity;
      this.cartItems[existingItemIndex].selectedOptions = {
        ...this.cartItems[existingItemIndex].selectedOptions,
        ...selectedOptions
      };
      return { ...this.cartItems[existingItemIndex] };
    }

    const maxId = Math.max(0, ...this.cartItems.map(item => item.Id));
    const newItem = {
      Id: maxId + 1,
      productId,
      quantity,
      selectedOptions,
      addedAt: new Date().toISOString()
    };

    this.cartItems.push(newItem);
    return { ...newItem };
  }

  async update(id, updateData) {
    await delay(250);
    const index = this.cartItems.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Cart item not found');
    }

    this.cartItems[index] = {
      ...this.cartItems[index],
      ...updateData,
      Id: parseInt(id, 10),
      updatedAt: new Date().toISOString()
    };

    return { ...this.cartItems[index] };
  }

  async remove(id) {
    await delay(200);
    const index = this.cartItems.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Cart item not found');
    }

    const removedItem = this.cartItems.splice(index, 1)[0];
    return { ...removedItem };
  }

  async clear() {
    await delay(200);
    const itemCount = this.cartItems.length;
    this.cartItems.length = 0;
    return { message: `Cleared ${itemCount} items from cart` };
  }

  async getTotal() {
    await delay(200);
    const cartWithProducts = await this.getAll();
    
    const subtotal = cartWithProducts.reduce(
      (total, item) => total + (item.product.price * item.quantity), 
      0
    );
    
    const tax = subtotal * 0.03; // 3% GST
    const shipping = subtotal > 50000 ? 0 : 500; // Free shipping above ₹50,000
    const total = subtotal + tax + shipping;

    return {
      subtotal,
      tax,
      shipping,
      total,
      itemCount: cartWithProducts.reduce((count, item) => count + item.quantity, 0)
    };
  }

  async getItemCount() {
    await delay(150);
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }
}

export default new CartService();