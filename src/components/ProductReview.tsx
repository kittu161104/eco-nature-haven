
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, StarHalf } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ProductReviewProps {
  productId: string;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
}

const ProductReview: React.FC<ProductReviewProps> = ({ productId, reviews, onAddReview }) => {
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("Please login to submit a review");
      return;
    }
    
    if (comment.trim().length < 5) {
      toast.error("Please write a meaningful review (minimum 5 characters)");
      return;
    }
    
    onAddReview({
      userId: user?.id || "",
      userName: user?.name || "Anonymous",
      productId,
      rating,
      comment
    });
    
    // Reset form
    setRating(5);
    setComment("");
    toast.success("Review submitted successfully!");
  };
  
  // Check if user already submitted a review
  const userReview = reviews.find(review => review.userId === user?.id);
  
  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-white mb-4">Customer Reviews</h3>
      
      {reviews.length > 0 ? (
        <div className="space-y-4 mb-8">
          {reviews.map((review) => (
            <div 
              key={review.id}
              className="p-4 rounded-lg border border-green-900 bg-black/40 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium text-white">{review.userName}</h4>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating ? "text-yellow-400" : "text-gray-400"
                        }`}
                        fill={star <= review.rating ? "currentColor" : "none"}
                      />
                    ))}
                    <span className="text-sm text-green-400 ml-2">{review.rating} out of 5</span>
                  </div>
                </div>
                <div className="text-sm text-green-400">
                  {formatDate(review.createdAt)}
                </div>
              </div>
              <p className="text-white mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 mb-8 border border-green-900/30 rounded-lg">
          <p className="text-gray-400">No reviews yet. Be the first to review this product!</p>
        </div>
      )}
      
      {!userReview && isAuthenticated ? (
        <div className="bg-black/40 border border-green-900 rounded-lg p-4 backdrop-blur-sm">
          <h4 className="text-lg font-medium text-white mb-3">Write a Review</h4>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-white mb-2">Rating</label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none mr-1"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(null)}
                  >
                    <Star 
                      className={`h-6 w-6 transition-colors ${
                        star <= (hoveredStar || rating) ? "text-yellow-400" : "text-gray-400"
                      }`}
                      fill={star <= (hoveredStar || rating) ? "currentColor" : "none"}
                    />
                  </button>
                ))}
                <span className="ml-2 text-green-400">{hoveredStar || rating} out of 5</span>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="comment" className="block text-white mb-2">Your Review</label>
              <Textarea 
                id="comment"
                placeholder="Share your experience with this product..."
                className="bg-black/60 border-green-900/50 text-white"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Submit Review
            </Button>
          </form>
        </div>
      ) : isAuthenticated && userReview ? (
        <div className="bg-black/40 border border-green-900 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-green-400">You have already submitted a review for this product.</p>
        </div>
      ) : (
        <div className="bg-black/40 border border-green-900 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-white mb-2">Please login to write a review.</p>
          <Button 
            variant="outline" 
            className="border-green-600 text-green-400 hover:bg-green-900/20"
            onClick={() => window.location.href = "/login"}
          >
            Login to Review
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductReview;
