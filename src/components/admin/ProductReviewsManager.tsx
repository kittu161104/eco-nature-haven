
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash, Star, AlertCircle, Check, X } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";
import { Review } from "@/components/ProductReview";
import { toast } from "sonner";

interface ProductReviewsManagerProps {
  productId?: string; // Optional - if provided, only show reviews for this product
}

const ProductReviewsManager: React.FC<ProductReviewsManagerProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'reported' | 'approved'>('all');
  
  useEffect(() => {
    fetchReviews();
    
    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "productReviews") {
        fetchReviews();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [productId, filter]);
  
  const fetchReviews = () => {
    setIsLoading(true);
    
    try {
      // Get reviews from localStorage
      const storedReviews = localStorage.getItem("productReviews");
      let allReviews: Review[] = storedReviews ? JSON.parse(storedReviews) : [];
      
      // Filter by product if productId is provided
      if (productId) {
        allReviews = allReviews.filter(review => review.productId === productId);
      }
      
      // Apply additional filters
      if (filter === 'reported') {
        allReviews = allReviews.filter(review => review.reported);
      } else if (filter === 'approved') {
        allReviews = allReviews.filter(review => review.approved);
      }
      
      // Sort by newest first
      allReviews.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setReviews(allReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteReview = (reviewId: string) => {
    try {
      const storedReviews = localStorage.getItem("productReviews");
      const allReviews: Review[] = storedReviews ? JSON.parse(storedReviews) : [];
      
      const updatedReviews = allReviews.filter(review => review.id !== reviewId);
      localStorage.setItem("productReviews", JSON.stringify(updatedReviews));
      
      // Update component state
      setReviews(reviews.filter(review => review.id !== reviewId));
      
      toast.success("Review deleted successfully");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };
  
  const handleApproveReview = (reviewId: string) => {
    try {
      const storedReviews = localStorage.getItem("productReviews");
      const allReviews: Review[] = storedReviews ? JSON.parse(storedReviews) : [];
      
      const updatedReviews = allReviews.map(review => 
        review.id === reviewId ? { ...review, approved: true, reported: false } : review
      );
      
      localStorage.setItem("productReviews", JSON.stringify(updatedReviews));
      
      // Update component state
      setReviews(reviews.map(review => 
        review.id === reviewId ? { ...review, approved: true, reported: false } : review
      ));
      
      toast.success("Review approved");
    } catch (error) {
      console.error("Error approving review:", error);
      toast.error("Failed to approve review");
    }
  };
  
  const handleRejectReview = (reviewId: string) => {
    try {
      const storedReviews = localStorage.getItem("productReviews");
      const allReviews: Review[] = storedReviews ? JSON.parse(storedReviews) : [];
      
      const updatedReviews = allReviews.map(review => 
        review.id === reviewId ? { ...review, rejected: true, reported: false } : review
      );
      
      localStorage.setItem("productReviews", JSON.stringify(updatedReviews));
      
      // Update component state
      setReviews(reviews.map(review => 
        review.id === reviewId ? { ...review, rejected: true, reported: false } : review
      ));
      
      toast.success("Review rejected");
    } catch (error) {
      console.error("Error rejecting review:", error);
      toast.error("Failed to reject review");
    }
  };
  
  return (
    <Card className="bg-black border-green-900 shadow-lg shadow-green-900/10">
      <CardHeader className="bg-black border-b border-green-900 flex flex-row items-center justify-between">
        <CardTitle className="text-white">Product Reviews</CardTitle>
        
        <div className="flex space-x-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-green-700 text-white' : 'text-white'}
          >
            All Reviews
          </Button>
          <Button 
            variant={filter === 'reported' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setFilter('reported')}
            className={filter === 'reported' ? 'bg-green-700 text-white' : 'text-white'}
          >
            Reported
          </Button>
          <Button 
            variant={filter === 'approved' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setFilter('approved')}
            className={filter === 'approved' ? 'bg-green-700 text-white' : 'text-white'}
          >
            Approved
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-green-400">Loading reviews...</div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="divide-y divide-green-900/30">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 hover:bg-green-900/10 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium text-white">{review.userName}</h3>
                      {review.reported && (
                        <Badge className="ml-2 bg-amber-700 text-white">Reported</Badge>
                      )}
                      {review.approved && (
                        <Badge className="ml-2 bg-green-700 text-white">Approved</Badge>
                      )}
                      {review.rejected && (
                        <Badge className="ml-2 bg-red-700 text-white">Rejected</Badge>
                      )}
                    </div>
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
                      <span className="text-green-400 text-sm ml-2">{review.rating}/5</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-green-700 text-green-400 hover:bg-green-900/20"
                      onClick={() => handleApproveReview(review.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-700 text-red-400 hover:bg-red-900/20"
                      onClick={() => handleRejectReview(review.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-white hover:bg-green-900/20"
                        >
                          <span className="sr-only">Actions</span>
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                          >
                            <path
                              d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-black border-green-900 text-white">
                        <DropdownMenuItem 
                          className="text-red-400 hover:bg-red-900/20 hover:text-red-300"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <p className="text-white mt-2">{review.comment}</p>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-green-400">{formatDate(review.createdAt)}</span>
                  {!productId && (
                    <span className="text-green-400">
                      Product ID: {review.productId.substring(0, 8)}...
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-green-400 mb-4" />
            <h3 className="text-lg font-medium text-white mb-1">No reviews found</h3>
            <p className="text-gray-400">
              {filter !== 'all' 
                ? `No ${filter} reviews at the moment.` 
                : "No product reviews have been submitted yet."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductReviewsManager;
