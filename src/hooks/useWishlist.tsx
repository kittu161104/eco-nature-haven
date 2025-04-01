
import { useState, useEffect, useCallback } from 'react';
import { ProductProps } from '@/components/ProductCard';

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  
  // Load wishlist from localStorage on initial load
  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      setWishlistItems(JSON.parse(storedWishlist));
    }
  }, []);
  
  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    
    // Dispatch custom event for wishlist update
    window.dispatchEvent(new CustomEvent('wishlist-updated'));
  }, [wishlistItems]);
  
  // Check if a product is in the wishlist
  const isInWishlist = useCallback((productId: string) => {
    return wishlistItems.includes(productId);
  }, [wishlistItems]);
  
  // Add a product to the wishlist
  const addToWishlist = useCallback((productId: string) => {
    if (!isInWishlist(productId)) {
      setWishlistItems(prev => [...prev, productId]);
    }
  }, [isInWishlist]);
  
  // Remove a product from the wishlist
  const removeFromWishlist = useCallback((productId: string) => {
    setWishlistItems(prev => prev.filter(id => id !== productId));
  }, []);
  
  // Toggle a product in the wishlist
  const toggleWishlist = useCallback((productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
      return false;
    } else {
      addToWishlist(productId);
      return true;
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);
  
  // Get all wishlist items as product objects
  const getWishlistProducts = useCallback(() => {
    const storedProducts = localStorage.getItem('products');
    if (!storedProducts) return [];
    
    const allProducts: ProductProps[] = JSON.parse(storedProducts);
    return allProducts.filter(product => wishlistItems.includes(product.id));
  }, [wishlistItems]);
  
  return {
    wishlistItems,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    getWishlistProducts,
  };
}
