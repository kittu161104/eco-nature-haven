
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
    
    try {
      await login(data.email, data.password);
      // Login function already handles navigation and toast messages
    } catch (error) {
      // Error handling is done in login function
      setIsLoading(false);
    }
  };

  return (
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
        <div 
          className="w-full max-w-md space-y-8 glass border border-green-800/30 p-8 rounded-xl shadow-2xl backdrop-blur-xl transform transition-all duration-500 hover:shadow-green-700/20"
        >
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-eco-700 to-eco-900 rounded-full flex items-center justify-center transform transition-all duration-500 animate-pulse">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-300">
              Or{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto text-eco-400 hover:text-eco-300" 
                onClick={() => navigate("/register")}
              >
                create a new account
              </Button>
            </p>
          </div>
          
          <Separator className="my-6 bg-green-800/30" />
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="bg-black/40 border-green-800/50 text-white focus:border-green-500 transition-all" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-eco-700 to-eco-800 hover:from-eco-600 hover:to-eco-700 text-white transition-all duration-300 transform hover:scale-[1.02]" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Sign in
              </Button>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
