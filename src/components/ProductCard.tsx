
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart, Heart } from "lucide-react";

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

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlist(!isWishlist);
    toast({
      title: isWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlist ? `${product.name} removed from your wishlist` : `${product.name} added to your wishlist`,
    });
  };

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
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
        onClick={toggleWishlist}
        aria-label={isWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`h-4 w-4 ${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
      </button>
      
      {/* Product image */}
      <Link to={`/product/${product.id}`} className="block relative pt-[100%]">
        <img 
          src={product.image} 
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
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
                <span className="font-medium text-lg text-gray-900">${product.discountPrice.toFixed(2)}</span>
                <span className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="font-medium text-lg text-gray-900">${product.price.toFixed(2)}</span>
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
        {product.tags.length > 0 && (
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
