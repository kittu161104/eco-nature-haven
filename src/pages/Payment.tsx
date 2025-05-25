
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { CreditCard, CheckCircle2, Truck, ChevronLeft, ShieldCheck } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

const Payment = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(50);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    upiId: "",
    saveInfo: true,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/payment" } });
      return;
    }

    // Get cart items either from location state or localStorage
    let items: CartItem[] = [];
    if (location.state?.cartItems) {
      items = location.state.cartItems;
    } else {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        items = JSON.parse(storedCart);
      }
    }

    if (items.length === 0) {
      navigate("/shop");
      return;
    }

    setCartItems(items);

    // Calculate subtotal
    const calculatedSubtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setSubtotal(calculatedSubtotal);

    // Free shipping for orders over 500
    const calculatedShipping = calculatedSubtotal > 500 ? 0 : 50;
    setShippingCost(calculatedShipping);

    // Calculate total
    setTotal(calculatedSubtotal + calculatedShipping);
  }, [isAuthenticated, navigate, location.state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.address || !formData.city || 
        !formData.state || !formData.pincode || !formData.phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Validate UPI ID for UPI payment
    if (paymentMethod === "upi" && !formData.upiId) {
      toast({
        title: "UPI ID required",
        description: "Please enter your UPI ID for UPI payment",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate payment processing
      if (paymentMethod === "upi") {
        // Get admin UPI settings
        const adminSettings = JSON.parse(localStorage.getItem("adminSettings") || "{}");
        const adminUpiId = adminSettings.upiId;
        
        if (!adminUpiId) {
          toast({
            title: "Payment unavailable",
            description: "UPI payment is currently not available. Please try Cash on Delivery.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
        // Simulate UPI payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast({
          title: "Payment initiated",
          description: `Please complete payment to ${adminUpiId} using your UPI app`,
        });
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a random order ID
      const newOrderId = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
      setOrderId(newOrderId);
      
      // Create new order
      const newOrder = {
        id: newOrderId,
        userId: user?.id,
        items: cartItems,
        total: total,
        status: paymentMethod === "upi" ? "pending_payment" : "processing",
        createdAt: new Date().toISOString(),
        shipping: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone
        },
        paymentMethod,
        upiId: paymentMethod === "upi" ? formData.upiId : undefined
      };
      
      // Save order to localStorage
      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      const updatedOrders = [...existingOrders, newOrder];
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      
      // Clear cart
      localStorage.setItem("cart", JSON.stringify([]));
      window.dispatchEvent(new CustomEvent('cart-updated'));
      
      // Show success
      setOrderPlaced(true);
      
    } catch (error) {
      toast({
        title: "Order failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow py-12">
          <div className="eco-container">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                <p className="text-gray-600">
                  Thank you for your purchase. Your order has been placed successfully.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Order ID:</span>
                  <span>{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Order Status:</span>
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-medium">
                    Processing
                  </span>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-3">Order Summary</h3>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                      </div>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shippingCost > 0 ? `₹${shippingCost.toFixed(2)}` : "Free"}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  We've sent a confirmation email to {formData.email} with your order details.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => navigate("/orders")}>
                    View Order Status
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/")}>
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="eco-container">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold mb-8 text-eco-800">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping and Payment Forms */}
            <div className="lg:col-span-2">
              <form onSubmit={handlePlaceOrder}>
                {/* Shipping Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                  <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="name">Full Name*</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email*</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor="address">Address*</Label>
                    <Input 
                      id="address" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label htmlFor="city">City*</Label>
                      <Input 
                        id="city" 
                        name="city" 
                        value={formData.city} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State*</Label>
                      <Select 
                        value={formData.state} 
                        onValueChange={(value) => setFormData({...formData, state: value})}
                      >
                        <SelectTrigger id="state" className="w-full">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="delhi">Delhi</SelectItem>
                          <SelectItem value="maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="karnataka">Karnataka</SelectItem>
                          <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                          <SelectItem value="kerala">Kerala</SelectItem>
                          <SelectItem value="gujarat">Gujarat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="pincode">PIN Code*</Label>
                      <Input 
                        id="pincode" 
                        name="pincode" 
                        value={formData.pincode} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor="phone">Phone Number*</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="saveInfo" 
                      checked={formData.saveInfo} 
                      onCheckedChange={(checked) => 
                        setFormData({...formData, saveInfo: Boolean(checked)})
                      } 
                    />
                    <label htmlFor="saveInfo" className="text-sm">
                      Save this information for next time
                    </label>
                  </div>
                </div>
                
                {/* Payment Method */}
                <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center cursor-pointer">
                        <div className="h-5 w-5 mr-2 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">₹</span>
                        </div>
                        UPI Payment
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="cursor-pointer">Cash on Delivery</Label>
                    </div>
                  </RadioGroup>
                  
                  {paymentMethod === "upi" && (
                    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                      <div className="mb-4">
                        <Label htmlFor="upiId">Your UPI ID</Label>
                        <Input 
                          id="upiId" 
                          name="upiId"
                          placeholder="yourname@paytm / yourname@googlepay" 
                          value={formData.upiId}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="text-sm text-gray-600">
                        <p className="mb-2">Supported UPI Apps:</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">PhonePe</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Google Pay</span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">Paytm</span>
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">BHIM</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === "cod" && (
                    <div className="mt-4 p-4 border rounded-lg bg-yellow-50">
                      <p className="text-sm text-yellow-800">
                        <strong>Cash on Delivery:</strong> Pay when your order is delivered to your doorstep. 
                        Please keep exact change ready.
                      </p>
                    </div>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full py-6" 
                  disabled={loading}
                >
                  {loading ? "Processing..." : 
                    paymentMethod === "upi" ? 
                      `Proceed to UPI Payment • ₹${total.toFixed(2)}` : 
                      `Place Order • ₹${total.toFixed(2)}`
                  }
                </Button>
                
                <div className="text-center mt-4 flex items-center justify-center text-sm text-gray-500">
                  <ShieldCheck className="h-4 w-4 mr-1" />
                  Safe & Secure Payment
                </div>
              </form>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-medium">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <span>Shipping</span>
                      {shippingCost === 0 && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                          Free
                        </span>
                      )}
                    </div>
                    <span>{shippingCost > 0 ? `₹${shippingCost.toFixed(2)}` : "₹0.00"}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                
                {shippingCost > 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 text-sm rounded-lg flex items-start">
                    <Truck className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Add ₹{(500 - subtotal).toFixed(2)} more to your order to qualify for free shipping.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
