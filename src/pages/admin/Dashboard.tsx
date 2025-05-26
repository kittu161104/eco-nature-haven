
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Users, FileText, AlertCircle, RefreshCw, Star, Truck, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalSales: number;
  activeOrders: number;
  customers: number;
  blogPosts: number;
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
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    activeOrders: 0,
    customers: 0,
    blogPosts: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*');

      // Fetch customers
      const { data: customersData } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_admin', false);

      // Calculate total sales - fix the type error by ensuring we get a number
      const totalSales = ordersData?.reduce((sum, order) => {
        const orderTotal = typeof order.total === 'string' ? parseFloat(order.total) : order.total;
        return sum + (orderTotal || 0);
      }, 0) || 0;
      
      // Count active orders
      const activeOrdersCount = ordersData?.filter(order => order.status === 'processing').length || 0;

      setStats({
        totalSales,
        activeOrders: activeOrdersCount,
        customers: customersData?.length || 0,
        blogPosts: 0, // Will be implemented when blog system is ready
      });

      // Generate activities from real data
      const recentActivities: Activity[] = [];
      
      // Add recent orders to activity feed
      if (ordersData && ordersData.length > 0) {
        ordersData
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
          .forEach(order => {
            let icon, description, color;
            
            switch(order.status) {
              case "delivered":
                icon = <CheckCircle className="h-5 w-5 text-green-500" />;
                description = `Order #${order.order_number} delivered`;
                color = "green-500";
                break;
              case "processing":
                icon = <Truck className="h-5 w-5 text-blue-500" />;
                description = `Order #${order.order_number} is processing`;
                color = "blue-500";
                break;
              case "cancelled":
                icon = <XCircle className="h-5 w-5 text-red-500" />;
                description = `Order #${order.order_number} cancelled`;
                color = "red-500";
                break;
              default:
                icon = <ShoppingBag className="h-5 w-5 text-green-500" />;
                description = `New order #${order.order_number}`;
                color = "green-500";
            }
            
            recentActivities.push({
              id: `order-${order.id}`,
              type: "order",
              description,
              timestamp: order.created_at,
              icon,
              color
            });
          });
      }

      // Add recent customers
      if (customersData && customersData.length > 0) {
        customersData
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 3)
          .forEach(customer => {
            recentActivities.push({
              id: `customer-${customer.id}`,
              type: "customer",
              description: `New customer registered: ${customer.name || customer.email}`,
              timestamp: customer.created_at,
              icon: <Users className="h-5 w-5 text-green-500" />,
              color: "green-500"
            });
          });
      }
      
      // Sort all activities by timestamp (newest first)
      recentActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setActivities(recentActivities.slice(0, 8));
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
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

  useEffect(() => {
    fetchDashboardData();
    
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass border-green-800/30 backdrop-blur-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Sales</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-900/30 flex items-center justify-center">
              <span className="text-green-500 font-bold">₹</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {isLoading ? '...' : stats.totalSales === 0 ? '₹0' : formatCurrency(stats.totalSales)}
            </div>
            <div className="text-xs text-green-400 mt-1">
              {stats.totalSales === 0 ? 'No sales yet' : 'Real-time revenue tracking'}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-green-800/30 backdrop-blur-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Active Orders</CardTitle>
            <ShoppingBag className="h-8 w-8 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {isLoading ? '...' : stats.activeOrders}
            </div>
            <div className="text-xs text-green-400 mt-1">
              {stats.activeOrders === 0 ? 'No active orders' : 'Orders currently processing'}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-green-800/30 backdrop-blur-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Customers</CardTitle>
            <Users className="h-8 w-8 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {isLoading ? '...' : stats.customers}
            </div>
            <div className="text-xs text-green-400 mt-1">
              {stats.customers === 0 ? 'No customers yet' : 'Total registered users'}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-green-800/30 backdrop-blur-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Blog Posts</CardTitle>
            <FileText className="h-8 w-8 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {isLoading ? '...' : stats.blogPosts}
            </div>
            <div className="text-xs text-green-400 mt-1">
              Published content
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-green-800/30 backdrop-blur-lg">
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
  );
};

export default Dashboard;
