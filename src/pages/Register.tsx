
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
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
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      
      const isAdminEmail = data.email.endsWith("@nature.com");
      const isCustomerEmail = data.email.endsWith("@gmail.com");
      
      if (!isAdminEmail && !isCustomerEmail) {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: "Invalid email domain. Admin emails must end with @nature.com and customer emails must end with @gmail.com.",
        });
        return;
      }
      
      // Store user in localStorage (in a real app, this would be handled by a backend)
      localStorage.setItem("user", JSON.stringify({
        name: data.name,
        email: data.email,
        role: isAdminEmail ? "admin" : "customer",
      }));
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created!",
      });
      
      // Redirect based on role
      if (isAdminEmail) {
        navigate("/admin");
      } else {
        navigate("/");
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
              Create an account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto" 
                onClick={() => navigate("/login")}
              >
                sign in to your existing account
              </Button>
            </p>
          </div>
          
          <Separator className="my-6" />
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
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
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Admin emails must end with @nature.com<br />
                      Customer emails must end with @gmail.com
                    </p>
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
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
                  Create Account
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
