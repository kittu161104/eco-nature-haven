
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
import { Leaf, Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Simple role-based routing based on email domain
      if (data.email.endsWith("@nature.com")) {
        // Admin user
        const userData = {
          email: data.email,
          role: "admin" as const,
          name: data.email.split("@")[0]
        };
        
        // Login with context (which also sets localStorage)
        login(userData);
        
        toast({
          title: "Admin Login Successful",
          description: "Welcome to the admin portal!",
        });
        navigate("/admin");
      } else if (data.email.endsWith("@gmail.com")) {
        // Customer user
        const userData = {
          email: data.email,
          role: "customer" as const,
          name: data.email.split("@")[0]
        };
        
        // Login with context (which also sets localStorage)
        login(userData);
        
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        navigate("/");
      } else {
        // Invalid domain
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email domain. Admin emails must end with @nature.com and customer emails must end with @gmail.com.",
        });
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-eco-50">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-eco-100 rounded-full flex items-center justify-center">
              <Leaf className="h-8 w-8 text-eco-600" />
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-eco-800">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto" 
                onClick={() => navigate("/register")}
              >
                create a new account
              </Button>
            </p>
          </div>
          
          <Separator className="my-6" />
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Sign in
                </Button>
              </div>
            </form>
          </Form>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Demo accounts:</p>
            <p>Admin: admin@nature.com (password: password)</p>
            <p>Customer: user@gmail.com (password: password)</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
