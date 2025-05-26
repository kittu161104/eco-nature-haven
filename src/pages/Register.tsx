
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
import OTPInput from "@/components/OTPInput";
import { Separator } from "@/components/ui/separator";
import { Leaf, Loader2, Shield, Mail } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const detailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  isAdmin: z.boolean().default(false),
  adminCode: z.string().optional(),
});

const otpSchema = z.object({
  otp: z.string().min(4, "Please enter the 4-digit OTP"),
});

type DetailsFormValues = z.infer<typeof detailsSchema>;
type OTPFormValues = z.infer<typeof otpSchema>;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { sendOTP, verifyOTP } = useAuth();

  const detailsForm = useForm<DetailsFormValues>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      name: "",
      email: "",
      isAdmin: false,
      adminCode: "",
    },
  });

  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const isAdmin = detailsForm.watch("isAdmin");

  const onDetailsSubmit = async (data: DetailsFormValues) => {
    setIsLoading(true);
    
    try {
      await sendOTP(data.email, data.name, true, data.adminCode);
      setUserEmail(data.email);
      setUserName(data.name);
      setAdminCode(data.adminCode || '');
      setStep('otp');
      
      toast({
        title: "OTP Sent",
        description: "Please check your email for the 4-digit verification code.",
      });
    } catch (error) {
      toast({
        title: "Failed to send OTP",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onOTPSubmit = async (data: OTPFormValues) => {
    setIsLoading(true);
    
    try {
      const result = await verifyOTP(userEmail, data.otp, userName, true, adminCode);
      
      toast({
        title: "Account created successfully",
        description: "Welcome to Natural Green!",
      });
      
      if (result.isAdmin || adminCode === "Natural@green") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Invalid OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToDetails = () => {
    setStep('details');
    otpForm.reset();
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
              {step === 'details' ? <Leaf className="h-8 w-8 text-white" /> : <Mail className="h-8 w-8 text-white" />}
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
              {step === 'details' ? 'Create your account' : 'Enter verification code'}
            </h2>
            <p className="mt-2 text-sm text-gray-300">
              {step === 'details' ? (
                <>
                  Or{" "}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-eco-400 hover:text-eco-300" 
                    onClick={() => navigate("/login")}
                  >
                    sign in to your existing account
                  </Button>
                </>
              ) : (
                `We've sent a 4-digit code to ${userEmail}`
              )}
            </p>
          </div>
          
          <Separator className="my-6 bg-green-800/30" />
          
          {step === 'details' ? (
            <Form {...detailsForm}>
              <form onSubmit={detailsForm.handleSubmit(onDetailsSubmit)} className="space-y-6">
                <FormField
                  control={detailsForm.control}
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
                  control={detailsForm.control}
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
                  control={detailsForm.control}
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
                    control={detailsForm.control}
                    name="adminCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Admin Code</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter admin access code (Natural@green)" 
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
                  Send OTP
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-6">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-center block">Enter 4-digit code</FormLabel>
                      <FormControl>
                        <OTPInput
                          length={4}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-center" />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-eco-700 to-eco-800 hover:from-eco-600 hover:to-eco-700 text-white transition-all duration-300 transform hover:scale-[1.02]" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Verify & Create Account
                  </Button>
                  
                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full border-green-800/50 text-green-400 hover:bg-green-900/30"
                    onClick={handleBackToDetails}
                  >
                    Back to Details
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
