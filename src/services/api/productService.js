import productsData from "@/services/mockData/products.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProductService {
  constructor() {
    this.products = [...productsData];
  }

  async getAll(filters = {}) {
    await delay(300);
    let result = [...this.products];

    // Apply filters
    if (filters.category) {
      result = result.filter(product => 
        product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.metal) {
      result = result.filter(product => 
        product.metal.toLowerCase() === filters.metal.toLowerCase()
      );
    }

    if (filters.minPrice) {
      result = result.filter(product => product.price >= filters.minPrice);
    }

    if (filters.maxPrice) {
      result = result.filter(product => product.price <= filters.maxPrice);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
    }

    return result;
  }

  async getById(id) {
    await delay(200);
    const product = this.products.find(p => p.Id === parseInt(id, 10));
    if (!product) {
      throw new Error('Product not found');
    }
    return { ...product };
  }

  async getFeatured() {
    await delay(250);
    return this.products.slice(0, 4).map(product => ({ ...product }));
  }

  async getCategories() {
    await delay(200);
    const categories = [...new Set(this.products.map(p => p.category))];
    return categories;
  }

  async getMetalTypes() {
    await delay(200);
    const metals = [...new Set(this.products.map(p => p.metal))];
    return metals;
  }

  async getPriceRange() {
    await delay(200);
    const prices = this.products.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
};
  }

  async getByDesignerId(designerId) {
    await delay(250);
    const designerProducts = this.products.filter(p => p.designerId === parseInt(designerId, 10));
    return designerProducts.map(product => ({ ...product }));
  }

  async create(productData) {
    await delay(400);
    const maxId = Math.max(...this.products.map(p => p.Id));
    const newProduct = {
      Id: maxId + 1,
      ...productData,
      createdAt: new Date().toISOString()
    };
    this.products.push(newProduct);
    return { ...newProduct };
  }

  async update(id, productData) {
    await delay(350);
    const index = this.products.findIndex(p => p.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    this.products[index] = {
      ...this.products[index],
      ...productData,
      Id: parseInt(id, 10), // Ensure Id is not modified
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.products[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.products.findIndex(p => p.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    const deletedProduct = this.products.splice(index, 1)[0];
    return { ...deletedProduct };
  }
}

export default new ProductService();