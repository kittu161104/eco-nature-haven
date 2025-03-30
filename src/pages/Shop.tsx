
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ProductProps } from "@/components/ProductCard";
import ProductCard from "@/components/ProductCard";
import { Search, Leaf, Filter, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Shop = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("Featured");
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];

  // Load products from localStorage
  useEffect(() => {
    const loadProducts = () => {
      setLoading(true);
      const storedProducts = localStorage.getItem("products");
      if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts);
        setProducts(parsedProducts);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(parsedProducts.map((p: ProductProps) => p.category))] as string[];
        setCategories(uniqueCategories);
        
        // Set max price range based on product prices
        if (parsedProducts.length > 0) {
          const maxPrice = Math.max(...parsedProducts.map((p: ProductProps) => p.price));
          setPriceRange([0, Math.ceil(maxPrice / 100) * 100]);
        }
      } else {
        setProducts([]);
        setCategories([]);
      }
      setLoading(false);
    };
    
    // Initial load
    loadProducts();
    
    // Set up a listener for product updates from admin panel
    const handleProductUpdates = () => {
      loadProducts();
    };
    
    window.addEventListener('products-updated', handleProductUpdates);
    
    return () => {
      window.removeEventListener('products-updated', handleProductUpdates);
    };
  }, []);

  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    // Search term filter
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !product.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    
    // Price range filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    
    // In stock filter
    if (showOnlyInStock && !product.inStock) {
      return false;
    }
    
    return true;
  });
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aPrice = a.discountPrice || a.price;
    const bPrice = b.discountPrice || b.price;
    
    switch (sortBy) {
      case "Price: Low to High":
        return aPrice - bPrice;
      case "Price: High to Low":
        return bPrice - aPrice;
      case "Newest":
        // This would normally use a timestamp, but for this demo we'll use ID as a proxy
        return parseInt(b.id.replace(/\D/g, '')) - parseInt(a.id.replace(/\D/g, ''));
      default: // Featured - keep original order
        return 0;
    }
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Shop Hero */}
        <div className="bg-eco-100 py-12">
          <div className="eco-container">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-eco-800 mb-4">
                Shop Our Collection
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover our wide range of sustainable plants, gardening supplies, and eco-friendly decor
              </p>
            </div>
          </div>
        </div>
        
        {/* Shop Content */}
        <div className="eco-container py-8">
          {/* Search and Sort */}
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="search"
                placeholder="Search plants..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                className="md:hidden flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
                <select 
                  className="text-sm border rounded-md px-2 py-1.5"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters - Mobile */}
            {showFilters && (
              <div className="md:hidden bg-white p-4 rounded-lg shadow-sm border mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg">Filters</h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-500"
                    onClick={() => setShowFilters(false)}
                  >
                    <X size={18} />
                  </Button>
                </div>
                
                {/* Categories */}
                {categories.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Categories</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center">
                          <Checkbox 
                            id={`category-mobile-${category}`} 
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCategories([...selectedCategories, category]);
                              } else {
                                setSelectedCategories(selectedCategories.filter((c) => c !== category));
                              }
                            }}
                          />
                          <Label 
                            htmlFor={`category-mobile-${category}`} 
                            className="ml-2 text-sm font-normal cursor-pointer"
                          >
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <Slider
                    value={priceRange}
                    max={priceRange[1]}
                    step={10}
                    onValueChange={setPriceRange}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
                
                {/* Availability */}
                <div>
                  <h4 className="font-medium mb-3">Availability</h4>
                  <div className="flex items-center">
                    <Checkbox 
                      id="in-stock-mobile" 
                      checked={showOnlyInStock}
                      onCheckedChange={(checked) => setShowOnlyInStock(!!checked)}
                    />
                    <Label 
                      htmlFor="in-stock-mobile" 
                      className="ml-2 text-sm font-normal cursor-pointer"
                    >
                      In Stock Only
                    </Label>
                  </div>
                </div>
                
                {/* Clear filters button */}
                <Button 
                  variant="outline" 
                  className="w-full mt-6"
                  onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange([0, priceRange[1]]);
                    setShowOnlyInStock(false);
                    setSearchTerm("");
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
            
            {/* Filters - Desktop */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="bg-white p-4 rounded-lg shadow-sm border sticky top-24">
                <h3 className="font-medium text-lg mb-4 flex items-center">
                  <Filter size={18} className="mr-2" />
                  Filters
                </h3>
                
                {/* Categories */}
                {categories.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Categories</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center">
                          <Checkbox 
                            id={`category-${category}`} 
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCategories([...selectedCategories, category]);
                              } else {
                                setSelectedCategories(selectedCategories.filter((c) => c !== category));
                              }
                            }}
                          />
                          <Label 
                            htmlFor={`category-${category}`} 
                            className="ml-2 text-sm font-normal cursor-pointer"
                          >
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <Slider
                    value={priceRange}
                    max={priceRange[1]}
                    step={10}
                    onValueChange={setPriceRange}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
                
                {/* Availability */}
                <div>
                  <h4 className="font-medium mb-3">Availability</h4>
                  <div className="flex items-center">
                    <Checkbox 
                      id="in-stock" 
                      checked={showOnlyInStock}
                      onCheckedChange={(checked) => setShowOnlyInStock(!!checked)}
                    />
                    <Label 
                      htmlFor="in-stock" 
                      className="ml-2 text-sm font-normal cursor-pointer"
                    >
                      In Stock Only
                    </Label>
                  </div>
                </div>
                
                {/* Clear filters button */}
                <Button 
                  variant="outline" 
                  className="w-full mt-6"
                  onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange([0, priceRange[1]]);
                    setShowOnlyInStock(false);
                    setSearchTerm("");
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
            
            {/* Product Grid */}
            <div className="flex-grow">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-pulse">Loading products...</div>
                </div>
              ) : sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Leaf className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
                  <p className="text-gray-600 mb-4">
                    {products.length === 0 
                      ? "No products available in our store. Please check back later!"
                      : "Try adjusting your search or filter criteria"
                    }
                  </p>
                  {products.length > 0 && (
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSelectedCategories([]);
                        setPriceRange([0, priceRange[1]]);
                        setShowOnlyInStock(false);
                        setSearchTerm("");
                      }}
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
