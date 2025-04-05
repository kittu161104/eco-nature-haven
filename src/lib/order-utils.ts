
/**
 * Generates a sequential order number that starts with 01 
 * and increments for each new order.
 */
export const generateOrderNumber = (): string => {
  // Get the current orders from localStorage
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  
  // Find the last order number
  let lastOrderNum = 0;
  
  if (orders.length > 0) {
    // Extract numeric part, assuming format 'ORD-XX'
    const lastOrder = orders[orders.length - 1];
    if (lastOrder && lastOrder.orderNumber) {
      const match = lastOrder.orderNumber.match(/^ORD-(\d+)$/);
      if (match && match[1]) {
        lastOrderNum = parseInt(match[1], 10);
      }
    }
  }
  
  // Increment order number
  const nextOrderNum = lastOrderNum + 1;
  
  // Format with leading zeros to ensure at least 2 digits
  return `ORD-${String(nextOrderNum).padStart(2, '0')}`;
};
