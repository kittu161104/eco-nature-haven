
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, User, Tag, ArrowLeft } from "lucide-react";
import { BlogPostProps } from "@/components/BlogPostCard";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load blog posts from localStorage
    const loadPost = () => {
      setLoading(true);
      try {
        const savedPosts = localStorage.getItem("posts");
        if (savedPosts) {
          const posts = JSON.parse(savedPosts);
          const foundPost = posts.find((p: any) => p.id.toString() === id);
          
          if (foundPost) {
            setPost({
              id: foundPost.id.toString(),
              title: foundPost.title,
              excerpt: foundPost.excerpt,
              content: foundPost.content || "",
              coverImage: foundPost.coverImage || "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              author: {
                name: foundPost.author,
                avatar: foundPost.authorAvatar,
              },
              date: foundPost.date,
              category: foundPost.category,
              tags: foundPost.tags || ["blog"],
              readTime: foundPost.readTime || 5,
            });
          }
        }
      } catch (error) {
        console.error("Error loading blog post:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
    
    // Listen for updates to blog posts
    const handleBlogUpdates = () => {
      loadPost();
    };
    
    window.addEventListener('posts-updated', handleBlogUpdates);
    
    return () => {
      window.removeEventListener('posts-updated', handleBlogUpdates);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Loading blog post...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <div className="eco-container py-16">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
              <p className="text-gray-600 mb-8">
                We couldn't find the blog post you're looking for. It may have been removed or doesn't exist.
              </p>
              <Button asChild>
                <Link to="/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to All Blogs
                </Link>
              </Button>
            </div>
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
        {/* Featured Image */}
        <div className="h-72 md:h-96 w-full relative">
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>

        <div className="eco-container py-8">
          <div className="max-w-3xl mx-auto">
            {/* Back Link */}
            <div className="mb-6">
              <Button variant="ghost" asChild>
                <Link to="/blog" className="text-eco-600 hover:text-eco-700">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to All Blogs
                </Link>
              </Button>
            </div>

            {/* Category */}
            <div className="mb-4">
              <Link to={`/blog/category/${post.category.toLowerCase()}`}>
                <span className="inline-block px-3 py-1 bg-eco-100 text-eco-800 text-sm font-medium rounded">
                  {post.category}
                </span>
              </Link>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{post.date}</span>
              </div>
              <div>
                <span>{post.readTime} min read</span>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg prose-green mx-auto mb-8">
              <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }} />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="border-t border-b border-gray-200 py-6 mb-8">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  {post.tags.map((tag, index) => (
                    <Link key={index} to={`/blog/tag/${tag.toLowerCase()}`}>
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded hover:bg-gray-200 transition-colors">
                        {tag}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetail;
