
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import BlogPostCard, { BlogPostProps } from "@/components/BlogPostCard";

// Sample blog posts (extending from the blog preview)
const blogPosts: BlogPostProps[] = [
  {
    id: "1",
    title: "10 Low-Maintenance Plants for Busy People",
    excerpt: "Discover plants that thrive on neglect and still look amazing in your home.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1545241047-6083a3684587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Emma Wilson",
    },
    date: "May 15, 2023",
    category: "Indoor Plants",
    tags: ["beginners", "low-maintenance", "indoor"],
    readTime: 5
  },
  {
    id: "2",
    title: "Sustainable Gardening: Composting Basics",
    excerpt: "Learn how to start composting at home and reduce waste while creating nutrient-rich soil for your garden.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1588056836139-8637361e6bbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "David Chen",
    },
    date: "June 3, 2023",
    category: "Sustainability",
    tags: ["composting", "eco-friendly", "gardening"],
    readTime: 7
  },
  {
    id: "3",
    title: "Creating a Pollinator-Friendly Garden",
    excerpt: "Discover which plants attract bees, butterflies, and other beneficial pollinators to your outdoor space.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Maria Gonzalez",
    },
    date: "July 12, 2023",
    category: "Outdoor Plants",
    tags: ["pollinators", "wildlife", "eco-friendly"],
    readTime: 6
  },
  {
    id: "4",
    title: "How to Diagnose and Treat Common Plant Diseases",
    excerpt: "Learn to identify and remedy the most frequent issues that affect houseplants and garden plants.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1598512697875-933bcb872f80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Robert Johnson",
    },
    date: "August 5, 2023",
    category: "Plant Care",
    tags: ["plant health", "troubleshooting", "pests"],
    readTime: 8
  },
  {
    id: "5",
    title: "The Ultimate Guide to Indoor Lighting for Plants",
    excerpt: "Understanding the light requirements for different houseplants and how to optimize your space.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Sophia Lee",
    },
    date: "September 20, 2023",
    category: "Indoor Plants",
    tags: ["lighting", "houseplants", "plant care"],
    readTime: 6
  },
  {
    id: "6",
    title: "Seasonal Planting Guide: What to Plant Each Month",
    excerpt: "A month-by-month calendar for planting vegetables, herbs, and flowers for optimal growth.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "James Miller",
    },
    date: "October 8, 2023",
    category: "Gardening",
    tags: ["seasonal", "planning", "vegetables"],
    readTime: 9
  },
];

const categories = ["All", "Indoor Plants", "Outdoor Plants", "Sustainability", "Plant Care", "Gardening"];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Filter blog posts
  const filteredPosts = blogPosts.filter((post) => {
    // Search term filter
    if (searchTerm && !post.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (activeCategory !== "All" && post.category !== activeCategory) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Blog Header - Changed background color to black */}
        <div className="bg-black py-12 border-b border-green-900">
          <div className="eco-container">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                The Green Thumb Blog
              </h1>
              <p className="text-gray-100 max-w-2xl mx-auto">
                Expert advice, gardening tips, and sustainable living ideas from our plant specialists
              </p>
            </div>
          </div>
        </div>
        
        {/* Blog Content */}
        <div className="eco-container py-8">
          {/* Search and Categories */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="search"
                placeholder="Search articles..."
                className="pl-10 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex justify-center flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  className={`
                    ${activeCategory === category 
                      ? "bg-eco-600 hover:bg-eco-700 text-white" 
                      : "text-white hover:text-eco-600 border-gray-200"
                    }
                  `}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Blog Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-black rounded-lg border border-green-900">
              <h3 className="text-lg font-medium text-white mb-2">No articles found</h3>
              <p className="text-white mb-4">
                Try adjusting your search or category selection
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setActiveCategory("All");
                  setSearchTerm("");
                }}
                className="text-white border-green-600 hover:bg-green-900/20"
              >
                View All Articles
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
