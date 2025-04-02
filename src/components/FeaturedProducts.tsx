
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ProductCard, { ProductProps } from "./ProductCard";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

const FeaturedProducts = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Load products from localStorage and set up a listener for changes
  useEffect(() => {
    const loadProducts = () => {
      const storedProducts = localStorage.getItem("products");
      if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts);
        setProducts(parsedProducts);
        
        // Extract unique categories
        const uniqueCategories = ["All", ...new Set(parsedProducts.map((p: ProductProps) => p.category))] as string[];
        setCategories(uniqueCategories);
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

  const filteredProducts = activeCategory === "All"
    ? products.slice(0, 8) // Show only first 8 products on homepage
    : products.filter(product => product.category === activeCategory).slice(0, 8);

  return (
    <section className="py-16 bg-eco-50 dark:bg-gray-900 bg-opacity-70 dark:bg-opacity-30">
      <div className="eco-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-eco-800 dark:text-eco-300">Featured Plants</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Browse our selection of carefully curated plants for your home or garden
          </p>
        </div>

        {/* Category filters */}
        {categories.length > 1 && (
          <div className="flex justify-center space-x-2 md:space-x-4 mb-10 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className={`
                  ${activeCategory === category 
                    ? "bg-eco-600 hover:bg-eco-700 text-white" 
                    : "text-gray-700 dark:text-gray-300 hover:text-eco-600 border-gray-200 dark:border-gray-700"
                  }
                `}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {/* Products grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse dark:text-gray-300">Loading products...</div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
            <Leaf className="h-16 w-16 text-eco-600 mx-auto mb-4 opacity-70" />
            <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">No products available</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {products.length === 0 
                ? "There are no products to display at this time. Please check back later."
                : `No products found in the "${activeCategory}" category.`}
            </p>
            {activeCategory !== "All" && (
              <Button onClick={() => setActiveCategory("All")}>
                View All Categories
              </Button>
            )}
          </div>
        )}

        {/* View all button */}
        {products.length > 8 && (
          <div className="text-center mt-10">
            <Button asChild className="bg-eco-600 hover:bg-eco-700">
              <Link to="/shop">View All Products</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
