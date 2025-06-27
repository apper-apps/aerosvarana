import customOrdersData from '../mockData/customOrders.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CustomOrderService {
  constructor() {
    this.orders = [...customOrdersData];
  }

  async getAll(filters = {}) {
    await delay(300);
    let result = [...this.orders];

    if (filters.status) {
      result = result.filter(order => 
        order.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.customerId) {
      result = result.filter(order => order.customerId === filters.customerId);
    }

    if (filters.designerId) {
      result = result.filter(order => order.designerId === filters.designerId);
    }

    if (filters.priority) {
      result = result.filter(order => order.priority === filters.priority);
    }

    return result;
  }

  async getById(id) {
    await delay(250);
    const order = this.orders.find(o => o.Id === parseInt(id, 10));
    if (!order) {
      throw new Error('Order not found');
    }
    return { ...order };
  }

  async create(orderData) {
    await delay(400);
    const maxId = Math.max(...this.orders.map(o => o.Id));
    const newOrder = {
      Id: maxId + 1,
      ...orderData,
      status: 'Order Received',
      currentMilestone: 'Order Received',
      milestones: [
        {
          id: 1,
          name: 'Order Received',
          status: 'completed',
          date: new Date().toISOString(),
          images: [],
          notes: 'Order placed and payment confirmed'
        },
        {
          id: 2,
          name: 'Design Sketch',
          status: 'pending',
          date: null,
          images: [],
          notes: ''
        },
        {
          id: 3,
          name: 'Wax Model Creation',
          status: 'pending',
          date: null,
          images: [],
          notes: ''
        },
        {
          id: 4,
          name: 'Metal Casting',
          status: 'pending',
          date: null,
          images: [],
          notes: ''
        },
        {
          id: 5,
          name: 'Stone Setting',
          status: 'pending',
          date: null,
          images: [],
          notes: ''
        },
        {
          id: 6,
          name: 'Final Polish',
          status: 'pending',
          date: null,
          images: [],
          notes: ''
        },
        {
          id: 7,
          name: 'Quality Check',
          status: 'pending',
          date: null,
          images: [],
          notes: ''
        },
        {
          id: 8,
          name: 'Delivery',
          status: 'pending',
          date: null,
          images: [],
          notes: ''
        }
      ],
      createdAt: new Date().toISOString(),
      priority: orderData.priority || 'medium'
    };
    
    this.orders.push(newOrder);
    return { ...newOrder };
  }

  async update(id, orderData) {
    await delay(350);
    const index = this.orders.findIndex(o => o.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Order not found');
    }
    
    this.orders[index] = {
      ...this.orders[index],
      ...orderData,
      Id: parseInt(id, 10),
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.orders[index] };
  }

  async updateMilestone(orderId, milestoneId, milestoneData) {
    await delay(300);
    const orderIndex = this.orders.findIndex(o => o.Id === parseInt(orderId, 10));
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    const order = this.orders[orderIndex];
    const milestoneIndex = order.milestones.findIndex(m => m.id === milestoneId);
    if (milestoneIndex === -1) {
      throw new Error('Milestone not found');
    }

    order.milestones[milestoneIndex] = {
      ...order.milestones[milestoneIndex],
      ...milestoneData,
      date: milestoneData.status === 'completed' ? new Date().toISOString() : order.milestones[milestoneIndex].date
    };

    // Update current milestone if this one is completed
    if (milestoneData.status === 'completed') {
      const nextMilestone = order.milestones.find(m => m.status === 'pending');
      order.currentMilestone = nextMilestone ? nextMilestone.name : 'Completed';
      
      if (!nextMilestone) {
        order.status = 'Completed';
      } else {
        order.status = 'In Progress';
      }
    }

    order.updatedAt = new Date().toISOString();
    return { ...order };
  }

  async assignDesigner(orderId, designerId, designerName) {
    await delay(250);
    const index = this.orders.findIndex(o => o.Id === parseInt(orderId, 10));
    if (index === -1) {
      throw new Error('Order not found');
    }
    
    this.orders[index] = {
      ...this.orders[index],
      designerId,
      designerName,
      status: 'Assigned',
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.orders[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.orders.findIndex(o => o.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Order not found');
    }
    
    const deletedOrder = this.orders.splice(index, 1)[0];
    return { ...deletedOrder };
  }

  async getOrderStatistics() {
    await delay(200);
    const totalOrders = this.orders.length;
    const statusCounts = this.orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    const avgBudget = this.orders.reduce((sum, order) => sum + order.budget, 0) / totalOrders;
    
    return {
      totalOrders,
      statusCounts,
      averageBudget: Math.round(avgBudget)
    };
  }
}

export default new CustomOrderService();