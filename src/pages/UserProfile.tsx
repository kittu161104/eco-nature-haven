
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Check, MapPin, Phone, User, Package, Heart, RotateCcw, CreditCard, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [returns, setReturns] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {},
    preferences: {},
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || {},
        preferences: user.preferences || {},
      });
      fetchUserData();
    }
  }, [isAuthenticated, user, navigate]);

  const fetchUserData = async () => {
    if (!user) return;

    // Fetch orders
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Fetch refunds
    const { data: refundsData } = await supabase
      .from('refunds')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Fetch returns
    const { data: returnsData } = await supabase
      .from('returns')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setOrders(ordersData || []);
    setRefunds(refundsData || []);
    setReturns(returnsData || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      await updateUser(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error("Failed to update profile");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast.info("You have been logged out");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  if (!user) return null;

  return (
    <div className="container max-w-6xl py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">My Account</h1>
            <p className="text-gray-400">Manage your account and orders</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            {user.is_admin && (
              <Button onClick={() => navigate("/admin")} className="bg-green-600 hover:bg-green-700">
                Admin Panel
              </Button>
            )}
            <Button onClick={handleLogout} variant="outline" className="border-green-600 text-green-400 hover:bg-green-900/20">
              Log Out
            </Button>
          </div>
        </div>

        <Card className="glass border-green-800/30">
          <CardContent className="p-0">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="w-full bg-black/40 border-b border-green-900/30 rounded-none">
                <TabsTrigger value="profile" className="data-[state=active]:bg-green-900/20 data-[state=active]:text-white text-gray-400">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="orders" className="data-[state=active]:bg-green-900/20 data-[state=active]:text-white text-gray-400">
                  <Package className="h-4 w-4 mr-2" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="refunds" className="data-[state=active]:bg-green-900/20 data-[state=active]:text-white text-gray-400">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Refunds
                </TabsTrigger>
                <TabsTrigger value="returns" className="data-[state=active]:bg-green-900/20 data-[state=active]:text-white text-gray-400">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Returns
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-green-900/20 data-[state=active]:text-white text-gray-400">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-900/30 rounded-full p-3">
                      <User className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{user.name}</h3>
                      <p className="text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="border-green-600 text-green-400">
                      Edit Profile
                    </Button>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white">Full Name</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        disabled={!isEditing}
                        className="bg-black/40 border-green-900/50 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Email</Label>
                      <Input
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled={!isEditing}
                        className="bg-black/40 border-green-900/50 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Phone</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        disabled={!isEditing}
                        className="bg-black/40 border-green-900/50 text-white"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="border-green-900 text-white">
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        <Check className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </form>
              </TabsContent>

              <TabsContent value="orders" className="p-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Your Orders</h3>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order: any) => (
                        <Card key={order.id} className="glass border-green-800/30">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-white">Order #{order.order_number}</p>
                                <p className="text-gray-400">Total: ₹{order.total}</p>
                                <p className="text-gray-400">Status: {order.status}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-400">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </p>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  order.status === 'delivered' ? 'bg-green-900/30 text-green-400' :
                                  order.status === 'shipped' ? 'bg-blue-900/30 text-blue-400' :
                                  'bg-yellow-900/30 text-yellow-400'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No orders found.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="refunds" className="p-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Refund Requests</h3>
                  {refunds.length > 0 ? (
                    <div className="space-y-4">
                      {refunds.map((refund: any) => (
                        <Card key={refund.id} className="glass border-green-800/30">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-white">Refund Request</p>
                                <p className="text-gray-400">Amount: ₹{refund.amount}</p>
                                <p className="text-gray-400">Reason: {refund.reason}</p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                refund.status === 'processed' ? 'bg-green-900/30 text-green-400' :
                                refund.status === 'approved' ? 'bg-blue-900/30 text-blue-400' :
                                'bg-yellow-900/30 text-yellow-400'
                              }`}>
                                {refund.status}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No refund requests found.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="returns" className="p-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Return Requests</h3>
                  {returns.length > 0 ? (
                    <div className="space-y-4">
                      {returns.map((returnItem: any) => (
                        <Card key={returnItem.id} className="glass border-green-800/30">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-white">Return Request</p>
                                <p className="text-gray-400">Reason: {returnItem.reason}</p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                returnItem.status === 'processed' ? 'bg-green-900/30 text-green-400' :
                                returnItem.status === 'approved' ? 'bg-blue-900/30 text-blue-400' :
                                'bg-yellow-900/30 text-yellow-400'
                              }`}>
                                {returnItem.status}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No return requests found.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="settings" className="p-6">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white">Account Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Email Notifications</Label>
                        <p className="text-sm text-gray-400">Receive order updates via email</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <Separator className="bg-green-900/30" />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">SMS Notifications</Label>
                        <p className="text-sm text-gray-400">Receive order updates via SMS</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
