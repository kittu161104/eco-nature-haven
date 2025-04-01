
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/hooks/useWishlist";
import { ShoppingCart, Heart, Leaf } from "lucide-react";

export interface ProductProps {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  category: string;
  tags: string[];
  inStock: boolean;
}

const ProductCard = ({ product }: { product: ProductProps }) => {
  const [isWishlist, setIsWishlist] = useState(false);
  const { toast } = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const defaultImageUrl = "/placeholder.svg";

  // Check if product is in wishlist on initial load
  useEffect(() => {
    setIsWishlist(isInWishlist(product.id));
  }, [product.id, isInWishlist]);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newState = toggleWishlist(product.id);
    setIsWishlist(newState);
    
    toast({
      title: newState ? "Added to wishlist" : "Removed from wishlist",
      description: newState ? `${product.name} added to your wishlist` : `${product.name} removed from your wishlist`,
    });
  };

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get existing cart items
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    // Check if product already exists in cart
    const existingItem = existingCart.find((item: any) => item.id === product.id);
    
    let updatedCart;
    if (existingItem) {
      // Update quantity if item exists
      updatedCart = existingCart.map((item: any) => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      // Add new item to cart
      updatedCart = [
        ...existingCart, 
        { 
          id: product.id, 
          name: product.name, 
          price: product.discountPrice || product.price,
          quantity: 1,
          image: product.image
        }
      ];
    }
    
    // Save updated cart
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
    
    // Dispatch custom event for cart update
    window.dispatchEvent(new CustomEvent('cart-updated'));
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Discount badge */}
      {product.discountPrice && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          Sale
        </div>
      )}
      
      {/* Wishlist button */}
      <button 
        className="absolute top-2 right-2 z-10 bg-white p-1.5 rounded-full shadow-sm opacity-70 hover:opacity-100 transition-opacity"
        onClick={handleToggleWishlist}
        aria-label={isWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`h-4 w-4 ${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
      </button>
      
      {/* Product image */}
      <Link to={`/product/${product.id}`} className="block relative pt-[100%]">
        {product.image ? (
          <img 
            src={product.image || defaultImageUrl} 
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultImageUrl;
            }}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100">
            <Leaf className="h-12 w-12 text-gray-300" />
          </div>
        )}
      </Link>
      
      {/* Product info */}
      <div className="p-4">
        <div className="mb-4">
          <span className="text-xs font-medium text-eco-600 uppercase tracking-wider">
            {product.category}
          </span>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-medium text-gray-900 mt-1 hover:text-eco-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>
        
        {/* Price and add to cart */}
        <div className="flex items-center justify-between">
          <div>
            {product.discountPrice ? (
              <div className="flex items-center space-x-2">
                <span className="font-medium text-lg text-gray-900">₹{product.discountPrice.toFixed(2)}</span>
                <span className="text-sm text-gray-500 line-through">₹{product.price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="font-medium text-lg text-gray-900">₹{product.price.toFixed(2)}</span>
            )}
          </div>
          <Button 
            size="sm" 
            className="bg-eco-600 hover:bg-eco-700 text-white"
            onClick={addToCart}
            disabled={!product.inStock}
          >
            {product.inStock ? (
              <>
                <ShoppingCart className="h-4 w-4 mr-1" />
                <span className="sr-only sm:not-sr-only sm:text-xs">Add</span>
              </>
            ) : (
              <span className="text-xs">Out of stock</span>
            )}
          </Button>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {product.tags.map((tag, index) => (
              <span 
                key={index} 
                className="text-xs bg-eco-50 text-eco-800 px-1.5 py-0.5 rounded-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
