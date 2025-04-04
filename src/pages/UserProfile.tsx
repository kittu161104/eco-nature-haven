
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/hooks/useWishlist";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { User, Heart, ShoppingBag, Settings, Shield, Clock, Calendar } from "lucide-react";

interface Order {
  id: string;
  userId: string;
  items: any[];
  total: number;
  status: string;
  createdAt: string;
}

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { getWishlistProducts, removeFromWishlist } = useWishlist();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      setLoading(true);
      // Check if the profile belongs to the current user
      if (user && user.id === id) {
        setIsCurrentUser(true);
        setName(user.name);
        setEmail(user.email);
        
        // Load wishlist items
        setWishlistItems(getWishlistProducts());
        
        // Load user orders
        const storedOrders = localStorage.getItem("orders");
        if (storedOrders) {
          const parsedOrders = JSON.parse(storedOrders);
          // Filter orders for this user
          const userOrders = parsedOrders.filter((order: Order) => order.userId === user.id);
          setOrders(userOrders);
        }
      } else {
        // Get user data for the provided ID
        // This would be a real API call in a production app
        // For now, simulate looking up a user from localStorage
        const storedCustomers = localStorage.getItem("customers");
        if (storedCustomers) {
          const customers = JSON.parse(storedCustomers);
          const foundUser = customers.find((c: any) => c.id === id);
          
          if (foundUser) {
            setName(foundUser.name);
            setEmail(foundUser.email);
            
            // If admin, show orders for this user
            if (user.isAdmin) {
              const storedOrders = localStorage.getItem("orders");
              if (storedOrders) {
                const parsedOrders = JSON.parse(storedOrders);
                const userOrders = parsedOrders.filter((order: Order) => order.userId === id);
                setOrders(userOrders);
              }
            }
          } else {
            toast({
              title: "User not found",
              description: "The requested user profile could not be found."
            });
            navigate("/account");
          }
        }
      }
      setLoading(false);
    }
  }, [id, isAuthenticated, user, navigate, getWishlistProducts]);

  // Listen for wishlist updates
  useEffect(() => {
    const handleWishlistUpdate = () => {
      setWishlistItems(getWishlistProducts());
    };
    
    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    
    return () => {
      window.removeEventListener('wishlist-updated', handleWishlistUpdate);
    };
  }, [getWishlistProducts]);

  const handleRemoveFromWishlist = (id: string) => {
    removeFromWishlist(id);
    toast({
      title: "Removed from wishlist",
      description: "The item has been removed from your wishlist"
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully"
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
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
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      <motion.main 
        className="flex-grow py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="eco-container">
          <motion.h1 
            className="text-3xl font-bold mb-8 text-white"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {isCurrentUser ? "My Profile" : `${name}'s Profile`}
          </motion.h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar/Menu */}
            <motion.div 
              className="md:col-span-1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className="bg-black/60 backdrop-blur-md rounded-lg shadow-lg border border-green-900/50 p-4"
                variants={itemVariants}
              >
                <div className="flex flex-col items-center mb-6 p-4">
                  <div className="w-20 h-20 rounded-full bg-green-900/30 flex items-center justify-center mb-3 border border-green-800/50">
                    <User className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="font-medium text-lg text-white">{name}</h3>
                  <p className="text-sm text-green-400">{email}</p>
                  
                  <div className="flex items-center mt-3 text-xs text-green-400">
                    {isCurrentUser ? (
                      <>
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Member since {formatDate(new Date())}</span>
                      </>
                    ) : user?.isAdmin ? (
                      <>
                        <Shield className="h-3 w-3 mr-1" />
                        <span>Viewing as admin</span>
                      </>
                    ) : null}
                  </div>
                </div>
                
                {isCurrentUser && (
                  <motion.div className="space-y-1" variants={containerVariants}>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start bg-transparent hover:bg-green-900/20 text-white" 
                      onClick={() => document.getElementById('profile-tab')?.click()}
                    >
                      <User className="mr-2 h-4 w-4 text-green-500" />
                      Profile
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start bg-transparent hover:bg-green-900/20 text-white"
                      onClick={() => document.getElementById('orders-tab')?.click()}
                    >
                      <ShoppingBag className="mr-2 h-4 w-4 text-green-500" />
                      Orders
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start bg-transparent hover:bg-green-900/20 text-white"
                      onClick={() => document.getElementById('wishlist-tab')?.click()}
                    >
                      <Heart className="mr-2 h-4 w-4 text-green-500" />
                      Wishlist
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-900/20"
                      onClick={handleLogout}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </motion.div>
                )}
                
                {user?.isAdmin && !isCurrentUser && (
                  <motion.div className="pt-3 mt-3 border-t border-green-900/50" variants={containerVariants}>
                    <Button 
                      variant="outline" 
                      className="w-full bg-black/40 border-green-900/50 hover:bg-green-900/20 text-green-500"
                      onClick={() => navigate('/admin/customers')}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Manage Users
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
            
            {/* Main Content */}
            <motion.div 
              className="md:col-span-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {loading ? (
                // Loading skeleton
                <div className="bg-black/60 backdrop-blur-md rounded-lg shadow-lg border border-green-900/50 p-6">
                  <Skeleton className="h-8 w-40 bg-green-900/20 mb-6" />
                  <div className="space-y-4">
                    <Skeleton className="h-12 bg-green-900/20" />
                    <Skeleton className="h-12 bg-green-900/20" />
                    <Skeleton className="h-12 w-40 bg-green-900/20" />
                  </div>
                </div>
              ) : isCurrentUser ? (
                <Tabs defaultValue="profile" className="bg-black/60 backdrop-blur-md rounded-lg shadow-lg border border-green-900/50 overflow-hidden">
                  <TabsList className="w-full justify-start rounded-none border-b border-green-900/50 p-0 bg-black/80">
                    <TabsTrigger 
                      id="profile-tab"
                      value="profile" 
                      className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-400 data-[state=active]:shadow-none py-3 px-6 text-white"
                    >
                      Profile
                    </TabsTrigger>
                    <TabsTrigger 
                      id="orders-tab"
                      value="orders" 
                      className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-400 data-[state=active]:shadow-none py-3 px-6 text-white"
                    >
                      Orders
                    </TabsTrigger>
                    <TabsTrigger 
                      id="wishlist-tab"
                      value="wishlist" 
                      className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-400 data-[state=active]:shadow-none py-3 px-6 text-white"
                    >
                      Wishlist
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="profile" className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-white">Profile Information</h2>
                    <form onSubmit={handleSaveProfile}>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name" className="text-white">Full Name</Label>
                          <Input 
                            id="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="mt-1 bg-black/50 border-green-900/50 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-white">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="mt-1 bg-black/50 border-green-900/50 text-white"
                            disabled
                          />
                          <p className="text-xs text-green-400 mt-1">Email cannot be changed</p>
                        </div>
                        <Button 
                          type="submit" 
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="orders" className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-white">Your Orders</h2>
                    {orders.length > 0 ? (
                      <motion.div 
                        className="space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {orders.map((order) => (
                          <motion.div 
                            key={order.id} 
                            className="border border-green-900/50 rounded-lg p-4 bg-black/50 backdrop-blur-sm"
                            variants={itemVariants}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                          >
                            <div className="flex justify-between mb-3">
                              <div>
                                <span className="font-medium text-white">Order #{order.id.slice(-6)}</span>
                                <div className="text-sm text-green-400">
                                  {formatDate(new Date(order.createdAt))}
                                </div>
                              </div>
                              <div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium
                                  ${order.status === 'completed' ? 'bg-green-900/50 text-green-400' : 
                                    order.status === 'processing' ? 'bg-blue-900/50 text-blue-400' : 
                                    'bg-yellow-900/50 text-yellow-400'}`}
                                >
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex items-center py-2 border-b border-green-900/30 last:border-b-0">
                                  <div className="flex-grow">
                                    <div className="font-medium text-white">{item.name}</div>
                                    <div className="text-sm text-green-400">
                                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                                    </div>
                                  </div>
                                  <div className="font-medium text-white">
                                    ${(item.quantity * item.price).toFixed(2)}
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex justify-between pt-2 font-medium">
                              <span className="text-green-400">Total:</span>
                              <span className="text-white">${order.total.toFixed(2)}</span>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div 
                        className="text-center py-8 bg-black/30 rounded-lg border border-green-900/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <ShoppingBag className="mx-auto h-12 w-12 text-green-500/50 mb-4" />
                        <h3 className="text-lg font-medium text-white mb-1">No orders yet</h3>
                        <p className="text-green-400 mb-4">
                          You haven't placed any orders yet.
                        </p>
                        <Button 
                          onClick={() => navigate('/shop')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Start Shopping
                        </Button>
                      </motion.div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="wishlist" className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-white">Your Wishlist</h2>
                    {wishlistItems.length > 0 ? (
                      <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {wishlistItems.map((item) => (
                          <motion.div 
                            key={item.id} 
                            className="border border-green-900/50 rounded-lg p-4 flex gap-4 bg-black/50 backdrop-blur-sm"
                            variants={itemVariants}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                          >
                            <div className="h-20 w-20 rounded bg-green-900/20 flex-shrink-0 overflow-hidden border border-green-900/30">
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/placeholder.svg";
                                  }}
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full w-full">
                                  <Heart className="h-8 w-8 text-green-600/50" />
                                </div>
                              )}
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-medium text-white">{item.name}</h3>
                              <div className="mt-1">
                                {item.discountPrice ? (
                                  <div className="flex items-center">
                                    <span className="font-medium text-white mr-2">${item.discountPrice.toFixed(2)}</span>
                                    <span className="text-sm text-green-400 line-through">${item.price.toFixed(2)}</span>
                                  </div>
                                ) : (
                                  <span className="font-medium text-white">${item.price.toFixed(2)}</span>
                                )}
                              </div>
                              <div className="flex gap-2 mt-2">
                                <Button 
                                  size="sm" 
                                  variant="default" 
                                  className="text-xs h-8 bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => navigate(`/product/${item.id}`)}
                                >
                                  View
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-xs text-red-400 h-8 hover:bg-red-900/20 border-red-900/50 bg-black/30"
                                  onClick={() => handleRemoveFromWishlist(item.id)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div 
                        className="text-center py-8 bg-black/30 rounded-lg border border-green-900/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Heart className="mx-auto h-12 w-12 text-green-500/50 mb-4" />
                        <h3 className="text-lg font-medium text-white mb-1">Your wishlist is empty</h3>
                        <p className="text-green-400 mb-4">
                          Save items you like to your wishlist and they'll appear here.
                        </p>
                        <Button 
                          onClick={() => navigate('/shop')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Browse Products
                        </Button>
                      </motion.div>
                    )}
                  </TabsContent>
                </Tabs>
              ) : (
                // View only profile for other users
                <div className="bg-black/60 backdrop-blur-md rounded-lg shadow-lg border border-green-900/50 p-6">
                  <h2 className="text-xl font-semibold mb-4 text-white">User Profile</h2>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-green-400">Name</Label>
                      <p className="text-white font-medium mt-1">{name}</p>
                    </div>
                    
                    {user?.isAdmin && (
                      <div>
                        <Label className="text-green-400">Email</Label>
                        <p className="text-white font-medium mt-1">{email}</p>
                      </div>
                    )}
                    
                    {user?.isAdmin && (
                      <>
                        <div className="pt-4 mt-4 border-t border-green-900/50">
                          <h3 className="text-lg font-medium text-white mb-3">Orders</h3>
                          {orders.length > 0 ? (
                            <div className="space-y-3">
                              {orders.map((order) => (
                                <div key={order.id} className="border border-green-900/50 rounded-md p-3 bg-black/40">
                                  <div className="flex justify-between">
                                    <span className="text-white">Order #{order.id.slice(-6)}</span>
                                    <span className="text-green-400">${order.total.toFixed(2)}</span>
                                  </div>
                                  <div className="text-sm text-green-400 mt-1">
                                    {new Date(order.createdAt).toLocaleDateString()} • 
                                    <span className={
                                      order.status === 'completed' ? ' text-green-400' : 
                                      order.status === 'processing' ? ' text-blue-400' : 
                                      ' text-yellow-400'
                                    }> {order.status}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-green-400">No orders found for this user.</p>
                          )}
                        </div>
                        
                        <Button 
                          onClick={() => navigate('/admin/customers')}
                          className="bg-green-600 hover:bg-green-700 text-white mt-2"
                        >
                          Back to Customers
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default UserProfile;
