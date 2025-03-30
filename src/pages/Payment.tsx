
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Building, 
  Landmark,
  Wallet, 
  ChevronsRight, 
  AlertCircle,
  ArrowLeft,
  ShoppingBag
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface PaymentPageState {
  cartItems: CartItem[];
  total: number;
}

const Payment = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState({
    name: user?.name || "",
    address: "123 Main Street",
    city: "Mumbai",
    state: "Maharashtra",
    zip: "400001",
    country: "India"
  });

  useEffect(() => {
    // Check if we have state passed from cart
    if (location.state) {
      const state = location.state as PaymentPageState;
      setCartItems(state.cartItems);
      setTotal(state.total);
    } else {
      // If not, load from localStorage
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const items = JSON.parse(storedCart);
        setCartItems(items);
        setTotal(items.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0));
      } else {
        // If no cart items found, redirect back to shop
        navigate("/shop");
        toast({
          title: "No items in cart",
          description: "Please add items to your cart before checkout",
        });
      }
    }
  }, [location.state, navigate, toast]);

  // Handle card number input formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value
      .replace(/(\d{4})(?=\d)/g, '$1 ')
      .trim()
      .slice(0, 19);
    setCardNumber(formattedValue);
  };

  // Handle expiry date input formatting
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 2) {
      setCardExpiry(value);
    } else {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
    }
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    
    // Basic validation
    if (paymentMethod === "credit-card" || paymentMethod === "debit-card") {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        toast({
          variant: "destructive",
          title: "Missing information",
          description: "Please fill in all card details",
        });
        setIsProcessing(false);
        return;
      }
    } else if (paymentMethod === "upi" && !upiId) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter your UPI ID",
      });
      setIsProcessing(false);
      return;
    }

    // Simulate payment processing
    setTimeout(() => {
      // Create order in localStorage
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      const orderId = `ORD-${Date.now().toString().slice(-8)}`;
      
      const newOrder = {
        id: orders.length + 1,
        orderNumber: orderId,
        userId: user?.id,
        customer: user?.name,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        total: total,
        status: "pending" as const,
        tracking: {
          current: "ordered",
          history: [
            {
              status: "ordered",
              date: new Date().toISOString(),
              message: "Order placed successfully"
            }
          ]
        },
        items: cartItems.map(item => ({
          id: item.id,
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        shippingAddress: address,
        paymentMethod: 
          paymentMethod === "credit-card" ? "Credit Card" :
          paymentMethod === "debit-card" ? "Debit Card" :
          paymentMethod === "netbanking" ? "Net Banking" : "UPI Payment",
        paymentDetails: paymentMethod === "credit-card" || paymentMethod === "debit-card" ? 
          `Card ending with ${cardNumber.slice(-4)}` : 
          paymentMethod === "upi" ? `UPI ID: ${upiId}` : "",
        actions: []
      };
      
      orders.push(newOrder);
      localStorage.setItem("orders", JSON.stringify(orders));
      
      // Clear cart after successful order
      localStorage.setItem("cart", JSON.stringify([]));
      window.dispatchEvent(new CustomEvent('cart-updated'));
      
      // Dispatch event to notify of order creation
      window.dispatchEvent(new CustomEvent('order-created', { 
        detail: { orderId: newOrder.id }
      }));
      
      // Show success message
      toast({
        title: "Order placed successfully!",
        description: `Your order #${orderId} has been placed.`,
      });
      
      // Navigate to orders page
      navigate("/orders");
      
      setIsProcessing(false);
    }, 2000);
  };

  const getPaymentIcon = () => {
    switch (paymentMethod) {
      case "credit-card":
      case "debit-card":
        return <CreditCard className="h-5 w-5" />;
      case "netbanking":
        return <Building className="h-5 w-5" />;
      case "upi":
        return <Wallet className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-eco-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left side - Payment form */}
            <div className="w-full md:w-2/3">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-eco-800">Payment</h1>
                <Button 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Cart
                </Button>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={address.name} 
                          onChange={(e) => setAddress({...address, name: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">Zip Code</Label>
                        <Input 
                          id="zip" 
                          value={address.zip} 
                          onChange={(e) => setAddress({...address, zip: e.target.value})} 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input 
                        id="address" 
                        value={address.address} 
                        onChange={(e) => setAddress({...address, address: e.target.value})} 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input 
                          id="city" 
                          value={address.city} 
                          onChange={(e) => setAddress({...address, city: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input 
                          id="state" 
                          value={address.state} 
                          onChange={(e) => setAddress({...address, state: e.target.value})} 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input 
                        id="country" 
                        value={address.country} 
                        onChange={(e) => setAddress({...address, country: e.target.value})} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>
                    Choose your preferred payment method
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="flex items-center gap-2 font-medium cursor-pointer">
                        <CreditCard className="h-5 w-5 text-eco-600" />
                        Credit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                      <RadioGroupItem value="debit-card" id="debit-card" />
                      <Label htmlFor="debit-card" className="flex items-center gap-2 font-medium cursor-pointer">
                        <CreditCard className="h-5 w-5 text-eco-600" />
                        Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                      <RadioGroupItem value="netbanking" id="netbanking" />
                      <Label htmlFor="netbanking" className="flex items-center gap-2 font-medium cursor-pointer">
                        <Landmark className="h-5 w-5 text-eco-600" />
                        Net Banking
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center gap-2 font-medium cursor-pointer">
                        <Wallet className="h-5 w-5 text-eco-600" />
                        UPI Payment
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* Conditional payment form based on selected method */}
                  <div className="mt-6">
                    {(paymentMethod === "credit-card" || paymentMethod === "debit-card") && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-number">Card Number</Label>
                          <Input
                            id="card-number"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            maxLength={19}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="card-name">Cardholder Name</Label>
                          <Input
                            id="card-name"
                            placeholder="John Doe"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input
                              id="expiry"
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={handleExpiryChange}
                              maxLength={5}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={cardCvv}
                              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                              maxLength={3}
                              type="password"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "netbanking" && (
                      <div className="space-y-4">
                        <div className="bg-eco-50 p-4 rounded-md flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-eco-600 mt-0.5" />
                          <p className="text-sm text-gray-600">
                            You will be redirected to your bank's website to complete the payment after placing the order.
                          </p>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "upi" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="upi-id">UPI ID</Label>
                          <Input
                            id="upi-id"
                            placeholder="username@upi"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                          />
                        </div>
                        <div className="bg-eco-50 p-4 rounded-md flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-eco-600 mt-0.5" />
                          <p className="text-sm text-gray-600">
                            You will receive a payment request on your UPI app after placing the order.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={handlePlaceOrder} 
                    disabled={isProcessing}
                    className="w-full md:w-auto"
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        {getPaymentIcon()}
                        <span className="ml-2">Place Order</span>
                        <ChevronsRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Right side - Order summary */}
            <div className="w-full md:w-1/3">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            <ShoppingBag className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                        </div>
                        <div className="text-right font-medium">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax</span>
                        <span>₹{(total * 0.18).toFixed(2)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>₹{(total + total * 0.18).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
