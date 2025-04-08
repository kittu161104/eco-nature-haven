
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Check, MapPin, Phone, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatDate, isValidPhoneNumber, formatPhoneNumber } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

const countryOptions = [
  { value: "in", label: "India" },
  { value: "us", label: "United States" },
  { value: "gb", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
];

const stateOptions = {
  in: [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ],
  us: [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", 
    "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", 
    "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", 
    "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", 
    "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ],
  gb: ["England", "Scotland", "Wales", "Northern Ireland"],
  ca: [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", 
    "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan"
  ],
  au: [
    "Australian Capital Territory", "New South Wales", "Northern Territory", "Queensland", 
    "South Australia", "Tasmania", "Victoria", "Western Australia"
  ],
};

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser, logout } = useAuth();
  const { clearCart } = useCart();
  const { clearWishlist } = useWishlist();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "in",
    marketing: false,
    notifications: false,
  });
  
  const isAdminUser = user?.isAdmin || false;
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        zipCode: user.address?.zipCode || "",
        country: user.address?.country || "in",
        marketing: user.preferences?.marketing || false,
        notifications: user.preferences?.notifications || false,
      });
    }
  }, [isAuthenticated, user, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };
  
  const handleCountryChange = (value: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      country: value,
      state: "" // Reset state when country changes
    }));
  };
  
  const handleStateChange = (value: string) => {
    setFormData((prev) => ({ ...prev, state: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number if provided
    if (formData.phone && !isValidPhoneNumber(formData.phone)) {
      toast.error("Please enter a valid phone number (10 digits)");
      return;
    }
    
    if (!user) return;
    
    // Update user data
    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      },
      preferences: {
        marketing: formData.marketing,
        notifications: formData.notifications,
        theme: user.preferences?.theme || 'dark',
      },
    };
    
    updateUser(updatedUser);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };
  
  const handleLogout = () => {
    logout();
    clearCart();
    clearWishlist();
    navigate("/login");
    toast.info("You have been logged out");
  };
  
  const handleAdminPanel = () => {
    navigate("/admin/dashboard");
  };
  
  if (!user) return null;
  
  const userJoinedDate = user.createdAt 
    ? formatDate(user.createdAt) 
    : "Unknown date";
  
  return (
    <div className="container max-w-5xl py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">My Account</h1>
            <p className="text-gray-400">Manage your account settings and preferences</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            {isAdminUser && (
              <Button onClick={handleAdminPanel} className="bg-green-600 hover:bg-green-700 text-white">
                Admin Panel
              </Button>
            )}
            
            <Button onClick={handleLogout} variant="outline" className="border-green-600 text-green-400 hover:bg-green-900/20">
              Log Out
            </Button>
          </div>
        </div>
        
        <Card className="bg-black/60 border-green-900">
          <CardHeader className="border-b border-green-900/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-green-900/30 rounded-full p-3">
                  <User className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-white">{user.name}</CardTitle>
                  <CardDescription className="text-gray-400">Member since {userJoinedDate}</CardDescription>
                </div>
              </div>
              {!isEditing && (
                <Button 
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="border-green-600 text-green-400 hover:bg-green-900/20"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="w-full bg-black/90 border-b border-green-900/30 rounded-none">
                <TabsTrigger 
                  value="profile"
                  className="data-[state=active]:bg-green-900/20 data-[state=active]:text-white text-gray-400 rounded-none flex-grow"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="address"
                  className="data-[state=active]:bg-green-900/20 data-[state=active]:text-white text-gray-400 rounded-none flex-grow"
                >
                  Address
                </TabsTrigger>
                <TabsTrigger 
                  value="preferences"
                  className="data-[state=active]:bg-green-900/20 data-[state=active]:text-white text-gray-400 rounded-none flex-grow"
                >
                  Preferences
                </TabsTrigger>
              </TabsList>
              
              <form onSubmit={handleSubmit}>
                <TabsContent value="profile" className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-black/40 border-green-900/50 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-black/40 border-green-900/50 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="Your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-black/40 border-green-900/50 text-white"
                      />
                      {formData.phone && !isValidPhoneNumber(formData.phone) && isEditing && (
                        <p className="text-sm text-red-400 flex items-center mt-1">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Please enter a valid 10-digit phone number
                        </p>
                      )}
                      {formData.phone && isValidPhoneNumber(formData.phone) && (
                        <p className="text-sm text-green-400 flex items-center mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {formatPhoneNumber(formData.phone)}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Account Type</Label>
                      <div className="h-10 px-3 py-2 rounded-md border border-green-900/50 bg-black/40 flex items-center text-white">
                        {isAdminUser ? 'Administrator' : 'Customer'}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="address" className="p-6 space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="street" className="text-white">Street Address</Label>
                      <Textarea
                        id="street"
                        name="street"
                        placeholder="Your street address"
                        value={formData.street}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-black/40 border-green-900/50 text-white"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-white">City</Label>
                        <Input
                          id="city"
                          name="city"
                          placeholder="Your city"
                          value={formData.city}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="bg-black/40 border-green-900/50 text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-white">Country</Label>
                        <Select 
                          disabled={!isEditing}
                          value={formData.country}
                          onValueChange={handleCountryChange}
                        >
                          <SelectTrigger className="bg-black/40 border-green-900/50 text-white">
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-green-900 text-white">
                            {countryOptions.map(country => (
                              <SelectItem key={country.value} value={country.value}>
                                {country.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-white">State / Province</Label>
                        <Select 
                          disabled={!isEditing || !formData.country}
                          value={formData.state}
                          onValueChange={handleStateChange}
                        >
                          <SelectTrigger className="bg-black/40 border-green-900/50 text-white">
                            <SelectValue placeholder="Select a state" />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-green-900 text-white max-h-[200px]">
                            {formData.country && stateOptions[formData.country as keyof typeof stateOptions]?.map(state => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="zipCode" className="text-white">ZIP / Postal Code</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          placeholder="Your postal code"
                          value={formData.zipCode}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="bg-black/40 border-green-900/50 text-white"
                        />
                      </div>
                    </div>
                    
                    {formData.street && formData.city && formData.state && (
                      <div className="bg-green-900/10 border border-green-900/30 rounded-md p-4 flex items-start space-x-3">
                        <MapPin className="text-green-400 h-5 w-5 mt-1 flex-shrink-0" />
                        <div className="text-white">
                          <p className="font-medium">{formData.name}</p>
                          <p>{formData.street}</p>
                          <p>
                            {formData.city}, {formData.state} {formData.zipCode}
                          </p>
                          <p>
                            {countryOptions.find(c => c.value === formData.country)?.label || formData.country}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="preferences" className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-white">Marketing Communications</Label>
                        <p className="text-sm text-gray-400">
                          Receive emails about new products, offers and announcements
                        </p>
                      </div>
                      <Switch
                        checked={formData.marketing}
                        onCheckedChange={(checked) => handleSwitchChange("marketing", checked)}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <Separator className="my-4 bg-green-900/30" />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-white">Order Notifications</Label>
                        <p className="text-sm text-gray-400">
                          Receive updates about your orders and deliveries
                        </p>
                      </div>
                      <Switch
                        checked={formData.notifications}
                        onCheckedChange={(checked) => handleSwitchChange("notifications", checked)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                {isEditing && (
                  <CardFooter className="border-t border-green-900/30 bg-black/40 px-6 py-4 flex justify-end space-x-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsEditing(false);
                        if (user) {
                          setFormData({
                            name: user.name || "",
                            email: user.email || "",
                            phone: user.phone || "",
                            street: user.address?.street || "",
                            city: user.address?.city || "",
                            state: user.address?.state || "",
                            zipCode: user.address?.zipCode || "",
                            country: user.address?.country || "in",
                            marketing: user.preferences?.marketing || false,
                            notifications: user.preferences?.notifications || false,
                          });
                        }
                      }}
                      className="border-green-900 text-white hover:bg-green-900/20"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                      <Check className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardFooter>
                )}
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
