
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductProps } from "@/components/ProductCard";
import { ShoppingCart, Heart, Leaf, ArrowLeft, ChevronRight, Star, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const defaultImageUrl = "/placeholder.svg";

  useEffect(() => {
    // Reset scroll position when changing products
    window.scrollTo(0, 0);
    
    setLoading(true);
    
    const loadProduct = () => {
      // Get all products from localStorage
      const storedProducts = localStorage.getItem("products");
      if (!storedProducts) {
        setLoading(false);
        return;
      }
      
      const parsedProducts = JSON.parse(storedProducts);
      const foundProduct = parsedProducts.find((p: ProductProps) => p.id === id);
      
      if (foundProduct) {
        setProduct(foundProduct);
        
        // Find related products (same category, excluding current product)
        const related = parsedProducts
          .filter((p: ProductProps) => 
            p.id !== id && p.category === foundProduct.category
          )
          .slice(0, 4);
          
        setRelatedProducts(related);
      }
      
      setLoading(false);
    };
    
    loadProduct();
  }, [id]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const addToCart = () => {
    if (!product) return;
    
    // Get existing cart items
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    // Check if product already exists in cart
    const existingItem = existingCart.find((item: any) => item.id === product.id);
    
    let updatedCart;
    if (existingItem) {
      // Update quantity if item exists
      updatedCart = existingCart.map((item: any) => 
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      // Add new item to cart
      updatedCart = [
        ...existingCart, 
        { 
          id: product.id, 
          name: product.name, 
          price: product.discountPrice || product.price,
          quantity: quantity,
          image: product.image
        }
      ];
    }
    
    // Save updated cart
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    
    toast({
      title: "Added to cart",
      description: `${quantity} ${quantity === 1 ? 'item' : 'items'} added to your cart`,
    });
    
    // Dispatch custom event for cart update
    window.dispatchEvent(new CustomEvent('cart-updated'));
  };

  const toggleWishlist = () => {
    setIsWishlist(!isWishlist);
    toast({
      title: isWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlist 
        ? `${product?.name} removed from your wishlist` 
        : `${product?.name} added to your wishlist`,
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow eco-container py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-200 rounded aspect-square"></div>
              <div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-16 bg-gray-200 rounded w-full mb-4 mt-6"></div>
                <div className="h-10 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow eco-container py-12">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate('/shop')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
          
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <Leaf className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-medium text-gray-900 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-6">
              Sorry, we couldn't find the product you're looking for.
            </p>
            <Button onClick={() => navigate('/shop')}>
              Browse Our Products
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="eco-container py-8">
          {/* Breadcrumbs */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/shop?category=${product.category}`}>
                  {product.category}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem className="truncate max-w-[200px]">
                <span className="text-gray-500 truncate">{product.name}</span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          {/* Product section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Product image */}
            <div className="bg-white rounded-lg overflow-hidden border shadow-sm">
              {product.image ? (
                <img 
                  src={product.image || defaultImageUrl} 
                  alt={product.name}
                  className="w-full h-auto object-cover aspect-square"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = defaultImageUrl;
                  }}
                />
              ) : (
                <div className="w-full aspect-square flex items-center justify-center bg-gray-100">
                  <Leaf className="h-24 w-24 text-gray-300" />
                </div>
              )}
            </div>
            
            {/* Product info */}
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-eco-600 font-medium uppercase tracking-wider">
                    {product.category}
                  </span>
                  {!product.inStock && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full font-medium">
                      Out of Stock
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-2">
                  {product.name}
                </h1>
                
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className="h-4 w-4 text-yellow-400 fill-yellow-400" 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    (16 reviews)
                  </span>
                </div>
                
                <div className="mb-6">
                  {product.discountPrice ? (
                    <div className="flex items-center">
                      <span className="text-3xl font-bold text-gray-900 mr-3">
                        ₹{product.discountPrice.toFixed(2)}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        ₹{product.price.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{product.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  {product.description}
                </p>
                
                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-4">
                    {product.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="text-xs bg-eco-50 text-eco-800 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <div className="text-sm text-gray-700 font-medium mb-2">Quantity</div>
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="h-9 w-9"
                  >
                    -
                  </Button>
                  <div className="w-16 text-center mx-2">{quantity}</div>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="h-9 w-9"
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Button 
                  className={`flex-1 ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={addToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button
                  variant="outline"
                  className={`flex-1 ${isWishlist ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
                  onClick={toggleWishlist}
                >
                  <Heart className={`mr-2 h-4 w-4 ${isWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                  {isWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <Truck className="h-5 w-5 text-eco-600 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Free Shipping</h4>
                    <p className="text-sm text-gray-600">Orders over ₹500 qualify for free shipping</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product details tabs */}
          <div className="mb-16">
            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="p-6 bg-white rounded-b-lg border border-t-0">
                <h3 className="font-semibold text-lg mb-3">Product Description</h3>
                <p className="text-gray-600 mb-4">
                  {product.description}
                </p>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.
                </p>
              </TabsContent>
              <TabsContent value="specifications" className="p-6 bg-white rounded-b-lg border border-t-0">
                <h3 className="font-semibold text-lg mb-3">Product Specifications</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 border-b pb-2">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b pb-2">
                    <span className="text-gray-600">Product ID</span>
                    <span className="font-medium">{product.id}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b pb-2">
                    <span className="text-gray-600">Availability</span>
                    <span className="font-medium">{product.inStock ? "In Stock" : "Out of Stock"}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-gray-600">Tags</span>
                    <span className="font-medium">{product.tags?.join(", ") || "No tags"}</span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="p-6 bg-white rounded-b-lg border border-t-0">
                <h3 className="font-semibold text-lg mb-3">Customer Reviews</h3>
                <p className="text-gray-600 mb-4">
                  There are no reviews yet. Be the first to review this product.
                </p>
                <Button variant="outline">Write a Review</Button>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Related products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <div 
                    key={relatedProduct.id} 
                    className="bg-white rounded-lg shadow-sm overflow-hidden border cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/product/${relatedProduct.id}`)}
                  >
                    {relatedProduct.image ? (
                      <img 
                        src={relatedProduct.image || defaultImageUrl} 
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = defaultImageUrl;
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                        <Leaf className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 hover:text-eco-600">
                        {relatedProduct.name}
                      </h3>
                      {relatedProduct.discountPrice ? (
                        <div className="flex items-center mt-2">
                          <span className="font-medium text-gray-900 mr-2">₹{relatedProduct.discountPrice.toFixed(2)}</span>
                          <span className="text-sm text-gray-500 line-through">₹{relatedProduct.price.toFixed(2)}</span>
                        </div>
                      ) : (
                        <div className="mt-2 font-medium text-gray-900">₹{relatedProduct.price.toFixed(2)}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
