
import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage, throttleFunction } from '@/lib/storage-utils';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export function useCart() {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('cart', []);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Throttled notification function to prevent excessive renders
  const notifyCartUpdate = useCallback(throttleFunction(() => {
    window.dispatchEvent(new CustomEvent('cart-updated'));
  }, 300), []);
  
  // Effect to notify about cart updates
  useEffect(() => {
    notifyCartUpdate();
  }, [cartItems, notifyCartUpdate]);
  
  // Add item to cart with rate limiting
  const addToCart = useCallback((product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  }) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    setCartItems(prev => {
      // Check if product already exists in cart
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if item exists
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Add new item to cart
        return [...prev, { ...product, quantity: 1 }];
      }
    });
    
    // Prevent rapid successive calls
    setTimeout(() => setIsProcessing(false), 300);
    
    return true;
  }, [setCartItems, isProcessing]);
  
  // Update item quantity
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (isProcessing || quantity < 1) return;
    
    setIsProcessing(true);
    setCartItems(prev => 
      prev.map(item => item.id === itemId ? { ...item, quantity } : item)
    );
    
    setTimeout(() => setIsProcessing(false), 300);
  }, [setCartItems, isProcessing]);
  
  // Remove item from cart
  const removeFromCart = useCallback((itemId: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    
    setTimeout(() => setIsProcessing(false), 300);
  }, [setCartItems, isProcessing]);
  
  // Clear cart
  const clearCart = useCallback(() => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setCartItems([]);
    
    setTimeout(() => setIsProcessing(false), 300);
  }, [setCartItems, isProcessing]);
  
  // Calculate total
  const getTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);
  
  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotal,
    isProcessing,
  };
}
