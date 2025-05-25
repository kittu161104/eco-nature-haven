
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/hooks/useWishlist";
import { formatDate } from "@/lib/utils";
import { Leaf, Heart, ShoppingBag, User, Settings, LogOut, Trash, Package, RotateCcw, RefreshCw } from "lucide-react";

interface Order {
  id: string;
  userId: string;
  items: any[];
  total: number;
  status: string;
  createdAt: string;
  orderNumber?: string;
}

const Account = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { getWishlistProducts, removeFromWishlist } = useWishlist();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user) {
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
    }
  }, [isAuthenticated, user, navigate, getWishlistProducts]);

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
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="eco-container">
          <h1 className="text-3xl font-bold mb-8 text-eco-800">My Account</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar/Menu */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex flex-col items-center mb-6 p-4">
                  <div className="w-20 h-20 rounded-full bg-eco-100 flex items-center justify-center mb-3">
                    <User className="h-10 w-10 text-eco-600" />
                  </div>
                  <h3 className="font-medium text-lg">{user?.name}</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                
                <div className="space-y-1">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={() => document.getElementById('profile-tab')?.click()}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => document.getElementById('orders-tab')?.click()}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Orders
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => document.getElementById('tracking-tab')?.click()}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Order Tracking
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => document.getElementById('returns-tab')?.click()}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Returns
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => document.getElementById('refunds-tab')?.click()}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refunds
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => document.getElementById('wishlist-tab')?.click()}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => document.getElementById('settings-tab')?.click()}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-3">
              <Tabs defaultValue="profile" className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <TabsList className="w-full justify-start rounded-none border-b p-0 grid grid-cols-7">
                  <TabsTrigger 
                    id="profile-tab"
                    value="profile" 
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-eco-600 data-[state=active]:shadow-none py-3 px-3 text-xs"
                  >
                    Profile
                  </TabsTrigger>
                  <TabsTrigger 
                    id="orders-tab"
                    value="orders" 
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-eco-600 data-[state=active]:shadow-none py-3 px-3 text-xs"
                  >
                    Orders
                  </TabsTrigger>
                  <TabsTrigger 
                    id="tracking-tab"
                    value="tracking" 
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-eco-600 data-[state=active]:shadow-none py-3 px-3 text-xs"
                  >
                    Tracking
                  </TabsTrigger>
                  <TabsTrigger 
                    id="returns-tab"
                    value="returns" 
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-eco-600 data-[state=active]:shadow-none py-3 px-3 text-xs"
                  >
                    Returns
                  </TabsTrigger>
                  <TabsTrigger 
                    id="refunds-tab"
                    value="refunds" 
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-eco-600 data-[state=active]:shadow-none py-3 px-3 text-xs"
                  >
                    Refunds
                  </TabsTrigger>
                  <TabsTrigger 
                    id="wishlist-tab"
                    value="wishlist" 
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-eco-600 data-[state=active]:shadow-none py-3 px-3 text-xs"
                  >
                    Wishlist
                  </TabsTrigger>
                  <TabsTrigger 
                    id="settings-tab"
                    value="settings" 
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-eco-600 data-[state=active]:shadow-none py-3 px-3 text-xs"
                  >
                    Settings
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                  <form onSubmit={handleSaveProfile}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          className="mt-1"
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="orders" className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex justify-between mb-3">
                            <div>
                              <span className="font-medium">Order #{order.orderNumber || order.id.slice(-6)}</span>
                              <div className="text-sm text-gray-500">
                                {formatDate(new Date(order.createdAt))}
                              </div>
                            </div>
                            <div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center py-2 border-b last:border-b-0">
                                <div className="flex-grow">
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-sm text-gray-500">
                                    Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                                  </div>
                                </div>
                                <div className="font-medium">
                                  ₹{(item.quantity * item.price).toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-between pt-2 font-medium">
                            <span>Total:</span>
                            <span>₹{order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No orders yet</h3>
                      <p className="text-gray-600 mb-4">
                        You haven't placed any orders yet.
                      </p>
                      <Button onClick={() => navigate('/shop')}>
                        Start Shopping
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="tracking" className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Tracking</h2>
                  {orders.filter(order => order.status !== 'completed' && order.status !== 'cancelled').length > 0 ? (
                    <div className="space-y-4">
                      {orders.filter(order => order.status !== 'completed' && order.status !== 'cancelled').map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex justify-between mb-3">
                            <div>
                              <span className="font-medium">Order #{order.orderNumber || order.id.slice(-6)}</span>
                              <div className="text-sm text-gray-500">
                                Placed on {formatDate(new Date(order.createdAt))}
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
                            </span>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Package className="h-5 w-5 text-blue-600" />
                                <span className="font-medium">Current Status</span>
                              </div>
                              <span className="text-sm text-gray-600">Track your order progress</span>
                            </div>
                            
                            <div className="mt-4 space-y-2">
                              <div className={`flex items-center space-x-3 ${order.status === 'pending_payment' ? 'text-yellow-600' : 'text-green-600'}`}>
                                <div className="w-3 h-3 rounded-full bg-current"></div>
                                <span className="text-sm">Order Placed</span>
                              </div>
                              <div className={`flex items-center space-x-3 ${order.status === 'processing' ? 'text-blue-600' : order.status === 'pending_payment' ? 'text-gray-400' : 'text-green-600'}`}>
                                <div className="w-3 h-3 rounded-full bg-current"></div>
                                <span className="text-sm">Payment Confirmed</span>
                              </div>
                              <div className="flex items-center space-x-3 text-gray-400">
                                <div className="w-3 h-3 rounded-full bg-current"></div>
                                <span className="text-sm">Order Shipped</span>
                              </div>
                              <div className="flex items-center space-x-3 text-gray-400">
                                <div className="w-3 h-3 rounded-full bg-current"></div>
                                <span className="text-sm">Out for Delivery</span>
                              </div>
                              <div className="flex items-center space-x-3 text-gray-400">
                                <div className="w-3 h-3 rounded-full bg-current"></div>
                                <span className="text-sm">Delivered</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No active orders</h3>
                      <p className="text-gray-600">All your orders have been delivered or cancelled.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="returns" className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Returns</h2>
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <RotateCcw className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No returns</h3>
                    <p className="text-gray-600">You haven't initiated any returns yet.</p>
                  </div>
                </TabsContent>

                <TabsContent value="refunds" className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Refunds</h2>
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <RefreshCw className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No refunds</h3>
                    <p className="text-gray-600">You don't have any refund requests.</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="wishlist" className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Your Wishlist</h2>
                  {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 flex gap-4">
                          <div className="h-20 w-20 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
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
                                <Leaf className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-medium">{item.name}</h3>
                            <div className="mt-1">
                              {item.discountPrice ? (
                                <div className="flex items-center">
                                  <span className="font-medium text-gray-900 mr-2">₹{item.discountPrice.toFixed(2)}</span>
                                  <span className="text-sm text-gray-500 line-through">₹{item.price.toFixed(2)}</span>
                                </div>
                              ) : (
                                <span className="font-medium text-gray-900">₹{item.price.toFixed(2)}</span>
                              )}
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Button 
                                size="sm" 
                                variant="default" 
                                className="text-xs h-8"
                                onClick={() => navigate(`/product/${item.id}`)}
                              >
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs text-red-600 h-8 hover:bg-red-50"
                                onClick={() => handleRemoveFromWishlist(item.id)}
                              >
                                <Trash className="h-3 w-3 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Heart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">Your wishlist is empty</h3>
                      <p className="text-gray-600 mb-4">
                        Save items you like to your wishlist and they'll appear here.
                      </p>
                      <Button onClick={() => navigate('/shop')}>
                        Browse Products
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="settings" className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                  <div className="space-y-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Notifications</h3>
                      <p className="text-sm text-gray-600 mb-4">Manage your notification preferences</p>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">Email notifications for orders</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">SMS notifications for deliveries</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">Marketing emails</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Privacy Settings</h3>
                      <p className="text-sm text-gray-600 mb-4">Control your privacy preferences</p>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">Allow order history tracking</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">Share data for personalized recommendations</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
