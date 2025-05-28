
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
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
import { Leaf, Loader2, Shield, Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
  isAdmin: z.boolean().default(false),
  adminCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register } = useAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      isAdmin: false,
      adminCode: "",
    },
  });

  const isAdmin = form.watch("isAdmin");

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    
    try {
      const result = await register(data.email, data.password, data.name, data.isAdmin, data.adminCode);
      
      toast({
        title: "Account created successfully",
        description: "Welcome to Natural Green!",
      });
      
      // Navigate based on admin status
      if (result.isAdmin) {
        console.log("Navigating to admin portal");
        navigate("/admin");
      } else {
        console.log("Navigating to customer portal");
        navigate("/");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please check your details and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main 
          className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-eco-950/80 to-black/90"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1742&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay"
          }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md space-y-8 glass border border-green-800/30 p-8 rounded-xl shadow-2xl backdrop-blur-xl transform transition-all duration-500 hover:shadow-green-700/20"
          >
            <div className="text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto h-16 w-16 bg-gradient-to-br from-eco-700 to-eco-900 rounded-full flex items-center justify-center transform transition-all duration-500 animate-pulse"
              >
                <Leaf className="h-8 w-8 text-white" />
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-6 text-3xl font-bold tracking-tight text-white"
              >
                Create your account
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-2 text-sm text-gray-300"
              >
                Or{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-eco-400 hover:text-eco-300" 
                  onClick={() => navigate("/login")}
                >
                  sign in to your existing account
                </Button>
              </motion.p>
            </div>
            
            <Separator className="my-6 bg-green-800/30" />
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
                          className="bg-black/40 border-green-800/50 text-white focus:border-green-500 transition-all" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="your.email@example.com" 
                          className="bg-black/40 border-green-800/50 text-white focus:border-green-500 transition-all" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password" 
                            className="bg-black/40 border-green-800/50 text-white focus:border-green-500 transition-all pr-10" 
                            {...field} 
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-green-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-green-400" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password" 
                            className="bg-black/40 border-green-800/50 text-white focus:border-green-500 transition-all pr-10" 
                            {...field} 
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-green-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-green-400" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isAdmin"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-green-800/50 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-white flex items-center">
                          <Shield className="h-4 w-4 mr-2" />
                          Register as Admin
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {isAdmin && (
                  <FormField
                    control={form.control}
                    name="adminCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Admin Code</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter admin access code" 
                            className="bg-black/40 border-green-800/50 text-white focus:border-green-500 transition-all" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-eco-700 to-eco-800 hover:from-eco-600 hover:to-eco-700 text-white transition-all duration-300 transform hover:scale-[1.02]" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Create Account
                </Button>
              </form>
            </Form>
          </motion.div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Register;
