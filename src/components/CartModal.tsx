
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Leaf, TrashIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const { toast } = useToast();
  // Placeholder for cart items (would come from a context or state management in a real app)
  const cartItems: any[] = [];

  const handleCheckout = () => {
    toast({
      title: "Checkout",
      description: "Checkout functionality will be implemented in future updates.",
    });
    onClose();
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
        <div className="py-4">
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
              {/* Cart items would be mapped here */}
            </div>
          )}
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button onClick={onClose} variant="outline" className="sm:w-auto w-full">
            Continue Shopping
          </Button>
          <Button 
            onClick={handleCheckout} 
            disabled={cartItems.length === 0}
            className="sm:w-auto w-full"
          >
            Checkout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CartModal;
