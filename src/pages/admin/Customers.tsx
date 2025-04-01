
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Eye, 
  Search, 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  ShoppingBag,
  DollarSign,
  Tag,
  Filter
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { formatDate, formatPhoneNumber } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  orders: number;
  totalSpent: number;
  lastOrder?: string;
  status: "active" | "inactive";
  createdAt?: string;
  lastLogin?: string;
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load customers from localStorage and registered users
  useEffect(() => {
    try {
      // Load existing customers
      const savedCustomers = localStorage.getItem("customers");
      let customersList: Customer[] = savedCustomers ? JSON.parse(savedCustomers) : [];
      
      // Load registered users to sync with customers
      const savedUsers = localStorage.getItem("users");
      if (savedUsers) {
        const users = JSON.parse(savedUsers);
        const customerUsers = users.filter((u: any) => u.role === "customer");
        
        // For each customer user, check if they're already in the customers list
        customerUsers.forEach((user: any) => {
          const existingCustomer = customersList.find(c => c.email === user.email);
          
          if (!existingCustomer) {
            // Add new customer from user data
            const newCustomer: Customer = {
              id: parseInt(user.id) || Date.now(),
              name: user.name,
              email: user.email,
              phone: user.phoneNumber,
              orders: 0,
              totalSpent: 0,
              status: "active",
              createdAt: user.createdAt,
              lastLogin: user.lastLogin
            };
            
            customersList.push(newCustomer);
          } else {
            // Update existing customer with user data
            const updatedCustomer = {
              ...existingCustomer,
              name: user.name,
              phone: user.phoneNumber || existingCustomer.phone,
              createdAt: user.createdAt || existingCustomer.createdAt,
              lastLogin: user.lastLogin || existingCustomer.lastLogin
            };
            
            customersList = customersList.map(c => 
              c.id === existingCustomer.id ? updatedCustomer : c
            );
          }
        });
        
        // Save updated customers list back to localStorage
        localStorage.setItem("customers", JSON.stringify(customersList));
      }
      
      setCustomers(customersList);
    } catch (error) {
      console.error("Error loading customers:", error);
      toast({
        variant: "destructive",
        title: "Error loading customers",
        description: "There was a problem loading customer data."
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDialogOpen(true);
  };

  const handleContact = (email: string) => {
    toast({
      title: "Contact feature",
      description: `Email functionality to ${email} will be implemented in future updates.`,
    });
  };

  const handleExport = () => {
    try {
      // Create CSV content
      const headers = ["ID", "Name", "Email", "Phone", "Orders", "Total Spent", "Status"];
      const csvContent = [
        headers.join(","),
        ...filteredCustomers.map(customer => [
          customer.id,
          customer.name,
          customer.email,
          customer.phone || "N/A",
          customer.orders,
          customer.totalSpent.toFixed(2),
          customer.status
        ].join(","))
      ].join("\n");
      
      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.setAttribute("href", url);
      link.setAttribute("download", `customers-${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      
      // Download the file and clean up
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: "Customer data has been exported to CSV"
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "There was a problem exporting customer data"
      });
    }
  };

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedCustomer) return;
    
    try {
      const updatedCustomers = customers.filter(c => c.id !== selectedCustomer.id);
      setCustomers(updatedCustomers);
      localStorage.setItem("customers", JSON.stringify(updatedCustomers));
      
      toast({
        title: "Customer deleted",
        description: `${selectedCustomer.name} has been removed from customers.`
      });
      
      setIsDeleteDialogOpen(false);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "There was a problem deleting the customer."
      });
    }
  };

  const updateCustomerStatus = (customerId: number, newStatus: "active" | "inactive") => {
    try {
      const updatedCustomers = customers.map(customer => 
        customer.id === customerId
          ? { ...customer, status: newStatus }
          : customer
      );
      
      setCustomers(updatedCustomers);
      localStorage.setItem("customers", JSON.stringify(updatedCustomers));
      
      toast({
        title: "Status updated",
        description: `Customer status has been set to ${newStatus}.`
      });
      
      // If the selected customer is being updated, update it in the state
      if (selectedCustomer && selectedCustomer.id === customerId) {
        setSelectedCustomer({ ...selectedCustomer, status: newStatus });
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was a problem updating the customer status."
      });
    }
  };

  // Apply filters
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm));
    
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Customer stats
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === "active").length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-eco-800">Customers</h1>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className={activeCustomers === totalCustomers ? "text-green-500" : ""}>
                {activeCustomers} active
              </span>
              {activeCustomers !== totalCustomers && (
                <span className="text-amber-500">
                  , {totalCustomers - activeCustomers} inactive
                </span>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.reduce((sum, c) => sum + c.orders, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all customers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Lifetime customer spend
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2 text-gray-500" />
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <ScrollArea className="h-[500px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin h-6 w-6 border-2 border-eco-600 rounded-full border-t-transparent"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone ? formatPhoneNumber(customer.phone) : "—"}</TableCell>
                    <TableCell>{customer.orders}</TableCell>
                    <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={customer.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewCustomer(customer)}
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
                    {searchTerm || statusFilter !== "all" ? "No customers match your filters" : "No customers found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Customer Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <ScrollArea className="max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-xl">
                Customer Details
              </DialogTitle>
            </DialogHeader>

            {selectedCustomer && (
              <div className="space-y-6 py-4">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-eco-100 flex items-center justify-center">
                    <span className="text-eco-600 text-2xl font-medium">
                      {selectedCustomer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedCustomer.name}</h2>
                    <p className="text-gray-500">
                      {selectedCustomer.createdAt 
                        ? `Customer since ${formatDate(selectedCustomer.createdAt)}`
                        : "Customer since N/A"
                      }
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{selectedCustomer.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{selectedCustomer.phone ? formatPhoneNumber(selectedCustomer.phone) : "Not provided"}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Order Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Orders:</span>
                        <span className="font-medium">{selectedCustomer.orders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Spent:</span>
                        <span className="font-medium">${selectedCustomer.totalSpent.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Order:</span>
                        <span className="font-medium">
                          {selectedCustomer.lastOrder ? formatDate(selectedCustomer.lastOrder) : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className={selectedCustomer.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {(selectedCustomer.createdAt || selectedCustomer.lastLogin) && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Account Activity</h3>
                    <div className="space-y-3">
                      {selectedCustomer.createdAt && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-gray-600 mr-1">Registered:</span>
                          <span>{formatDate(selectedCustomer.createdAt)}</span>
                        </div>
                      )}
                      {selectedCustomer.lastLogin && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-gray-600 mr-1">Last Login:</span>
                          <span>{formatDate(selectedCustomer.lastLogin)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          <DialogFooter className="flex justify-between sm:justify-end space-x-2">
            {selectedCustomer && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => handleDelete(selectedCustomer)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => updateCustomerStatus(
                    selectedCustomer.id, 
                    selectedCustomer.status === "active" ? "inactive" : "active"
                  )}
                >
                  Set {selectedCustomer.status === "active" ? "Inactive" : "Active"}
                </Button>
                <Button onClick={() => handleContact(selectedCustomer.email)}>
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedCustomer?.name}'s customer record.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Customers;
