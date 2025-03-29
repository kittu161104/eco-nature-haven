
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Save, Leaf, RefreshCw } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const [generalSettings, setGeneralSettings] = useState({
    storeName: "Natural Green Nursery",
    storeEmail: "info@naturalgreen.com",
    storePhone: "+91 9876543210",
    storeAddress: "123 Garden Street, Green City, India",
    currency: "INR",
    taxRate: "18",
  });
  
  const [emailSettings, setEmailSettings] = useState({
    enableOrderConfirmation: true,
    enableShippingNotifications: true,
    enableMarketingEmails: false,
    footerText: "Thank you for shopping with Natural Green Nursery. We're committed to sustainable gardening and eco-friendly practices.",
  });
  
  const [appearanceSettings, setAppearanceSettings] = useState({
    primaryColor: "#4CAF50",
    secondaryColor: "#8BC34A",
    logoUrl: "",
    enableDarkMode: false,
    productsPerPage: "12",
    backgroundImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
  });

  // Load settings on mount
  useEffect(() => {
    const storedGeneralSettings = localStorage.getItem("generalSettings");
    const storedEmailSettings = localStorage.getItem("emailSettings");
    const storedAppearanceSettings = localStorage.getItem("appearanceSettings");
    
    if (storedGeneralSettings) {
      setGeneralSettings(JSON.parse(storedGeneralSettings));
    }
    
    if (storedEmailSettings) {
      setEmailSettings(JSON.parse(storedEmailSettings));
    }
    
    if (storedAppearanceSettings) {
      setAppearanceSettings(JSON.parse(storedAppearanceSettings));
    }
  }, []);

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: value,
    });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailSettings({
      ...emailSettings,
      [name]: value,
    });
  };

  const handleEmailToggle = (name: string, checked: boolean) => {
    setEmailSettings({
      ...emailSettings,
      [name]: checked,
    });
  };

  const handleAppearanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAppearanceSettings({
      ...appearanceSettings,
      [name]: value,
    });
  };

  const handleAppearanceToggle = (name: string, checked: boolean) => {
    setAppearanceSettings({
      ...appearanceSettings,
      [name]: checked,
    });
  };

  const handleSaveSettings = () => {
    // Save settings to localStorage
    localStorage.setItem("generalSettings", JSON.stringify(generalSettings));
    localStorage.setItem("emailSettings", JSON.stringify(emailSettings));
    localStorage.setItem("appearanceSettings", JSON.stringify(appearanceSettings));
    
    // Apply background image directly
    document.documentElement.style.setProperty('--nursery-background', `url(${appearanceSettings.backgroundImage})`);
    
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  const handleReset = () => {
    // Reset to default settings
    setGeneralSettings({
      storeName: "Natural Green Nursery",
      storeEmail: "info@naturalgreen.com",
      storePhone: "+91 9876543210",
      storeAddress: "123 Garden Street, Green City, India",
      currency: "INR",
      taxRate: "18",
    });
    
    setEmailSettings({
      enableOrderConfirmation: true,
      enableShippingNotifications: true,
      enableMarketingEmails: false,
      footerText: "Thank you for shopping with Natural Green Nursery. We're committed to sustainable gardening and eco-friendly practices.",
    });
    
    setAppearanceSettings({
      primaryColor: "#4CAF50",
      secondaryColor: "#8BC34A",
      logoUrl: "",
      enableDarkMode: false,
      productsPerPage: "12",
      backgroundImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    });
    
    toast({
      title: "Settings reset",
      description: "Your settings have been reset to default values.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-eco-800">Settings</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSaveSettings}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                name="storeName"
                value={generalSettings.storeName}
                onChange={handleGeneralChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="storeEmail">Store Email</Label>
              <Input
                id="storeEmail"
                name="storeEmail"
                type="email"
                value={generalSettings.storeEmail}
                onChange={handleGeneralChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="storePhone">Store Phone</Label>
              <Input
                id="storePhone"
                name="storePhone"
                value={generalSettings.storePhone}
                onChange={handleGeneralChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select 
                value={generalSettings.currency} 
                onValueChange={(value) => setGeneralSettings({...generalSettings, currency: value})}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                name="taxRate"
                type="number"
                min="0"
                step="0.01"
                value={generalSettings.taxRate}
                onChange={handleGeneralChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="storeAddress">Store Address</Label>
            <Textarea
              id="storeAddress"
              name="storeAddress"
              value={generalSettings.storeAddress}
              onChange={handleGeneralChange}
              rows={3}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="email" className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableOrderConfirmation">Order Confirmation Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Send an email when a customer places an order
                </p>
              </div>
              <Switch
                id="enableOrderConfirmation"
                checked={emailSettings.enableOrderConfirmation}
                onCheckedChange={(checked) => handleEmailToggle("enableOrderConfirmation", checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableShippingNotifications">Shipping Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send an email when an order ships
                </p>
              </div>
              <Switch
                id="enableShippingNotifications"
                checked={emailSettings.enableShippingNotifications}
                onCheckedChange={(checked) => handleEmailToggle("enableShippingNotifications", checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableMarketingEmails">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Send promotional emails and newsletters
                </p>
              </div>
              <Switch
                id="enableMarketingEmails"
                checked={emailSettings.enableMarketingEmails}
                onCheckedChange={(checked) => handleEmailToggle("enableMarketingEmails", checked)}
              />
            </div>
          </div>
          
          <div className="space-y-2 pt-4">
            <Label htmlFor="footerText">Email Footer Text</Label>
            <Textarea
              id="footerText"
              name="footerText"
              value={emailSettings.footerText}
              onChange={handleEmailChange}
              rows={4}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  name="primaryColor"
                  type="color"
                  value={appearanceSettings.primaryColor}
                  onChange={handleAppearanceChange}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={appearanceSettings.primaryColor}
                  onChange={handleAppearanceChange}
                  name="primaryColor"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="secondaryColor"
                  name="secondaryColor"
                  type="color"
                  value={appearanceSettings.secondaryColor}
                  onChange={handleAppearanceChange}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={appearanceSettings.secondaryColor}
                  onChange={handleAppearanceChange}
                  name="secondaryColor"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                name="logoUrl"
                placeholder="https://example.com/logo.png"
                value={appearanceSettings.logoUrl}
                onChange={handleAppearanceChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="backgroundImage">Background Image URL</Label>
              <Input
                id="backgroundImage"
                name="backgroundImage"
                placeholder="https://example.com/background.jpg"
                value={appearanceSettings.backgroundImage}
                onChange={handleAppearanceChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="productsPerPage">Products Per Page</Label>
              <Select 
                value={appearanceSettings.productsPerPage}
                onValueChange={(value) => setAppearanceSettings({...appearanceSettings, productsPerPage: value})}
              >
                <SelectTrigger id="productsPerPage">
                  <SelectValue placeholder="Select number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8 products</SelectItem>
                  <SelectItem value="12">12 products</SelectItem>
                  <SelectItem value="16">16 products</SelectItem>
                  <SelectItem value="24">24 products</SelectItem>
                  <SelectItem value="36">36 products</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-4">
            <Switch
              id="enableDarkMode"
              checked={appearanceSettings.enableDarkMode}
              onCheckedChange={(checked) => handleAppearanceToggle("enableDarkMode", checked)}
            />
            <Label htmlFor="enableDarkMode">Enable Dark Mode</Label>
          </div>
          
          <div className="p-4 border rounded-lg mt-6">
            <div className="flex items-center mb-2">
              <Leaf className="h-5 w-5 text-eco-600 mr-2" />
              <span className="font-medium">Theme Preview</span>
            </div>
            <div className="bg-gray-100 p-4 rounded border">
              <div 
                className="h-8 rounded" 
                style={{ backgroundColor: appearanceSettings.primaryColor }}
              ></div>
              <div 
                className="h-8 rounded mt-2" 
                style={{ backgroundColor: appearanceSettings.secondaryColor }}
              ></div>
              <div className="h-32 mt-2 rounded bg-cover bg-center" style={{ backgroundImage: `url(${appearanceSettings.backgroundImage})` }}></div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
