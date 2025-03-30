
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Package, 
  ShoppingBag, 
  Calendar, 
  Clock, 
  IndianRupee, 
  Truck, 
  CheckCircle2,
  ClipboardList,
  XCircle,
  RefreshCw,
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";

// Order type definition
interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface TrackingHistory {
  status: string;
  date: string;
  message: string;
}

interface OrderAction {
  type: "cancel" | "return" | "refund";
  requestDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  responseMessage?: string;
  responseDate?: string;
}

interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  tracking?: {
    current: string;
    history: TrackingHistory[];
  };
  actions?: OrderAction[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod: string;
  paymentDetails?: string;
  createdAt: string;
  updatedAt: string;
}

const UserOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"cancel" | "return" | "refund">("cancel");
  const [actionReason, setActionReason] = useState("");
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
    
    // Listen for new orders created via checkout
    const handleOrderCreated = () => {
      fetchOrders();
    };
    
    window.addEventListener('order-created', handleOrderCreated);
    
    // Listen for order status changes from admin panel
    const handleOrderUpdated = () => {
      fetchOrders();
    };
    
    window.addEventListener('orders-updated', handleOrderUpdated);
    
    return () => {
      window.removeEventListener('order-created', handleOrderCreated);
      window.removeEventListener('orders-updated', handleOrderUpdated);
    };
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

  const getActionStatusBadge = (status: OrderAction['status']) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleOrderAction = () => {
    if (!selectedOrder || !actionReason.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide a reason for your request.",
      });
      return;
    }

    const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const orderIndex = allOrders.findIndex((o: Order) => o.id === selectedOrder.id);
    
    if (orderIndex !== -1) {
      // Create new action
      const newAction: OrderAction = {
        type: actionType,
        requestDate: new Date().toISOString(),
        reason: actionReason,
        status: "pending"
      };
      
      // Update order with the new action
      if (!allOrders[orderIndex].actions) {
        allOrders[orderIndex].actions = [];
      }
      
      allOrders[orderIndex].actions.push(newAction);
      
      // If cancellation and order is still pending, update status
      if (actionType === "cancel" && allOrders[orderIndex].status === "pending") {
        allOrders[orderIndex].status = "cancelled";
        
        if (allOrders[orderIndex].tracking) {
          allOrders[orderIndex].tracking.current = "cancelled";
          allOrders[orderIndex].tracking.history.push({
            status: "cancelled",
            date: new Date().toISOString(),
            message: "Order cancelled by customer"
          });
        }
      }
      
      // Save updated orders
      localStorage.setItem("orders", JSON.stringify(allOrders));
      
      // Refresh orders list
      setOrders(allOrders.filter((order: Order) => order.userId === user?.id));
      
      // Show success message
      toast({
        title: 
          actionType === "cancel" ? "Cancellation request submitted" :
          actionType === "return" ? "Return request submitted" :
          "Refund request submitted",
        description: "Your request has been submitted and will be processed soon.",
      });
      
      // Dispatch event for admin panel to update
      window.dispatchEvent(new CustomEvent('orders-updated'));
      
      // Close dialog and reset form
      setIsActionDialogOpen(false);
      setActionReason("");
      setSelectedOrder(null);
    }
  };

  const canCancel = (order: Order) => {
    return order.status === "pending";
  };

  const canReturn = (order: Order) => {
    return order.status === "delivered" && 
           (new Date().getTime() - new Date(order.updatedAt).getTime()) < 14 * 24 * 60 * 60 * 1000; // 14 days
  };

  const canRefund = (order: Order) => {
    return (order.status === "delivered" || order.status === "shipped") && 
           (new Date().getTime() - new Date(order.createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000; // 30 days
  };

  const hasActiveAction = (order: Order, type: "cancel" | "return" | "refund") => {
    return order.actions?.some(action => 
      action.type === type && action.status === "pending"
    );
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
                          Order #{order.orderNumber || (typeof order.id === 'string' ? order.id.slice(-8) : order.id)}
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
                            {/* Order Tracking Section */}
                            {order.tracking && (
                              <div className="bg-gray-50 p-4 rounded-md">
                                <h3 className="font-medium mb-4 flex items-center">
                                  <Truck className="h-4 w-4 mr-2" />
                                  Order Tracking
                                </h3>
                                <div className="relative">
                                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                                  <div className="space-y-6">
                                    {order.tracking.history.map((step, index) => (
                                      <div key={index} className="relative flex items-start">
                                        <div className={`absolute left-0 w-6 h-6 rounded-full flex items-center justify-center ${
                                          index === 0 ? "bg-eco-600 text-white" : "bg-gray-200 text-gray-500"
                                        }`}>
                                          {index === 0 ? (
                                            <CheckCircle2 className="w-4 h-4" />
                                          ) : (
                                            <span className="text-xs">{index + 1}</span>
                                          )}
                                        </div>
                                        <div className="ml-10">
                                          <p className="font-medium capitalize">{step.status}</p>
                                          <p className="text-sm text-gray-500">
                                            {format(new Date(step.date), 'MMM dd, yyyy - HH:mm')}
                                          </p>
                                          <p className="text-sm">{step.message}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                            
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
                            
                            {/* Order Items Section */}
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
                            
                            {/* Payment Summary Section */}
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
                                {order.paymentDetails && (
                                  <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Payment Details</span>
                                    <span>{order.paymentDetails}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Order Actions History Section */}
                            {order.actions && order.actions.length > 0 && (
                              <div className="bg-gray-50 p-4 rounded-md">
                                <h3 className="font-medium mb-2 flex items-center">
                                  <ClipboardList className="h-4 w-4 mr-2" />
                                  Action History
                                </h3>
                                <div className="space-y-4">
                                  {order.actions.map((action, index) => (
                                    <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <p className="font-medium capitalize">
                                            {action.type} Request
                                          </p>
                                          <p className="text-sm text-gray-500">
                                            {format(new Date(action.requestDate), 'MMM dd, yyyy - HH:mm')}
                                          </p>
                                        </div>
                                        <div>
                                          {getActionStatusBadge(action.status)}
                                        </div>
                                      </div>
                                      <p className="text-sm mt-2">
                                        <span className="font-medium">Reason:</span> {action.reason}
                                      </p>
                                      {action.responseMessage && (
                                        <div className="mt-2 text-sm bg-gray-100 p-2 rounded">
                                          <p className="font-medium">Response:</p>
                                          <p>{action.responseMessage}</p>
                                          {action.responseDate && (
                                            <p className="text-xs text-gray-500 mt-1">
                                              {format(new Date(action.responseDate), 'MMM dd, yyyy - HH:mm')}
                                            </p>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2 bg-gray-50 border-t p-4">
                    <Button variant="outline" size="sm" onClick={() => window.print()}>
                      Print Receipt
                    </Button>
                    
                    {canCancel(order) && !hasActiveAction(order, "cancel") && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 border-red-200">
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Order
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel this order? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>No, Keep Order</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                setSelectedOrder(order);
                                setActionType("cancel");
                                setIsActionDialogOpen(true);
                              }}
                            >
                              Yes, Cancel Order
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    
                    {canReturn(order) && !hasActiveAction(order, "return") && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setActionType("return");
                          setIsActionDialogOpen(true);
                        }}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Return Item
                      </Button>
                    )}
                    
                    {canRefund(order) && !hasActiveAction(order, "refund") && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setActionType("refund");
                          setIsActionDialogOpen(true);
                        }}
                      >
                        <IndianRupee className="h-4 w-4 mr-2" />
                        Request Refund
                      </Button>
                    )}
                    
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

      {/* Action Dialog (Cancel/Return/Refund) */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "cancel" 
                ? "Cancel Order" 
                : actionType === "return" 
                  ? "Return Items" 
                  : "Request Refund"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "cancel" 
                ? "Please provide a reason for cancelling this order."
                : actionType === "return"
                  ? "Please provide details about why you're returning these items."
                  : "Please explain why you're requesting a refund."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="reason">Reason</label>
              <Textarea
                id="reason"
                placeholder="Enter your reason here..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="bg-yellow-50 p-3 rounded-md text-sm flex gap-2 text-yellow-800 border border-yellow-200">
              <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
              <div>
                {actionType === "cancel" 
                  ? "Cancellation is only possible for pending orders. Once shipped, you'll need to return the items."
                  : actionType === "return"
                    ? "Returns are only accepted within 14 days of delivery and items must be in original condition."
                    : "Refund requests are processed within 7-10 business days after approval."}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleOrderAction}
              disabled={!actionReason.trim()}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default UserOrders;
