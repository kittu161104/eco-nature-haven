
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Pencil, Plus, Trash, Upload } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  discountPrice?: number;
  stock: number;
  image: string;
  tags: string[];
  inStock: boolean;
}

const defaultImageUrl = "/placeholder.svg";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    category: "Indoor Plants",
    price: 0,
    stock: 0,
    image: defaultImageUrl,
    tags: [],
    inStock: true,
  });
  const [tagInput, setTagInput] = useState("");
  const { toast } = useToast();

  // Load products from localStorage
  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  const handleAddProduct = () => {
    setFormData({
      name: "",
      description: "",
      category: "Indoor Plants",
      price: 0,
      discountPrice: undefined,
      stock: 0,
      image: defaultImageUrl,
      tags: [],
      inStock: true,
    });
    setTagInput("");
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      discountPrice: product.discountPrice,
      stock: product.stock,
      image: product.image,
      tags: product.tags,
      inStock: product.inStock,
    });
    setTagInput("");
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    
    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('products-updated'));
    
    toast({
      title: "Product deleted",
      description: "The product has been deleted successfully.",
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map((product) =>
        product.id === editingProduct.id
          ? { ...product, ...formData }
          : product
      );
      setProducts(updatedProducts);
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      
      toast({
        title: "Product updated",
        description: "The product has been updated successfully.",
      });
    } else {
      // Add new product
      const newProduct = {
        id: `product-${Date.now()}`,
        ...formData,
      };
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      
      toast({
        title: "Product added",
        description: "The new product has been added successfully.",
      });
    }
    
    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('products-updated'));
    
    setIsDialogOpen(false);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" || name === "discountPrice" || name === "stock" 
        ? parseFloat(value) 
        : value,
    });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    });
  };
  
  const handleInStockChange = (checked: boolean) => {
    setFormData({
      ...formData,
      inStock: checked,
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-eco-800">Products</h1>
        <Button onClick={handleAddProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img 
                      src={product.image || defaultImageUrl} 
                      alt={product.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    {product.discountPrice ? (
                      <div>
                        <span className="text-green-600">₹{product.discountPrice.toFixed(2)}</span>
                        <span className="text-gray-400 line-through ml-2">₹{product.price.toFixed(2)}</span>
                      </div>
                    ) : (
                      `₹${product.price.toFixed(2)}`
                    )}
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.inStock 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No products found. Add your first product to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Make changes to the product details below."
                : "Fill in the details for the new product."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Product Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Select 
                  value={formData.category} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Indoor Plants">Indoor Plants</SelectItem>
                    <SelectItem value="Outdoor Plants">Outdoor Plants</SelectItem>
                    <SelectItem value="Flowering Plants">Flowering Plants</SelectItem>
                    <SelectItem value="Succulents">Succulents</SelectItem>
                    <SelectItem value="Gardening Supplies">Gardening Supplies</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="image" className="text-sm font-medium">
                  Product Image
                </label>
                <div className="flex items-center gap-2">
                  <div className="h-16 w-16 border rounded flex items-center justify-center overflow-hidden">
                    <img 
                      src={formData.image || defaultImageUrl} 
                      alt="Product preview" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <label className="cursor-pointer">
                    <Button type="button" variant="outline" className="inline-flex" asChild>
                      <div>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </div>
                    </Button>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Regular Price (₹)
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="discountPrice" className="text-sm font-medium">
                  Sale Price (₹) (Optional)
                </label>
                <Input
                  id="discountPrice"
                  name="discountPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.discountPrice || ""}
                  onChange={handleFormChange}
                  placeholder="Leave empty for no discount"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="stock" className="text-sm font-medium">
                  Stock Quantity
                </label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="space-y-2 flex items-center">
                <label htmlFor="inStock" className="text-sm font-medium mr-4">
                  In Stock
                </label>
                <Switch 
                  id="inStock"
                  checked={formData.inStock} 
                  onCheckedChange={handleInStockChange}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="tags" className="text-sm font-medium">
                  Tags
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddTag}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-eco-100 text-eco-800 px-2 py-1 text-sm rounded-full flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        className="ml-1 text-eco-600 hover:text-eco-800"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingProduct ? "Save Changes" : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
