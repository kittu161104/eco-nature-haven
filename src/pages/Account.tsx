
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Mail, Calendar } from "lucide-react";
import { format } from "date-fns";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address").optional(),
});

type FormValues = z.infer<typeof formSchema>;

const Account = () => {
  const [isLoading, setIsLoading] = useState(false);
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
        description: "Please log in to access your account.",
      });
    }
  }, [isAuthenticated, navigate, toast]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, form]);

  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Get all users
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Find and update current user
      const updatedUsers = users.map((u: any) => {
        if (u.id === user.id) {
          return { ...u, name: data.name };
        }
        return u;
      });
      
      // Update localStorage
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      
      // Update current user in localStorage
      const updatedUser = { ...user, name: data.name };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Reload page to reflect changes
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating your profile.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  // Default creation date if not available
  const creationDate = new Date().toISOString();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-eco-50">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-eco-800 mb-6">My Account</h1>
          
          <div className="grid gap-6">
            {/* Account Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  View and manage your account details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
                  <div className="bg-eco-100 h-24 w-24 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-eco-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">{user.name}</h3>
                    <div className="flex items-center text-muted-foreground mt-1">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground mt-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Member since {format(new Date(creationDate), 'MMMM dd, yyyy')}</span>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Update Profile
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            {/* Additional sections like Addresses, Preferences, etc. could be added here */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
