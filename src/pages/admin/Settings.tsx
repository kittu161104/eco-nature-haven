
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
      { name: "pinterest", url: "#" }
    ],
    quickLinks: [
      { name: "Shop Plants", url: "/shop" },
      { name: "Gardening Blog", url: "/blog" },
      { name: "About Us", url: "/about" },
      { name: "Sustainability", url: "/sustainability" }
    ],
    newsletterText: ""
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
      const parsedSettings = JSON.parse(storedAppearanceSettings);
      setAppearanceSettings({
        ...parsedSettings,
        primaryColor: theme.primaryColor || parsedSettings.primaryColor,
        secondaryColor: theme.secondaryColor || parsedSettings.secondaryColor,
        backgroundImage: theme.backgroundImage || parsedSettings.backgroundImage
      });
    }

    if (storedFooterSettings) {
      setFooterSettings(prev => {
        const parsed = JSON.parse(storedFooterSettings);
        // Filter out Twitter from social links if present
        const filteredSocialLinks = parsed.socialLinks ? 
          parsed.socialLinks.filter((link: {name: string}) => link.name !== "twitter") : 
          prev.socialLinks;
          
        // Ensure we don't have newsletter text
        return {
          ...parsed,
          socialLinks: filteredSocialLinks,
          newsletterText: ""
        };
      });
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
        { name: "pinterest", url: "#" }
      ],
      quickLinks: [
        { name: "Shop Plants", url: "/shop" },
        { name: "Gardening Blog", url: "/blog" },
        { name: "About Us", url: "/about" },
        { name: "Sustainability", url: "/sustainability" }
      ],
      newsletterText: ""
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
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={toggleMode}
              className="mr-2 bg-black border-green-900/50 text-white"
            >
              {theme.mode === 'dark' ? (
                <>
                  <Sun className="h-4 w-4 mr-2 text-green-400" />
                  <span className="text-green-400">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 mr-2 text-green-400" />
                  <span className="text-green-400">Dark Mode</span>
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleReset} className="bg-black border-green-900/50 text-white">
              <RefreshCw className="h-4 w-4 mr-2 text-green-400" />
              <span className="text-green-400">Reset</span>
            </Button>
            <Button onClick={handleSaveSettings} className="bg-green-700 text-white hover:bg-green-800">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/60 text-white">
            <TabsTrigger value="general" className="text-white data-[state=active]:text-green-400 data-[state=active]:bg-green-900/20">General</TabsTrigger>
            <TabsTrigger value="email" className="text-white data-[state=active]:text-green-400 data-[state=active]:bg-green-900/20">Email</TabsTrigger>
            <TabsTrigger value="appearance" className="text-white data-[state=active]:text-green-400 data-[state=active]:bg-green-900/20">Appearance</TabsTrigger>
            <TabsTrigger value="footer" className="text-white data-[state=active]:text-green-400 data-[state=active]:bg-green-900/20">Footer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="storeName" className="text-white">Store Name</Label>
                <Input
                  id="storeName"
                  name="storeName"
                  value={generalSettings.storeName}
                  onChange={handleGeneralChange}
                  className="bg-black/60 border-green-900/50 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storeEmail" className="text-white">Store Email</Label>
                <Input
                  id="storeEmail"
                  name="storeEmail"
                  type="email"
                  value={generalSettings.storeEmail}
                  onChange={handleGeneralChange}
                  className="bg-black/60 border-green-900/50 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storePhone" className="text-white">Store Phone</Label>
                <Input
                  id="storePhone"
                  name="storePhone"
                  value={generalSettings.storePhone}
                  onChange={handleGeneralChange}
                  className="bg-black/60 border-green-900/50 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-white">Currency</Label>
                <Select 
                  value={generalSettings.currency} 
                  onValueChange={(value) => setGeneralSettings({...generalSettings, currency: value})}
                >
                  <SelectTrigger id="currency" className="bg-black/60 border-green-900/50 text-white">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-green-900/50 text-white">
                    <SelectItem value="INR" className="text-white focus:text-green-400 focus:bg-green-900/20">INR (₹)</SelectItem>
                    <SelectItem value="USD" className="text-white focus:text-green-400 focus:bg-green-900/20">USD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="taxRate" className="text-white">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  name="taxRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={generalSettings.taxRate}
                  onChange={handleGeneralChange}
                  className="bg-black/60 border-green-900/50 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Service Regions</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {generalSettings.regions.map((region, index) => (
                    <div key={index} className="bg-green-900/30 text-white px-3 py-1 rounded-full text-sm border border-green-900/50">
                      {region}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="storeAddress" className="text-white">Store Address</Label>
              <Textarea
                id="storeAddress"
                name="storeAddress"
                value={generalSettings.storeAddress}
                onChange={handleGeneralChange}
                rows={3}
                className="bg-black/60 border-green-900/50 text-white"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableOrderConfirmation" className="text-white">Order Confirmation Emails</Label>
                  <p className="text-sm text-green-400">
                    Send an email when a customer places an order
                  </p>
                </div>
                <Switch
                  id="enableOrderConfirmation"
                  checked={emailSettings.enableOrderConfirmation}
                  onCheckedChange={(checked) => handleEmailToggle("enableOrderConfirmation", checked)}
                />
              </div>
              
              <Separator className="bg-green-900/30" />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableShippingNotifications" className="text-white">Shipping Notifications</Label>
                  <p className="text-sm text-green-400">
                    Send an email when an order ships
                  </p>
                </div>
                <Switch
                  id="enableShippingNotifications"
                  checked={emailSettings.enableShippingNotifications}
                  onCheckedChange={(checked) => handleEmailToggle("enableShippingNotifications", checked)}
                />
              </div>
              
              <Separator className="bg-green-900/30" />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableMarketingEmails" className="text-white">Marketing Emails</Label>
                  <p className="text-sm text-green-400">
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
              <Label htmlFor="footerText" className="text-white">Email Footer Text</Label>
              <Textarea
                id="footerText"
                name="footerText"
                value={emailSettings.footerText}
                onChange={handleEmailChange}
                rows={4}
                className="bg-black/60 border-green-900/50 text-white"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6 pt-4">
            <div className="flex items-center space-x-4 mb-6">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center bg-black/60 border-green-900/50"
                onClick={toggleMode}
              >
                {theme.mode === 'dark' ? (
                  <>
                    <Sun className="h-4 w-4 mr-2 text-green-400" />
                    <span className="text-green-400">Switch to Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 mr-2 text-green-400" />
                    <span className="text-green-400">Switch to Dark Mode</span>
                  </>
                )}
              </Button>
              <div className="text-sm text-green-400">
                Current theme: <span className="font-medium text-white">{theme.mode === 'dark' ? 'Dark' : 'Light'}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="primaryColor" className="text-white">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    name="primaryColor"
                    type="color"
                    value={appearanceSettings.primaryColor}
                    onChange={handleAppearanceChange}
                    className="w-12 h-10 p-1 bg-black/60 border-green-900/50"
                  />
                  <Input
                    value={appearanceSettings.primaryColor}
                    onChange={handleAppearanceChange}
                    name="primaryColor"
                    className="bg-black/60 border-green-900/50 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondaryColor" className="text-white">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor"
                    name="secondaryColor"
                    type="color"
                    value={appearanceSettings.secondaryColor}
                    onChange={handleAppearanceChange}
                    className="w-12 h-10 p-1 bg-black/60 border-green-900/50"
                  />
                  <Input
                    value={appearanceSettings.secondaryColor}
                    onChange={handleAppearanceChange}
                    name="secondaryColor"
                    className="bg-black/60 border-green-900/50 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fontFamily" className="text-white">Font Family</Label>
                <Select 
                  value={appearanceSettings.fontFamily}
                  onValueChange={(value) => setAppearanceSettings({...appearanceSettings, fontFamily: value})}
                >
                  <SelectTrigger id="fontFamily" className="bg-black/60 border-green-900/50 text-white">
                    <SelectValue placeholder="Select font family" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-green-900/50 text-white">
                    {fontOptions.map(font => (
                      <SelectItem key={font.value} value={font.value} className="text-white focus:text-green-400 focus:bg-green-900/20">
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logoUrl" className="text-white">Logo URL</Label>
                <Input
                  id="logoUrl"
                  name="logoUrl"
                  placeholder="https://example.com/logo.png"
                  value={appearanceSettings.logoUrl}
                  onChange={handleAppearanceChange}
                  className="bg-black/60 border-green-900/50 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backgroundImage" className="text-white">Background Image URL</Label>
                <Input
                  id="backgroundImage"
                  name="backgroundImage"
                  placeholder="https://example.com/background.jpg"
                  value={appearanceSettings.backgroundImage}
                  onChange={handleAppearanceChange}
                  className="bg-black/60 border-green-900/50 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="productsPerPage" className="text-white">Products Per Page</Label>
                <Select 
                  value={appearanceSettings.productsPerPage}
                  onValueChange={(value) => setAppearanceSettings({...appearanceSettings, productsPerPage: value})}
                >
                  <SelectTrigger id="productsPerPage" className="bg-black/60 border-green-900/50 text-white">
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-green-900/50 text-white">
                    <SelectItem value="8" className="text-white focus:text-green-400 focus:bg-green-900/20">8 products</SelectItem>
                    <SelectItem value="12" className="text-white focus:text-green-400 focus:bg-green-900/20">12 products</SelectItem>
                    <SelectItem value="16" className="text-white focus:text-green-400 focus:bg-green-900/20">16 products</SelectItem>
                    <SelectItem value="24" className="text-white focus:text-green-400 focus:bg-green-900/20">24 products</SelectItem>
                    <SelectItem value="36" className="text-white focus:text-green-400 focus:bg-green-900/20">36 products</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="p-4 border border-green-900/50 rounded-lg mt-6 bg-black/60">
              <div className="flex items-center mb-2">
                <Palette className="h-5 w-5 text-green-500 mr-2" />
                <span className="font-medium text-white">Theme Preview</span>
              </div>
              <div className="bg-black p-4 rounded border border-green-900/50">
                <div 
                  className="h-8 rounded" 
                  style={{ backgroundColor: appearanceSettings.primaryColor }}
                ></div>
                <div 
                  className="h-8 rounded mt-2" 
                  style={{ backgroundColor: appearanceSettings.secondaryColor }}
                ></div>
                <div className="h-32 mt-2 rounded bg-cover bg-center" style={{ backgroundImage: `url(${appearanceSettings.backgroundImage})` }}></div>
                <div className="mt-2 p-2 border border-green-900/50 rounded bg-black" style={{ fontFamily: appearanceSettings.fontFamily }}>
                  <p className="text-white">Sample text in {appearanceSettings.fontFamily.split(',')[0]}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="footer" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-white">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={footerSettings.companyName}
                    onChange={handleFooterChange}
                    className="bg-black/60 border-green-900/50 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Company Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={footerSettings.email}
                    onChange={handleFooterChange}
                    className="bg-black/60 border-green-900/50 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Company Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={footerSettings.phone}
                    onChange={handleFooterChange}
                    className="bg-black/60 border-green-900/50 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-white">Company Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={footerSettings.address}
                    onChange={handleFooterChange}
                    className="bg-black/60 border-green-900/50 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Company Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={footerSettings.description}
                  onChange={handleFooterChange}
                  rows={3}
                  className="bg-black/60 border-green-900/50 text-white"
                />
              </div>

              <Separator className="bg-green-900/30" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-white">Social Links</Label>
                  <Button type="button" size="sm" variant="outline" onClick={addSocialLink} className="bg-black/60 border-green-900/50 text-green-400">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Link
                  </Button>
                </div>
                
                {footerSettings.socialLinks.map((link, index) => (
                  <div key={index} className="grid grid-cols-[1fr,1fr,auto] gap-2 items-center">
                    <Input
                      placeholder="Name (facebook, instagram, etc)"
                      value={link.name}
                      onChange={(e) => handleSocialLinkChange(index, 'name', e.target.value)}
                      className="bg-black/60 border-green-900/50 text-white"
                    />
                    <Input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                      className="bg-black/60 border-green-900/50 text-white"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeSocialLink(index)}
                      className="text-red-500 hover:text-red-400 hover:bg-red-900/20"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Separator className="bg-green-900/30" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-white">Quick Links</Label>
                  <Button type="button" size="sm" variant="outline" onClick={addQuickLink} className="bg-black/60 border-green-900/50 text-green-400">
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
                      className="bg-black/60 border-green-900/50 text-white"
                    />
                    <Input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => handleQuickLinkChange(index, 'url', e.target.value)}
                      className="bg-black/60 border-green-900/50 text-white"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeQuickLink(index)}
                      className="text-red-500 hover:text-red-400 hover:bg-red-900/20"
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
