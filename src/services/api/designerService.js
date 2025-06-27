import designersData from '../mockData/designers.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DesignerService {
  constructor() {
    this.designers = [...designersData];
  }

  async getAll(filters = {}) {
    await delay(300);
    let result = [...this.designers];

    if (filters.specialty) {
      result = result.filter(designer =>
        designer.specialties.some(s => 
          s.toLowerCase().includes(filters.specialty.toLowerCase())
        )
      );
    }

    if (filters.location) {
      result = result.filter(designer =>
        designer.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.minRating) {
      result = result.filter(designer => designer.rating >= filters.minRating);
    }

    return result;
  }

  async getById(id) {
    await delay(250);
    const designer = this.designers.find(d => d.Id === parseInt(id, 10));
    if (!designer) {
      throw new Error('Designer not found');
    }
    return { ...designer };
  }

  async create(designerData) {
    await delay(400);
    const maxId = Math.max(...this.designers.map(d => d.Id));
    const newDesigner = {
      Id: maxId + 1,
      ...designerData,
      rating: 0,
      completedOrders: 0,
      activeOrders: 0,
      portfolio: [],
      createdAt: new Date().toISOString()
    };
    
    this.designers.push(newDesigner);
    return { ...newDesigner };
  }

  async update(id, designerData) {
    await delay(350);
    const index = this.designers.findIndex(d => d.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Designer not found');
    }
    
    this.designers[index] = {
      ...this.designers[index],
      ...designerData,
      Id: parseInt(id, 10),
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.designers[index] };
  }

  async addPortfolioItem(id, portfolioItem) {
    await delay(300);
    const index = this.designers.findIndex(d => d.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Designer not found');
    }

    const maxPortfolioId = Math.max(
      0,
      ...this.designers[index].portfolio.map(p => p.id)
    );
    
    const newPortfolioItem = {
      id: maxPortfolioId + 1,
      ...portfolioItem,
      createdAt: new Date().toISOString()
    };

    this.designers[index].portfolio.push(newPortfolioItem);
    this.designers[index].updatedAt = new Date().toISOString();
    
    return { ...this.designers[index] };
  }

  async removePortfolioItem(designerId, portfolioItemId) {
    await delay(250);
    const index = this.designers.findIndex(d => d.Id === parseInt(designerId, 10));
    if (index === -1) {
      throw new Error('Designer not found');
    }

    const portfolioIndex = this.designers[index].portfolio.findIndex(
      p => p.id === portfolioItemId
    );
    if (portfolioIndex === -1) {
      throw new Error('Portfolio item not found');
    }

    this.designers[index].portfolio.splice(portfolioIndex, 1);
    this.designers[index].updatedAt = new Date().toISOString();
    
    return { ...this.designers[index] };
  }

  async getSpecialties() {
    await delay(200);
    const allSpecialties = this.designers.flatMap(d => d.specialties);
    return [...new Set(allSpecialties)];
  }

  async getLocations() {
    await delay(200);
    const locations = this.designers.map(d => d.location);
    return [...new Set(locations)];
  }

  async delete(id) {
    await delay(300);
    const index = this.designers.findIndex(d => d.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Designer not found');
    }
    
    const deletedDesigner = this.designers.splice(index, 1)[0];
    return { ...deletedDesigner };
  }
}

export default new DesignerService();