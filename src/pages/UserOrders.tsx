
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Package, 
  ShoppingBag, 
  Calendar, 
  Clock, 
  IndianRupee, 
  Truck, 
  CheckCircle2,
  ClipboardList 
} from "lucide-react";
import { format } from "date-fns";

// Order type definition
interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

const UserOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to view your orders.",
      });
    }
  }, [isAuthenticated, navigate, toast]);

  // Fetch user's orders
  useEffect(() => {
    if (!user) return;

    const fetchOrders = () => {
      setIsLoading(true);
      try {
        // Get orders from localStorage
        const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        
        // Filter orders for current user
        const userOrders = allOrders.filter((order: Order) => order.userId === user.id);
        
        // Sort by date (newest first)
        userOrders.sort((a: Order, b: Order) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setOrders(userOrders);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your orders.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, toast]);

  // Helper function to get status badge
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "processing":
        return <Badge className="bg-blue-500">Processing</Badge>;
      case "shipped":
        return <Badge className="bg-purple-500">Shipped</Badge>;
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-eco-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-eco-800">My Orders</h1>
            <Button variant="outline" onClick={() => navigate('/shop')}>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-pulse">Loading orders...</div>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-eco-50">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center">
                          <Package className="h-5 w-5 mr-2 text-eco-600" />
                          Order #{order.id.slice(-8)}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {format(new Date(order.createdAt), 'HH:mm')}
                            </span>
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-2">
                        {getStatusBadge(order.status)}
                        <span className="font-semibold flex items-center">
                          <IndianRupee className="h-4 w-4" />
                          {order.total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="order-details">
                        <AccordionTrigger className="px-6 py-4">
                          Order Details
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                          <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-md">
                              <h3 className="font-medium mb-2 flex items-center">
                                <Truck className="h-4 w-4 mr-2" />
                                Shipping Information
                              </h3>
                              <p>{order.shippingAddress.name}</p>
                              <p>{order.shippingAddress.address}</p>
                              <p>
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                              </p>
                              <p>{order.shippingAddress.country}</p>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-md">
                              <h3 className="font-medium mb-2 flex items-center">
                                <ClipboardList className="h-4 w-4 mr-2" />
                                Order Items
                              </h3>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-right">Qty</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {order.items.map((item) => (
                                    <TableRow key={item.id}>
                                      <TableCell>
                                        <div className="flex items-center gap-3">
                                          {item.image && (
                                            <img 
                                              src={item.image} 
                                              alt={item.name} 
                                              className="h-10 w-10 object-cover rounded"
                                            />
                                          )}
                                          <span>{item.name}</span>
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-right">{item.quantity}</TableCell>
                                      <TableCell className="text-right">₹{item.price.toLocaleString('en-IN')}</TableCell>
                                      <TableCell className="text-right">₹{(item.price * item.quantity).toLocaleString('en-IN')}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-md">
                              <h3 className="font-medium mb-2">Payment Summary</h3>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Subtotal</span>
                                  <span>₹{order.total.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Shipping</span>
                                  <span>Free</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold">
                                  <span>Total</span>
                                  <span>₹{order.total.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                  <span>Payment Method</span>
                                  <span>{order.paymentMethod}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                  <CardFooter className="flex justify-between bg-gray-50 border-t">
                    <Button variant="outline" size="sm" onClick={() => window.print()}>
                      Print Receipt
                    </Button>
                    {order.status === "delivered" && (
                      <Button variant="outline" size="sm" className="text-green-600 border-green-200">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Delivered
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent className="pt-12">
                <ShoppingBag className="h-16 w-16 text-eco-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No orders found</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't placed any orders yet. Start shopping to see your orders here.
                </p>
                <Button onClick={() => navigate('/shop')} className="bg-eco-600 hover:bg-eco-700">
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserOrders;
