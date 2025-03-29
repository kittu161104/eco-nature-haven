
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import BlogPostCard, { BlogPostProps } from "./BlogPostCard";

// Sample blog posts
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
  }
];

const BlogPreview = () => {
  return (
    <section className="py-16">
      <div className="eco-container">
        <div className="text-center mb-12">
          <h2 className="section-title">From Our Blog</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Expert gardening tips, plant care guides, and sustainability advice
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild className="bg-eco-600 hover:bg-eco-700">
            <Link to="/blog">View All Articles</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
