
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Leaf, Trash, MinusCircle, PlusCircle, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load cart items from localStorage
  useEffect(() => {
    const loadCart = () => {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      } else {
        setCartItems([]);
      }
    };

    loadCart();
    
    // Set up event listener for cart updates
    const handleCartUpdates = () => {
      loadCart();
    };
    
    window.addEventListener('cart-updated', handleCartUpdates);
    
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdates);
    };
  }, [isOpen]);

  const updateCart = (updatedCart: CartItem[]) => {
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    // Dispatch event for cart updates
    window.dispatchEvent(new CustomEvent('cart-updated'));
  };

  const incrementQuantity = (itemId: string) => {
    const updatedCart = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedCart);
  };

  const decrementQuantity = (itemId: string) => {
    const updatedCart = cartItems.map(item => 
      item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    updateCart(updatedCart);
  };

  const removeItem = (itemId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    updateCart(updatedCart);
    
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    setLoading(true);
    
    // Redirect non-logged in users to login
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to complete your purchase",
      });
      onClose();
      navigate("/login");
      return;
    }
    
    // Close modal and navigate to payment page
    onClose();
    navigate("/payment", { 
      state: { 
        cartItems,
        total: calculateTotal()
      } 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Shopping Cart
          </DialogTitle>
          <DialogDescription>
            {cartItems.length === 0 ? "Your cart is empty" : `${cartItems.length} items in your cart`}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <Leaf className="h-12 w-12 text-eco-600 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-2">
                Browse our products and add something you like
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-3 border-b">
                  <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                    ) : (
                      <Leaf className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <div className="text-sm text-gray-500">₹{item.price.toFixed(2)}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <button 
                        onClick={() => decrementQuantity(item.id)}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={item.quantity <= 1}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => incrementQuantity(item.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <PlusCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="mt-1 text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="pt-2">
                <div className="flex justify-between py-2 font-medium">
                  <span>Subtotal:</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 text-sm text-gray-500">
                  <span>Shipping:</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button onClick={onClose} variant="outline" className="sm:w-auto w-full">
            Continue Shopping
          </Button>
          <Button 
            onClick={handleCheckout} 
            disabled={cartItems.length === 0 || loading}
            className="sm:w-auto w-full"
          >
            {loading ? (
              <>Processing...</>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Checkout
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CartModal;
