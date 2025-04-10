
import { useState, useEffect, useCallback } from 'react';
import { ProductProps } from '@/components/ProductCard';
import { useLocalStorage, throttleFunction } from '@/lib/storage-utils';

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useLocalStorage<string[]>('wishlist', []);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Dispatch custom event for wishlist update - throttled to prevent excessive renders
  const notifyWishlistUpdate = useCallback(throttleFunction(() => {
    window.dispatchEvent(new CustomEvent('wishlist-updated'));
  }, 300), []);
  
  // Effect to notify about wishlist updates
  useEffect(() => {
    notifyWishlistUpdate();
  }, [wishlistItems, notifyWishlistUpdate]);
  
  // Check if a product is in the wishlist
  const isInWishlist = useCallback((productId: string) => {
    return wishlistItems.includes(productId);
  }, [wishlistItems]);
  
  // Add a product to the wishlist with rate limiting
  const addToWishlist = useCallback((productId: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    if (!isInWishlist(productId)) {
      setWishlistItems(prev => [...prev, productId]);
    }
    
    // Prevent rapid successive calls
    setTimeout(() => setIsProcessing(false), 300);
  }, [isInWishlist, setWishlistItems, isProcessing]);
  
  // Remove a product from the wishlist with rate limiting
  const removeFromWishlist = useCallback((productId: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setWishlistItems(prev => prev.filter(id => id !== productId));
    
    // Prevent rapid successive calls
    setTimeout(() => setIsProcessing(false), 300);
  }, [setWishlistItems, isProcessing]);
  
  // Toggle a product in the wishlist
  const toggleWishlist = useCallback((productId: string) => {
    if (isProcessing) return undefined;
    
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
      return false;
    } else {
      addToWishlist(productId);
      return true;
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist, isProcessing]);
  
  // Clear all items from the wishlist
  const clearWishlist = useCallback(() => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setWishlistItems([]);
    
    setTimeout(() => setIsProcessing(false), 300);
  }, [setWishlistItems, isProcessing]);
  
  // Get all wishlist items as product objects with error handling
  const getWishlistProducts = useCallback(() => {
    try {
      const storedProducts = localStorage.getItem('products');
      if (!storedProducts) return [];
      
      const allProducts: ProductProps[] = JSON.parse(storedProducts);
      return allProducts.filter(product => wishlistItems.includes(product.id));
    } catch (error) {
      console.error("Error retrieving wishlist products:", error);
      return [];
    }
  }, [wishlistItems]);
  
  return {
    wishlistItems,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    getWishlistProducts,
    isProcessing,
  };
}
