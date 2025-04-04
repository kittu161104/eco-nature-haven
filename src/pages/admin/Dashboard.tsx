
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Users, FileText, DollarSign, AlertCircle } from "lucide-react";
import { toast } from "sonner";

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

  // Fetch real data from localStorage
  useEffect(() => {
    try {
      setIsLoading(true);
      
      // Get orders
      const ordersData = localStorage.getItem("orders");
      const orders: Order[] = ordersData ? JSON.parse(ordersData) : [];
      
      // Get customers
      const customersData = localStorage.getItem("customers");
      const customers: Customer[] = customersData ? JSON.parse(customersData) : [];
      
      // Get products
      const productsData = localStorage.getItem("products");
      const products: Product[] = productsData ? JSON.parse(productsData) : [];
      
      // Get blog posts
      const postsData = localStorage.getItem("posts");
      const posts: BlogPost[] = postsData ? JSON.parse(postsData) : [];
      
      // Calculate total sales
      const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
      
      // Count active orders (orders with status "processing")
      const activeOrdersCount = orders.filter(order => order.status === "processing").length;
      
      // Update stats
      setStats({
        totalSales: totalSales,
        activeOrders: activeOrdersCount,
        customers: customers.length,
        blogPosts: posts.length,
      });
      
      // Generate recent activities from orders and posts
      const recentActivities: Activity[] = [];
      
      // Add recent orders
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)
        .forEach(order => {
          const customer = customers.find(c => c.id === order.userId);
          recentActivities.push({
            id: `order-${order.id}`,
            type: "order",
            description: `New order #${order.id.slice(0, 6)} from ${customer?.name || 'Unknown customer'}`,
            timestamp: order.createdAt,
            icon: <ShoppingBag className="h-5 w-5 text-green-500" />
          });
        });
      
      // Add recent customers
      customers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 2)
        .forEach(customer => {
          recentActivities.push({
            id: `customer-${customer.id}`,
            type: "customer",
            description: `New customer registered: ${customer.name}`,
            timestamp: customer.createdAt,
            icon: <Users className="h-5 w-5 text-green-500" />
          });
        });
      
      // Add recent posts
      posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 2)
        .forEach(post => {
          recentActivities.push({
            id: `post-${post.id}`,
            type: "post",
            description: `New blog post: "${post.title}" by ${post.author}`,
            timestamp: post.createdAt,
            icon: <FileText className="h-5 w-5 text-green-500" />
          });
        });
      
      // Sort all activities by timestamp (newest first)
      recentActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      // Take only the 5 most recent
      setActivities(recentActivities.slice(0, 5));
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
      // Show placeholder activities if there's an error
      setActivities([{
        id: "error",
        type: "error",
        description: "There was an error loading recent activities",
        timestamp: new Date().toISOString(),
        icon: <AlertCircle className="h-5 w-5 text-red-500" />
      }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-green-400">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-stagger">
        <Card className="bg-black/60 border-green-800 backdrop-blur-lg shadow-lg shadow-green-900/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Sales</CardTitle>
            <DollarSign className="h-8 w-8 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{isLoading ? '...' : formatCurrency(stats.totalSales)}</div>
            <div className="text-xs text-green-400 mt-1">
              Real-time revenue tracking
            </div>
          </CardContent>
        </Card>

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
      </div>

      {/* Recent activity */}
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
                <div key={activity.id} className="flex items-center gap-4 transition-all duration-300 hover:bg-green-900/10 p-2 rounded-md" 
                     style={{animationDelay: `${index * 100}ms`}}>
                  <div className="h-10 w-10 rounded-full bg-black/40 flex items-center justify-center border border-green-800/50">
                    {activity.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{activity.description}</p>
                    <p className="text-xs text-green-400">{formatDate(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-green-400">No recent activity found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
