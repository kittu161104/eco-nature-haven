
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Users, FileText, AlertCircle, RefreshCw, Star, Truck, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

interface Order {
  id: string;
  userId: string;
  items: any[];
  total: number;
  status: string;
  createdAt: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

interface BlogPost {
  id: string;
  title: string;
  author: string;
  createdAt: string;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  color?: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    activeOrders: 0,
    customers: 0,
    blogPosts: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Function to fetch real data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Get orders from localStorage
      const ordersData = localStorage.getItem("orders");
      const orders: Order[] = ordersData ? JSON.parse(ordersData) : [];
      
      // Get customers from localStorage
      const customersData = localStorage.getItem("customers");
      const customers: Customer[] = customersData ? JSON.parse(customersData) : [];
      
      // Get products from localStorage
      const productsData = localStorage.getItem("products");
      const products: Product[] = productsData ? JSON.parse(productsData) : [];
      
      // Get blog posts from localStorage
      const postsData = localStorage.getItem("blogPosts");
      const posts: BlogPost[] = postsData ? JSON.parse(postsData) : [];
      
      // Get reviews from localStorage
      const reviewsData = localStorage.getItem("productReviews");
      const reviews = reviewsData ? JSON.parse(reviewsData) : [];
      
      // Calculate total sales from actual orders
      const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
      
      // Count active orders (orders with status "processing")
      const activeOrdersCount = orders.filter(order => order.status === "processing").length;
      
      // Update stats with real data
      setStats({
        totalSales: totalSales,
        activeOrders: activeOrdersCount,
        customers: customers.length,
        blogPosts: posts.length,
      });
      
      // Generate activities from real data
      const recentActivities: Activity[] = [];
      
      // Add recent orders to activity feed
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .forEach(order => {
          const customer = customers.find(c => c.id === order.userId);
          
          let icon, description, color;
          
          switch(order.status) {
            case "completed":
              icon = <CheckCircle className="h-5 w-5 text-green-500" />;
              description = `Order #${order.id.slice(0, 6)} completed for ${customer?.name || 'Unknown customer'}`;
              color = "green-500";
              break;
            case "processing":
              icon = <Truck className="h-5 w-5 text-blue-500" />;
              description = `Order #${order.id.slice(0, 6)} processing for ${customer?.name || 'Unknown customer'}`;
              color = "blue-500";
              break;
            case "cancelled":
              icon = <XCircle className="h-5 w-5 text-red-500" />;
              description = `Order #${order.id.slice(0, 6)} cancelled for ${customer?.name || 'Unknown customer'}`;
              color = "red-500";
              break;
            default:
              icon = <ShoppingBag className="h-5 w-5 text-green-500" />;
              description = `New order #${order.id.slice(0, 6)} from ${customer?.name || 'Unknown customer'}`;
              color = "green-500";
          }
          
          recentActivities.push({
            id: `order-${order.id}`,
            type: "order",
            description: description,
            timestamp: order.createdAt,
            icon: icon,
            color: color
          });
        });
      
      // Add recent customers
      customers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)
        .forEach(customer => {
          recentActivities.push({
            id: `customer-${customer.id}`,
            type: "customer",
            description: `New customer registered: ${customer.name}`,
            timestamp: customer.createdAt,
            icon: <Users className="h-5 w-5 text-green-500" />,
            color: "green-500"
          });
        });
      
      // Add recent posts
      posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)
        .forEach(post => {
          recentActivities.push({
            id: `post-${post.id}`,
            type: "post",
            description: `New blog post: "${post.title}" by ${post.author}`,
            timestamp: post.createdAt,
            icon: <FileText className="h-5 w-5 text-green-500" />,
            color: "green-500"
          });
        });
        
      // Add recent reviews
      if (reviews && reviews.length > 0) {
        reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3)
          .forEach(review => {
            const product = products.find(p => p.id === review.productId);
            recentActivities.push({
              id: `review-${review.id}`,
              type: "review",
              description: `New ${review.rating}-star review for ${product?.name || 'a product'} by ${review.userName}`,
              timestamp: review.createdAt,
              icon: <Star className="h-5 w-5 text-yellow-500" />,
              color: "yellow-500"
            });
          });
      }
      
      // Sort all activities by timestamp (newest first)
      recentActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      // Only show the most recent activities
      setActivities(recentActivities.slice(0, 8));
      
      // Update last refreshed timestamp
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
      // Show error in activity feed if there's an error
      setActivities([{
        id: "error",
        type: "error",
        description: "There was an error loading recent activities",
        timestamp: new Date().toISOString(),
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        color: "red-500"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
    
    // Set up interval for real-time updates
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);
    
    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "orders" || e.key === "customers" || e.key === "products" || e.key === "blogPosts" || e.key === "productReviews") {
        fetchDashboardData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-green-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="border-green-700 text-green-400 hover:bg-green-900/20"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Updating...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-black/60 border-green-800 backdrop-blur-lg shadow-lg shadow-green-900/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Sales</CardTitle>
              <div className="h-8 w-8 rounded-full bg-green-900/30 flex items-center justify-center">
                <img src="/rupee-icon.svg" alt="INR" className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{isLoading ? '...' : formatCurrency(stats.totalSales)}</div>
              <div className="text-xs text-green-400 mt-1">
                Real-time revenue tracking
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-black/60 border-green-800 backdrop-blur-lg shadow-lg shadow-green-900/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Active Orders</CardTitle>
              <ShoppingBag className="h-8 w-8 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{isLoading ? '...' : stats.activeOrders}</div>
              <div className="text-xs text-green-400 mt-1">
                Orders currently processing
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-black/60 border-green-800 backdrop-blur-lg shadow-lg shadow-green-900/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Customers</CardTitle>
              <Users className="h-8 w-8 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{isLoading ? '...' : stats.customers}</div>
              <div className="text-xs text-green-400 mt-1">
                Total registered users
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-black/60 border-green-800 backdrop-blur-lg shadow-lg shadow-green-900/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Blog Posts</CardTitle>
              <FileText className="h-8 w-8 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{isLoading ? '...' : stats.blogPosts}</div>
              <div className="text-xs text-green-400 mt-1">
                Published content
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Recent activity */}
      <motion.div variants={itemVariants}>
        <Card className="bg-black/60 border-green-800 backdrop-blur-lg shadow-lg shadow-green-900/10">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="h-10 w-10 rounded-full bg-green-900/20"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-48 bg-green-900/20 rounded"></div>
                      <div className="h-3 w-24 bg-green-900/10 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 transition-all duration-300 hover:bg-green-900/10 p-2 rounded-md"
                  >
                    <div className="h-10 w-10 rounded-full bg-black/40 flex items-center justify-center border border-green-800/50">
                      {activity.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{activity.description}</p>
                      <p className="text-xs text-green-400">{formatDate(activity.timestamp)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-green-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-1">No recent activity</h3>
                <p className="text-gray-400">
                  No recent orders, customers, or other activities to display
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
