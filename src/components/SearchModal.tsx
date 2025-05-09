
import React, { useState, useEffect, useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { enableModalScrolling } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      enableModalScrolling(contentRef.current);
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        title: "Search error",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
      toast({
        title: "Search results",
        description: `No results found for "${searchQuery}". Search functionality will be fully implemented in future updates.`,
      });
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md overflow-y-auto max-h-[85vh] bg-white dark:bg-gray-800 text-gray-900 dark:text-white" ref={contentRef}>
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">Search Products & Articles</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSearch} className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search for plants, gardening tools, articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="col-span-3 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              autoFocus
            />
            <Button type="submit" disabled={isSearching} className="bg-eco-600 hover:bg-eco-700 text-white">
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2">Search</span>
            </Button>
          </div>
        </form>
        <DialogFooter className="sm:justify-start">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Try searching for plants, tools, or gardening tips
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
