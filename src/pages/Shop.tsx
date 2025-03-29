
import { useState } from "react";
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

// Sample products (using the same data from FeaturedProducts for now)
const sampleProducts: ProductProps[] = [
  {
    id: "1",
    name: "Peace Lily",
    description: "A beautiful indoor plant that purifies the air and requires minimal care.",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1593482892290-f54927ae2bb2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Indoor",
    tags: ["Air purifying", "Low light"],
    inStock: true,
  },
  {
    id: "2",
    name: "Snake Plant",
    description: "A hardy indoor plant that thrives with minimal attention. Perfect for beginners.",
    price: 24.99,
    discountPrice: 19.99,
    image: "https://images.unsplash.com/photo-1620127252536-03bdfcf6d5c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Indoor",
    tags: ["Air purifying", "Low maintenance"],
    inStock: true,
  },
  {
    id: "3",
    name: "Lavender Plant",
    description: "A fragrant outdoor plant that attracts beneficial pollinators to your garden.",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1528092744838-b91de0a10615?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Outdoor",
    tags: ["Fragrant", "Pollinators"],
    inStock: true,
  },
  {
    id: "4",
    name: "Rosemary Herb",
    description: "A versatile culinary herb with a delightful aroma, perfect for cooking.",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1515586000433-45406d8e6662?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Herbs",
    tags: ["Culinary", "Fragrant"],
    inStock: true,
  },
  {
    id: "5",
    name: "Aloe Vera",
    description: "A succulent with healing properties, ideal for treating minor burns and skin irritations.",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1596547609652-9cf5d8c3a26e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Succulents",
    tags: ["Medicinal", "Low maintenance"],
    inStock: false,
  },
  {
    id: "6",
    name: "Fiddle Leaf Fig",
    description: "A popular decorative indoor plant with large, glossy violin-shaped leaves.",
    price: 49.99,
    discountPrice: 39.99,
    image: "https://images.unsplash.com/photo-1613733895930-53ad1a53d907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Indoor",
    tags: ["Decorative", "Statement plant"],
    inStock: true,
  },
  {
    id: "7",
    name: "Echeveria Succulent",
    description: "A beautiful rosette-forming succulent with blue-green leaves.",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Succulents",
    tags: ["Drought tolerant", "Low maintenance"],
    inStock: true,
  },
  {
    id: "8",
    name: "Basil Plant",
    description: "An essential culinary herb with aromatic leaves, perfect for Italian cuisine.",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1582556135623-653d934f2707?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Herbs",
    tags: ["Culinary", "Annual"],
    inStock: true,
  },
  {
    id: "9",
    name: "Monstera Deliciosa",
    description: "A popular tropical plant with distinctive split leaves, also known as Swiss Cheese Plant.",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Indoor",
    tags: ["Tropical", "Statement plant"],
    inStock: true,
  },
  {
    id: "10",
    name: "Mint Plant",
    description: "A refreshing herb perfect for teas, cocktails, and culinary creations.",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1628556270448-4d4e4148e0b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Herbs",
    tags: ["Culinary", "Fragrant"],
    inStock: true,
  },
  {
    id: "11",
    name: "Boston Fern",
    description: "A classic air-purifying fern with delicate, arching fronds.",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1597055181979-4ea68359aefa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Indoor",
    tags: ["Humid loving", "Air purifying"],
    inStock: true,
  },
  {
    id: "12",
    name: "Pothos",
    description: "An incredibly adaptable trailing plant, perfect for hanging baskets or shelves.",
    price: 17.99,
    discountPrice: 14.99,
    image: "https://images.unsplash.com/photo-1507746212228-2d3645cbeb56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Indoor",
    tags: ["Air purifying", "Low light"],
    inStock: true,
  },
];

const categories = ["Indoor", "Outdoor", "Succulents", "Herbs"];
const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [sortBy, setSortBy] = useState("Featured");
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter products based on selected filters
  const filteredProducts = sampleProducts.filter((product) => {
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
        return parseInt(b.id) - parseInt(a.id);
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
                
                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <Slider
                    defaultValue={priceRange}
                    max={100}
                    step={5}
                    onValueChange={setPriceRange}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
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
                    setPriceRange([0, 50]);
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
                
                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <Slider
                    defaultValue={priceRange}
                    max={100}
                    step={5}
                    onValueChange={setPriceRange}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
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
                    setPriceRange([0, 50]);
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
              {sortedProducts.length > 0 ? (
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
                    Try adjusting your search or filter criteria
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSelectedCategories([]);
                      setPriceRange([0, 50]);
                      setShowOnlyInStock(false);
                      setSearchTerm("");
                    }}
                  >
                    Clear All Filters
                  </Button>
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
