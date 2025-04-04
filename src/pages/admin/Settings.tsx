
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, Leaf, RefreshCw, Plus, Trash, Moon, Sun, Palette } from "lucide-react";
import useTheme from "@/hooks/useTheme";

const Settings = () => {
  const { toast } = useToast();
  const { theme, updateTheme, toggleMode } = useTheme();
  const [generalSettings, setGeneralSettings] = useState({
    storeName: "Natural Green Nursery",
    storeEmail: "info@naturalgreennursery.com",
    storePhone: "+91 9876543210",
    storeAddress: "123 Garden Street, Green City, India",
    currency: "INR",
    taxRate: "18",
    regions: ["Andhra Pradesh", "Telangana"]
  });
  
  const [emailSettings, setEmailSettings] = useState({
    enableOrderConfirmation: true,
    enableShippingNotifications: true,
    enableMarketingEmails: false,
    footerText: "Thank you for shopping with Natural Green Nursery. We're committed to sustainable gardening and eco-friendly practices.",
  });
  
  const [appearanceSettings, setAppearanceSettings] = useState({
    primaryColor: theme.primaryColor || "#4CAF50",
    secondaryColor: theme.secondaryColor || "#8BC34A",
    logoUrl: "",
    productsPerPage: "12",
    backgroundImage: theme.backgroundImage || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae",
    fontFamily: theme.fontFamily || "Inter, sans-serif"
  });

  const [footerSettings, setFooterSettings] = useState({
    companyName: "Natural Green Nursery",
    address: "123 Green Avenue, Eco City, EC 12345",
    phone: "+91 9876543210",
    email: "info@naturalgreennursery.com",
    description: "Your one-stop destination for all eco-friendly plants, gardening tools, and expert advice for a greener home and planet.",
    socialLinks: [
      { name: "facebook", url: "#" },
      { name: "instagram", url: "#" },
      { name: "twitter", url: "#" },
      { name: "pinterest", url: "#" }
    ],
    quickLinks: [
      { name: "Shop Plants", url: "/shop" },
      { name: "Gardening Blog", url: "/blog" },
      { name: "About Us", url: "/about" },
      { name: "Sustainability", url: "/sustainability" },
      { name: "FAQ", url: "/faq" }
    ],
    newsletterText: "Subscribe to our newsletter for gardening tips, new arrivals, and exclusive offers."
  });

  // Font family options
  const fontOptions = [
    { value: "Inter, sans-serif", label: "Inter (Default)" },
    { value: "Roboto, sans-serif", label: "Roboto" },
    { value: "Merriweather, serif", label: "Merriweather" },
    { value: "Poppins, sans-serif", label: "Poppins" },
    { value: "Open Sans, sans-serif", label: "Open Sans" }
  ];

  useEffect(() => {
    // Load stored settings
    const storedGeneralSettings = localStorage.getItem("generalSettings");
    const storedEmailSettings = localStorage.getItem("emailSettings");
    const storedAppearanceSettings = localStorage.getItem("appearanceSettings");
    const storedFooterSettings = localStorage.getItem("footerSettings");
    
    if (storedGeneralSettings) {
      setGeneralSettings(JSON.parse(storedGeneralSettings));
    }
    
    if (storedEmailSettings) {
      setEmailSettings(JSON.parse(storedEmailSettings));
    }
    
    if (storedAppearanceSettings) {
      setAppearanceSettings({
        ...JSON.parse(storedAppearanceSettings),
        primaryColor: theme.primaryColor,
        secondaryColor: theme.secondaryColor,
        backgroundImage: theme.backgroundImage
      });
    }

    if (storedFooterSettings) {
      setFooterSettings(JSON.parse(storedFooterSettings));
    }
  }, [theme]);

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

  const handleFooterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFooterSettings({
      ...footerSettings,
      [name]: value,
    });
  };

  const handleSocialLinkChange = (index: number, field: 'name' | 'url', value: string) => {
    const updatedLinks = [...footerSettings.socialLinks];
    updatedLinks[index] = {
      ...updatedLinks[index],
      [field]: value
    };
    setFooterSettings({
      ...footerSettings,
      socialLinks: updatedLinks
    });
  };

  const handleQuickLinkChange = (index: number, field: 'name' | 'url', value: string) => {
    const updatedLinks = [...footerSettings.quickLinks];
    updatedLinks[index] = {
      ...updatedLinks[index],
      [field]: value
    };
    setFooterSettings({
      ...footerSettings,
      quickLinks: updatedLinks
    });
  };

  const addSocialLink = () => {
    setFooterSettings({
      ...footerSettings,
      socialLinks: [...footerSettings.socialLinks, { name: "", url: "#" }]
    });
  };

  const removeSocialLink = (index: number) => {
    setFooterSettings({
      ...footerSettings,
      socialLinks: footerSettings.socialLinks.filter((_, i) => i !== index)
    });
  };

  const addQuickLink = () => {
    setFooterSettings({
      ...footerSettings,
      quickLinks: [...footerSettings.quickLinks, { name: "", url: "/" }]
    });
  };

  const removeQuickLink = (index: number) => {
    setFooterSettings({
      ...footerSettings,
      quickLinks: footerSettings.quickLinks.filter((_, i) => i !== index)
    });
  };

  const handleSaveSettings = () => {
    // Save all settings to localStorage
    localStorage.setItem("generalSettings", JSON.stringify(generalSettings));
    localStorage.setItem("emailSettings", JSON.stringify(emailSettings));
    localStorage.setItem("appearanceSettings", JSON.stringify(appearanceSettings));
    localStorage.setItem("footerSettings", JSON.stringify(footerSettings));
    
    // Apply theme changes
    updateTheme({
      primaryColor: appearanceSettings.primaryColor,
      secondaryColor: appearanceSettings.secondaryColor,
      backgroundImage: appearanceSettings.backgroundImage,
      fontFamily: appearanceSettings.fontFamily
    });
    
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  const handleReset = () => {
    // Reset all settings to defaults
    setGeneralSettings({
      storeName: "Natural Green Nursery",
      storeEmail: "info@naturalgreennursery.com",
      storePhone: "+91 9876543210",
      storeAddress: "123 Garden Street, Green City, India",
      currency: "INR",
      taxRate: "18",
      regions: ["Andhra Pradesh", "Telangana"]
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
      productsPerPage: "12",
      backgroundImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae",
      fontFamily: "Inter, sans-serif"
    });

    setFooterSettings({
      companyName: "Natural Green Nursery",
      address: "123 Green Avenue, Eco City, EC 12345",
      phone: "+91 9876543210",
      email: "info@naturalgreennursery.com",
      description: "Your one-stop destination for all eco-friendly plants, gardening tools, and expert advice for a greener home and planet.",
      socialLinks: [
        { name: "facebook", url: "#" },
        { name: "instagram", url: "#" },
        { name: "twitter", url: "#" },
        { name: "pinterest", url: "#" }
      ],
      quickLinks: [
        { name: "Shop Plants", url: "/shop" },
        { name: "Gardening Blog", url: "/blog" },
        { name: "About Us", url: "/about" },
        { name: "Sustainability", url: "/sustainability" },
        { name: "FAQ", url: "/faq" }
      ],
      newsletterText: "Subscribe to our newsletter for gardening tips, new arrivals, and exclusive offers."
    });
    
    // Reset theme to default
    updateTheme({
      primaryColor: "#4CAF50",
      secondaryColor: "#8BC34A",
      backgroundImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae",
      fontFamily: "Inter, sans-serif"
    });
    
    toast({
      title: "Settings reset",
      description: "Your settings have been reset to default values.",
    });
  };

  return (
    <ScrollArea className="h-[calc(100vh-120px)]">
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-eco-800">Settings</h1>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={toggleMode}
              className="mr-2"
            >
              {theme.mode === 'dark' ? (
                <>
                  <Sun className="h-4 w-4 mr-2" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 mr-2" />
                  Dark Mode
                </>
              )}
            </Button>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
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

              <div className="space-y-2">
                <Label>Service Regions</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {generalSettings.regions.map((region, index) => (
                    <div key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                      {region}
                    </div>
                  ))}
                </div>
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
            <div className="flex items-center space-x-4 mb-6">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center"
                onClick={toggleMode}
              >
                {theme.mode === 'dark' ? (
                  <>
                    <Sun className="h-4 w-4 mr-2" />
                    Switch to Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 mr-2" />
                    Switch to Dark Mode
                  </>
                )}
              </Button>
              <div className="text-sm text-muted-foreground">
                Current theme: <span className="font-medium">{theme.mode === 'dark' ? 'Dark' : 'Light'}</span>
              </div>
            </div>
            
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
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select 
                  value={appearanceSettings.fontFamily}
                  onValueChange={(value) => setAppearanceSettings({...appearanceSettings, fontFamily: value})}
                >
                  <SelectTrigger id="fontFamily">
                    <SelectValue placeholder="Select font family" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map(font => (
                      <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            
            <div className="p-4 border rounded-lg mt-6">
              <div className="flex items-center mb-2">
                <Palette className="h-5 w-5 text-eco-600 mr-2" />
                <span className="font-medium">Theme Preview</span>
              </div>
              <div className={`${theme.mode === 'light' ? 'bg-gray-100' : 'bg-gray-800'} p-4 rounded border`}>
                <div 
                  className="h-8 rounded" 
                  style={{ backgroundColor: appearanceSettings.primaryColor }}
                ></div>
                <div 
                  className="h-8 rounded mt-2" 
                  style={{ backgroundColor: appearanceSettings.secondaryColor }}
                ></div>
                <div className="h-32 mt-2 rounded bg-cover bg-center" style={{ backgroundImage: `url(${appearanceSettings.backgroundImage})` }}></div>
                <div className="mt-2 p-2 border rounded" style={{ fontFamily: appearanceSettings.fontFamily }}>
                  <p>Sample text in {appearanceSettings.fontFamily.split(',')[0]}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="footer" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={footerSettings.companyName}
                    onChange={handleFooterChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Company Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={footerSettings.email}
                    onChange={handleFooterChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Company Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={footerSettings.phone}
                    onChange={handleFooterChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Company Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={footerSettings.address}
                    onChange={handleFooterChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={footerSettings.description}
                  onChange={handleFooterChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newsletterText">Newsletter Text</Label>
                <Textarea
                  id="newsletterText"
                  name="newsletterText"
                  value={footerSettings.newsletterText}
                  onChange={handleFooterChange}
                  rows={2}
                />
              </div>

              <Separator className="my-6" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Social Links</Label>
                  <Button type="button" size="sm" variant="outline" onClick={addSocialLink}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Link
                  </Button>
                </div>
                
                {footerSettings.socialLinks.map((link, index) => (
                  <div key={index} className="grid grid-cols-[1fr,1fr,auto] gap-2 items-center">
                    <Input
                      placeholder="Name (facebook, twitter, etc)"
                      value={link.name}
                      onChange={(e) => handleSocialLinkChange(index, 'name', e.target.value)}
                    />
                    <Input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeSocialLink(index)}
                      className="text-red-500"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Quick Links</Label>
                  <Button type="button" size="sm" variant="outline" onClick={addQuickLink}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Link
                  </Button>
                </div>
                
                {footerSettings.quickLinks.map((link, index) => (
                  <div key={index} className="grid grid-cols-[1fr,1fr,auto] gap-2 items-center">
                    <Input
                      placeholder="Link Text"
                      value={link.name}
                      onChange={(e) => handleQuickLinkChange(index, 'name', e.target.value)}
                    />
                    <Input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => handleQuickLinkChange(index, 'url', e.target.value)}
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeQuickLink(index)}
                      className="text-red-500"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default Settings;
