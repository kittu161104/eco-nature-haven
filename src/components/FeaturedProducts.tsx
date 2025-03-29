
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProductCard, { ProductProps } from "./ProductCard";
import { Link } from "react-router-dom";

// Sample data
const categories = ["All", "Indoor", "Outdoor", "Succulents", "Herbs"];

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
];

const FeaturedProducts = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts = activeCategory === "All"
    ? sampleProducts
    : sampleProducts.filter(product => product.category === activeCategory);

  return (
    <section className="py-16">
      <div className="eco-container">
        <div className="text-center mb-12">
          <h2 className="section-title">Featured Plants</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our selection of carefully curated plants for your home or garden
          </p>
        </div>

        {/* Category filters */}
        <div className="flex justify-center space-x-2 md:space-x-4 mb-10 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className={`
                ${activeCategory === category 
                  ? "bg-eco-600 hover:bg-eco-700" 
                  : "text-gray-700 hover:text-eco-600 border-gray-200"
                }
              `}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-10">
          <Button asChild className="bg-eco-600 hover:bg-eco-700">
            <Link to="/shop">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
