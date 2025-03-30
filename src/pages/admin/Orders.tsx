
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Download, 
  Eye, 
  Search, 
  Truck, 
  Package, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Clock,
  User,
  Phone
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { format, isValid, parseISO } from "date-fns";

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
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
  id: number;
  orderNumber: string;
  userId: string;
  customer: string;
  date: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  tracking?: {
    current: string;
    history: TrackingHistory[];
  };
  actions?: OrderAction[];
  shippingAddress?: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod?: string;
  paymentDetails?: string;
  createdAt: string;
  updatedAt: string;
}

// Helper function to safely format dates
const safeFormatDate = (dateString: string, formatStr: string = 'MMM dd, yyyy - HH:mm'): string => {
  if (!dateString) return 'Invalid date';
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Invalid date';
    return format(date, formatStr);
  } catch (error) {
    console.error("Date formatting error:", error, "for date string:", dateString);
    return 'Invalid date';
  }
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [trackingUpdate, setTrackingUpdate] = useState<string>("");
  const [trackingMessage, setTrackingMessage] = useState<string>("");
  const [actionResponse, setActionResponse] = useState<string>("");
  const [actionStatus, setActionStatus] = useState<"approved" | "rejected">("approved");
  const [selectedAction, setSelectedAction] = useState<OrderAction | null>(null);
  const { toast } = useToast();

  // Load orders from localStorage or start with empty array
  useEffect(() => {
    const loadOrders = () => {
      const savedOrders = localStorage.getItem("orders");
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    };
    
    // Initial load
    loadOrders();
    
    // Listen for order creation events
    const handleOrderCreated = () => {
      loadOrders();
    };
    
    window.addEventListener('order-created', handleOrderCreated);
    
    return () => {
      window.removeEventListener('order-created', handleOrderCreated);
    };
  }, []);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleStatusChange = (orderId: number, newStatus: Order["status"]) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        // Update tracking information if it exists
        let updatedTracking = order.tracking;
        if (updatedTracking) {
          updatedTracking.current = newStatus;
          updatedTracking.history.unshift({
            status: newStatus,
            date: new Date().toISOString(),
            message: `Order ${newStatus}`
          });
        } else {
          // Create tracking if it doesn't exist
          updatedTracking = {
            current: newStatus,
            history: [{
              status: newStatus,
              date: new Date().toISOString(),
              message: `Order ${newStatus}`
            }]
          };
        }
        
        return { 
          ...order, 
          status: newStatus,
          tracking: updatedTracking,
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    
    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('orders-updated'));
    
    toast({
      title: "Order status updated",
      description: `Order #${orderId} has been marked as ${newStatus}`,
    });
  };

  const handleTrackingUpdate = (orderId: number) => {
    if (!trackingUpdate || !trackingMessage) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both a tracking status and message",
      });
      return;
    }
    
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        // Update tracking information
        let updatedTracking = order.tracking || {
          current: order.status,
          history: []
        };
        
        updatedTracking.current = trackingUpdate;
        updatedTracking.history.unshift({
          status: trackingUpdate,
          date: new Date().toISOString(),
          message: trackingMessage
        });
        
        return { 
          ...order, 
          tracking: updatedTracking,
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    
    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('orders-updated'));
    
    toast({
      title: "Tracking updated",
      description: "Order tracking information has been updated",
    });
    
    // Reset form
    setTrackingUpdate("");
    setTrackingMessage("");
  };

  const handleActionResponse = (orderId: number, actionIndex: number) => {
    if (!actionResponse) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide a response message",
      });
      return;
    }
    
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId && order.actions && order.actions[actionIndex]) {
        const updatedActions = [...order.actions];
        updatedActions[actionIndex] = {
          ...updatedActions[actionIndex],
          status: actionStatus,
          responseMessage: actionResponse,
          responseDate: new Date().toISOString()
        };
        
        // If approving a cancellation request, update order status
        if (actionStatus === "approved" && updatedActions[actionIndex].type === "cancel") {
          // Update tracking
          let updatedTracking = order.tracking || {
            current: "cancelled",
            history: []
          };
          
          updatedTracking.current = "cancelled";
          updatedTracking.history.unshift({
            status: "cancelled",
            date: new Date().toISOString(),
            message: "Order cancelled by admin"
          });
          
          return { 
            ...order, 
            actions: updatedActions,
            status: "cancelled" as Order["status"],
            tracking: updatedTracking,
            updatedAt: new Date().toISOString()
          };
        } else if (actionStatus === "approved" && updatedActions[actionIndex].type === "refund") {
          // Add a tracking entry for refund approval
          let updatedTracking = order.tracking || {
            current: order.status,
            history: []
          };
          
          updatedTracking.history.unshift({
            status: "refund_approved",
            date: new Date().toISOString(),
            message: "Refund approved and processing"
          });
          
          return { 
            ...order, 
            actions: updatedActions,
            tracking: updatedTracking,
            updatedAt: new Date().toISOString()
          };
        } else if (actionStatus === "approved" && updatedActions[actionIndex].type === "return") {
          // Add a tracking entry for return approval
          let updatedTracking = order.tracking || {
            current: order.status,
            history: []
          };
          
          updatedTracking.history.unshift({
            status: "return_approved",
            date: new Date().toISOString(),
            message: "Return approved, awaiting item"
          });
          
          return { 
            ...order, 
            actions: updatedActions,
            tracking: updatedTracking,
            updatedAt: new Date().toISOString()
          };
        }
        
        return { 
          ...order, 
          actions: updatedActions,
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    
    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('orders-updated'));
    
    toast({
      title: actionStatus === "approved" ? "Request approved" : "Request rejected",
      description: `Customer request has been ${actionStatus}`,
    });
    
    // Reset form
    setActionResponse("");
    setSelectedAction(null);
  };

  const getOrdersWithPendingActions = () => {
    return orders.filter(order => 
      order.actions && order.actions.some(action => action.status === "pending")
    );
  };

  const filteredOrders = orders.filter((order) => {
    // Filter by search term
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    // Filter by action status
    const matchesAction = actionFilter === "all" || 
      (actionFilter === "pending_actions" && 
       order.actions && 
       order.actions.some(action => action.status === "pending"));
    
    return matchesSearch && matchesStatus && matchesAction;
  });

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case "cancel":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "return":
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case "refund":
        return <Calendar className="h-4 w-4 text-amber-500" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPendingActionsCount = () => {
    return orders.reduce((count, order) => {
      if (order.actions) {
        return count + order.actions.filter(action => action.status === "pending").length;
      }
      return count;
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-eco-800">Orders</h1>
        <Button variant="outline" onClick={() => toast({
          title: "Export feature",
          description: "Export functionality will be implemented in future updates.",
        })}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full md:w-60">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-60">
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending_actions">
                Pending Requests ({getPendingActionsCount()})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
              <TableHead className="text-right">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {order.date}
                    </div>
                  </TableCell>
                  <TableCell>₹{order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.actions && order.actions.some(action => action.status === "pending") ? (
                      <Badge className="bg-red-100 text-red-800 flex items-center gap-1 w-fit">
                        <AlertCircle className="h-3 w-3" />
                        <span>Action Required</span>
                      </Badge>
                    ) : (
                      <span className="text-gray-500 text-sm">No pending actions</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Order #{selectedOrder?.orderNumber}
            </DialogTitle>
            <DialogDescription>
              Placed on {selectedOrder?.date}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Order Details</TabsTrigger>
                  <TabsTrigger value="tracking">
                    Shipping & Tracking
                  </TabsTrigger>
                  <TabsTrigger value="customer">Customer Info</TabsTrigger>
                  {selectedOrder.actions && selectedOrder.actions.some(a => a.status === "pending") && (
                    <TabsTrigger value="actions" className="relative">
                      Customer Requests
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                        {selectedOrder.actions.filter(a => a.status === "pending").length}
                      </span>
                    </TabsTrigger>
                  )}
                </TabsList>
                
                {/* Order Details Tab */}
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">Order Status</h3>
                      <Select 
                        value={selectedOrder.status} 
                        onValueChange={(value: Order["status"]) => handleStatusChange(selectedOrder.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">Payment Information</h3>
                      <p><span className="font-medium">Method:</span> {selectedOrder.paymentMethod || "N/A"}</p>
                      {selectedOrder.paymentDetails && (
                        <p><span className="font-medium">Details:</span> {selectedOrder.paymentDetails}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Order Items</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {item.image && (
                                  <img src={item.image} alt={item.name} className="h-10 w-10 rounded object-cover" />
                                )}
                                {item.name}
                              </div>
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>₹{item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-medium">
                            Total
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            ₹{selectedOrder.total.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                {/* Tracking Tab */}
                <TabsContent value="tracking" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">Shipping Address</h3>
                      {selectedOrder.shippingAddress ? (
                        <div className="space-y-1">
                          <p className="font-medium">{selectedOrder.shippingAddress.name}</p>
                          <p>{selectedOrder.shippingAddress.address}</p>
                          <p>
                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}
                          </p>
                          <p>{selectedOrder.shippingAddress.country}</p>
                        </div>
                      ) : (
                        <p className="text-gray-500">No shipping address provided</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">Update Tracking</h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="tracking-status">Tracking Status</Label>
                          <Select value={trackingUpdate} onValueChange={setTrackingUpdate}>
                            <SelectTrigger id="tracking-status">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="order_confirmed">Order Confirmed</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="packed">Packed</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="delayed">Delayed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="tracking-message">Message</Label>
                          <Textarea 
                            id="tracking-message" 
                            placeholder="Add tracking details..." 
                            value={trackingMessage}
                            onChange={(e) => setTrackingMessage(e.target.value)}
                          />
                        </div>
                        
                        <Button 
                          onClick={() => handleTrackingUpdate(selectedOrder.id)}
                          disabled={!trackingUpdate || !trackingMessage}
                          size="sm"
                        >
                          <Truck className="h-4 w-4 mr-2" />
                          Update Tracking
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Tracking History</h3>
                    {selectedOrder.tracking && selectedOrder.tracking.history.length > 0 ? (
                      <div className="border rounded-md p-4">
                        <div className="relative">
                          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                          <div className="space-y-6">
                            {selectedOrder.tracking.history.map((step, index) => (
                              <div key={index} className="relative flex items-start">
                                <div className={`absolute left-0 w-6 h-6 rounded-full flex items-center justify-center ${
                                  index === 0 ? "bg-eco-600 text-white" : "bg-gray-200 text-gray-500"
                                }`}>
                                  {index === 0 ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : (
                                    <span className="text-xs">{index + 1}</span>
                                  )}
                                </div>
                                <div className="ml-10">
                                  <p className="font-medium capitalize">{step.status.replace(/_/g, ' ')}</p>
                                  <p className="text-sm text-gray-500">
                                    {safeFormatDate(step.date)}
                                  </p>
                                  <p className="text-sm">{step.message}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 border rounded-md">
                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No tracking information available</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                {/* Customer Information Tab */}
                <TabsContent value="customer" className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Details</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <p>{selectedOrder.customer}</p>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <p>Customer since: {safeFormatDate(selectedOrder.createdAt, 'MMM dd, yyyy')}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            <p>Not available</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Order History</h3>
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order #</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders
                            .filter(order => order.userId === selectedOrder.userId)
                            .map(order => (
                              <TableRow key={order.id}>
                                <TableCell>{order.orderNumber}</TableCell>
                                <TableCell>{safeFormatDate(order.createdAt, 'MMM dd, yyyy')}</TableCell>
                                <TableCell>
                                  <Badge className={getStatusColor(order.status)}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Customer Requests Tab */}
                {selectedOrder.actions && selectedOrder.actions.some(a => a.status === "pending") && (
                  <TabsContent value="actions" className="space-y-4">
                    <div className="space-y-4">
                      {selectedOrder.actions
                        .filter(action => action.status === "pending")
                        .map((action, index) => (
                          <div key={index} className="border rounded-md p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                {getActionIcon(action.type)}
                                <h3 className="font-medium capitalize">{action.type} Request</h3>
                              </div>
                              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm text-gray-500">Requested on {safeFormatDate(action.requestDate)}</p>
                              </div>
                              
                              <div className="bg-gray-50 p-3 rounded-md">
                                <p className="text-sm font-medium mb-1">Reason:</p>
                                <p className="text-sm">{action.reason}</p>
                              </div>
                              
                              <Separator />
                              
                              <div className="space-y-3">
                                <h4 className="text-sm font-medium">Your Response</h4>
                                
                                <RadioGroup 
                                  value={actionStatus} 
                                  onValueChange={(value) => setActionStatus(value as "approved" | "rejected")}
                                  className="flex space-x-4 space-y-0"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="approved" id={`approve-${index}`} />
                                    <Label htmlFor={`approve-${index}`} className="text-green-600">Approve</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="rejected" id={`reject-${index}`} />
                                    <Label htmlFor={`reject-${index}`} className="text-red-600">Reject</Label>
                                  </div>
                                </RadioGroup>
                                
                                <div className="space-y-1">
                                  <Label htmlFor={`response-${index}`}>Response Message</Label>
                                  <Textarea 
                                    id={`response-${index}`} 
                                    placeholder="Provide details about your decision..." 
                                    value={actionResponse}
                                    onChange={(e) => setActionResponse(e.target.value)}
                                  />
                                </div>
                                
                                <Button 
                                  size="sm"
                                  onClick={() => handleActionResponse(selectedOrder.id, selectedOrder.actions!.findIndex(a => a === action))}
                                  disabled={!actionResponse}
                                  variant={actionStatus === "approved" ? "default" : "outline"}
                                  className={actionStatus === "rejected" ? "border-red-200 text-red-600 hover:bg-red-50" : ""}
                                >
                                  {actionStatus === "approved" ? (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                  ) : (
                                    <XCircle className="h-4 w-4 mr-2" />
                                  )}
                                  {actionStatus === "approved" ? "Approve Request" : "Reject Request"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      
                      {selectedOrder.actions
                        .filter(action => action.status !== "pending")
                        .length > 0 && (
                          <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Past Requests</h3>
                            <div className="border rounded-md divide-y">
                              {selectedOrder.actions
                                .filter(action => action.status !== "pending")
                                .map((action, index) => (
                                  <div key={index} className="p-3">
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-2">
                                        {getActionIcon(action.type)}
                                        <span className="font-medium capitalize">{action.type}</span>
                                      </div>
                                      <Badge className={
                                        action.status === "approved" 
                                          ? "bg-green-100 text-green-800" 
                                          : "bg-red-100 text-red-800"
                                      }>
                                        {action.status.charAt(0).toUpperCase() + action.status.slice(1)}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {safeFormatDate(action.requestDate, 'MMM dd, yyyy')}
                                    </p>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              toast({
                title: "Print feature",
                description: "Print functionality will be implemented in future updates.",
              });
            }}>
              Print Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
