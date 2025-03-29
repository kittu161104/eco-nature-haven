
import { Link } from "react-router-dom";
import { Calendar, User } from "lucide-react";

export interface BlogPostProps {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    avatar?: string;
  };
  date: string;
  category: string;
  tags: string[];
  readTime: number;
}

const BlogPostCard = ({ post }: { post: BlogPostProps }) => {
  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Featured image */}
      <Link to={`/blog/${post.id}`} className="block relative pt-[56.25%]">
        <img
          src={post.coverImage}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </Link>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <Link to={`/blog/category/${post.category.toLowerCase()}`}>
          <span className="inline-block px-2 py-1 bg-eco-100 text-eco-800 text-xs font-medium rounded mb-3">
            {post.category}
          </span>
        </Link>

        {/* Title */}
        <Link to={`/blog/${post.id}`}>
          <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 hover:text-eco-700 transition-colors">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

        {/* Meta */}
        <div className="flex items-center justify-between text-gray-500 text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{post.date}</span>
            </div>
          </div>
          <span>{post.readTime} min read</span>
        </div>
      </div>
    </article>
  );
};

export default BlogPostCard;
