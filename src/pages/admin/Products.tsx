
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Pencil, Plus, Trash } from "lucide-react";

// Sample product data
const initialProducts = [
  {
    id: 1,
    name: "Monstera Deliciosa",
    category: "Indoor Plants",
    price: 29.99,
    stock: 25,
  },
  {
    id: 2,
    name: "Snake Plant",
    category: "Indoor Plants",
    price: 19.99,
    stock: 40,
  },
  {
    id: 3,
    name: "Fiddle Leaf Fig",
    category: "Indoor Plants",
    price: 49.99,
    stock: 15,
  },
  {
    id: 4,
    name: "Organic Potting Soil",
    category: "Gardening Supplies",
    price: 12.99,
    stock: 100,
  },
  {
    id: 5,
    name: "Ceramic Plant Pot",
    category: "Accessories",
    price: 24.99,
    stock: 30,
  },
];

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    category: "Indoor Plants",
    price: 0,
    stock: 0,
  });
  const { toast } = useToast();

  const handleAddProduct = () => {
    setFormData({
      name: "",
      category: "Indoor Plants",
      price: 0,
      stock: 0,
    });
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
    });
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
    toast({
      title: "Product deleted",
      description: "The product has been deleted successfully.",
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      // Update existing product
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id
            ? { ...product, ...formData }
            : product
        )
      );
      toast({
        title: "Product updated",
        description: "The product has been updated successfully.",
      });
    } else {
      // Add new product
      const newProduct = {
        id: Math.max(...products.map((p) => p.id), 0) + 1,
        ...formData,
      };
      setProducts([...products, newProduct]);
      toast({
        title: "Product added",
        description: "The new product has been added successfully.",
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" || name === "stock" ? parseFloat(value) : value,
    });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    });
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
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
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
            <div className="space-y-2">
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
                  <SelectItem value="Gardening Supplies">Gardening Supplies</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Price ($)
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
                <label htmlFor="stock" className="text-sm font-medium">
                  Stock
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
