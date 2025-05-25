
// Analytics utility functions for dashboard
export interface OrderAnalytics {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  revenue: number;
  averageOrderValue: number;
}

export interface TimeFilter {
  label: string;
  value: 'week' | 'month' | '6months' | 'year' | 'total';
  days: number;
}

export const TIME_FILTERS: TimeFilter[] = [
  { label: 'This Week', value: 'week', days: 7 },
  { label: 'This Month', value: 'month', days: 30 },
  { label: 'Last 6 Months', value: '6months', days: 180 },
  { label: 'Last Year', value: 'year', days: 365 },
  { label: 'Total', value: 'total', days: 0 },
];

export const getDateRange = (filter: TimeFilter): { startDate: Date; endDate: Date } => {
  const endDate = new Date();
  const startDate = new Date();
  
  if (filter.value === 'total') {
    startDate.setFullYear(2020, 0, 1); // Far back date for total
  } else {
    startDate.setDate(startDate.getDate() - filter.days);
  }
  
  return { startDate, endDate };
};

export const analyzeOrders = (orders: any[], filter: TimeFilter): OrderAnalytics => {
  const { startDate, endDate } = getDateRange(filter);
  
  // Filter orders by date range
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.date || order.createdAt);
    return orderDate >= startDate && orderDate <= endDate;
  });

  const completedOrders = filteredOrders.filter(order => 
    order.status === 'completed' || order.status === 'delivered'
  );

  const pendingOrders = filteredOrders.filter(order => 
    order.status === 'pending' || order.status === 'processing'
  );

  const revenue = completedOrders.reduce((total, order) => {
    return total + (order.total || order.amount || 0);
  }, 0);

  const averageOrderValue = completedOrders.length > 0 
    ? revenue / completedOrders.length 
    : 0;

  return {
    totalOrders: filteredOrders.length,
    completedOrders: completedOrders.length,
    pendingOrders: pendingOrders.length,
    revenue,
    averageOrderValue,
  };
};

export const getRecentActivity = (orders: any[], products: any[]): any[] => {
  const activities: any[] = [];
  
  // Recent orders (last 10)
  const recentOrders = orders
    .sort((a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime())
    .slice(0, 10);

  recentOrders.forEach(order => {
    if (order.status === 'pending') {
      activities.push({
        type: 'new_order',
        title: 'New Order Received',
        description: `Order #${order.id} for ₹${order.total}`,
        time: order.date || order.createdAt,
        icon: 'package',
      });
    } else if (order.status === 'cancelled') {
      activities.push({
        type: 'order_cancelled',
        title: 'Order Cancelled',
        description: `Order #${order.id} was cancelled`,
        time: order.date || order.createdAt,
        icon: 'x-circle',
      });
    }
  });

  // Low stock products
  const lowStockProducts = products.filter(product => 
    (product.stock || 0) <= (product.lowStockThreshold || 10)
  );

  lowStockProducts.forEach(product => {
    activities.push({
      type: 'low_stock',
      title: 'Low Stock Alert',
      description: `${product.name} has only ${product.stock || 0} items left`,
      time: new Date().toISOString(),
      icon: 'alert-triangle',
    });
  });

  // Sort by time (most recent first)
  return activities
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 15);
};
