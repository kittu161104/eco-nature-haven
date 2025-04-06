
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image?: string;
  category: string;
}

interface BlogPreviewProps {
  posts?: BlogPost[];
}

const BlogPreview: React.FC<BlogPreviewProps> = ({ posts }) => {
  const navigate = useNavigate();

  // If there are no posts, return null
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="py-16 bg-eco-900/20">
      <div className="eco-container">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2 text-white text-center">Latest Green Tips</h2>
        <p className="text-eco-300 text-center max-w-2xl mx-auto mb-12">
          Explore our collection of eco-friendly gardening advice, plant care tips, and sustainability practices.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <Card key={post.id} className="bg-black border-green-900/50 overflow-hidden hover:shadow-lg hover:shadow-green-900/30 transition-all duration-300 h-full flex flex-col">
              {post.image && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
              )}
              <CardContent className="p-6 flex-grow">
                <div className="flex items-center text-xs text-eco-400 mb-2">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.category}</span>
                </div>
                <h3 className="font-bold text-xl mb-2 text-white">{post.title}</h3>
                <p className="text-gray-300 text-sm">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="px-6 py-4 border-t border-green-900/30 bg-eco-900/30">
                <Button 
                  variant="link" 
                  onClick={() => navigate(`/blog/${post.id}`)} 
                  className="text-eco-400 p-0 hover:text-eco-300"
                >
                  Read more <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
                <div className="text-xs text-gray-400 ml-auto">
                  By {post.author}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPreview;
