
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, Plus, Trash, Info, Phone, MapPin, Clock, User, FileText, AlertTriangle } from "lucide-react";

const Pages = () => {
  const { toast } = useToast();
  
  // About Page States
  const [aboutCompanyInfo, setAboutCompanyInfo] = useState({
    companyName: "Natural Green Nursery",
    foundedYear: "2015",
    founderName: "Emily Johnson",
    mission: "To inspire and enable sustainable living through plants. We believe that every plant we sell has the potential to make homes healthier, gardens more vibrant, and our planet a little greener.",
    vision: "We envision a world where sustainable gardening is accessible to everyone, contributing to a greener and healthier planet for future generations."
  });
  
  const [serviceRegions, setServiceRegions] = useState({
    primaryRegions: "Andhra Pradesh & Telangana",
    cities: "Hyderabad, Visakhapatnam, Vijayawada, Warangal, Guntur",
    deliveryInfo: "Free delivery for orders above ₹500 within city limits. Nominal charges apply for other areas."
  });
  
  // Contact Page States
  const [contactInfo, setContactInfo] = useState({
    phoneNumber: "+91 9876543210",
    emailAddress: "info@naturalgreennursery.com",
    businessHours: "Monday - Saturday: 9AM to 7PM\nSunday: 10AM to 5PM",
    address: "123 Green Avenue, Jubilee Hills\nHyderabad, Telangana 500033",
    mapLink: "https://maps.google.com/?q=17.4326,78.3855",
    socialMedia: {
      instagram: "naturalgreen_nursery",
      facebook: "NaturalGreenNursery",
      whatsapp: "+919876543210"
    }
  });

  const [supportInfo, setSupportInfo] = useState({
    customerSupportEmail: "support@naturalgreennursery.com",
    customerSupportPhone: "+91 8765432109",
    supportHours: "Monday - Friday: 9AM to 6PM",
    faqLink: "/faq"
  });

  // Load stored content on component mount
  useEffect(() => {
    const storedAboutCompanyInfo = localStorage.getItem("about_company_info");
    const storedServiceRegions = localStorage.getItem("about_service_regions");
    const storedContactInfo = localStorage.getItem("contact_info");
    const storedSupportInfo = localStorage.getItem("contact_support_info");
    
    if (storedAboutCompanyInfo) {
      setAboutCompanyInfo(JSON.parse(storedAboutCompanyInfo));
    }
    
    if (storedServiceRegions) {
      setServiceRegions(JSON.parse(storedServiceRegions));
    }
    
    if (storedContactInfo) {
      setContactInfo(JSON.parse(storedContactInfo));
    }
    
    if (storedSupportInfo) {
      setSupportInfo(JSON.parse(storedSupportInfo));
    }
  }, []);

  const handleAboutCompanyChange = (field: keyof typeof aboutCompanyInfo, value: string) => {
    setAboutCompanyInfo({
      ...aboutCompanyInfo,
      [field]: value
    });
  };

  const handleServiceRegionsChange = (field: keyof typeof serviceRegions, value: string) => {
    setServiceRegions({
      ...serviceRegions,
      [field]: value
    });
  };

  const handleContactInfoChange = (field: string, value: string) => {
    // Handle nested objects like socialMedia
    if (field.includes('.')) {
      const [parentField, childField] = field.split('.');
      setContactInfo({
        ...contactInfo,
        [parentField]: {
          ...contactInfo[parentField as keyof typeof contactInfo],
          [childField]: value
        }
      });
    } else {
      setContactInfo({
        ...contactInfo,
        [field]: value
      });
    }
  };

  const handleSupportInfoChange = (field: keyof typeof supportInfo, value: string) => {
    setSupportInfo({
      ...supportInfo,
      [field]: value
    });
  };

  const handleSaveAboutCompany = () => {
    localStorage.setItem("about_company_info", JSON.stringify(aboutCompanyInfo));
    toast({
      title: "Company information updated",
      description: "About page company information has been saved successfully."
    });
  };

  const handleSaveServiceRegions = () => {
    localStorage.setItem("about_service_regions", JSON.stringify(serviceRegions));
    toast({
      title: "Service regions updated",
      description: "Service region information has been saved successfully."
    });
  };

  const handleSaveContactInfo = () => {
    localStorage.setItem("contact_info", JSON.stringify(contactInfo));
    toast({
      title: "Contact information updated",
      description: "Contact page information has been saved successfully."
    });
  };

  const handleSaveSupportInfo = () => {
    localStorage.setItem("contact_support_info", JSON.stringify(supportInfo));
    toast({
      title: "Support information updated",
      description: "Support information has been saved successfully."
    });
  };

  return (
    <ScrollArea className="h-[calc(100vh-120px)]">
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-eco-400">Manage Pages</h1>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-white">Page Content Manager</h3>
              <p className="text-gray-400 text-sm">
                Changes made here will be immediately reflected on your website. Fill in the information below to customize your About and Contact pages.
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 text-gray-400">
            <TabsTrigger value="about" className="data-[state=active]:bg-gray-700 data-[state=active]:text-eco-400">
              About Page
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-gray-700 data-[state=active]:text-eco-400">
              Contact Page
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6 pt-6">
            <Card className="bg-gray-900 border-gray-800 text-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-eco-400">
                  <Info className="h-5 w-5" />
                  Company Information
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Basic information about your company that will appear on the About page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={aboutCompanyInfo.companyName}
                      onChange={(e) => handleAboutCompanyChange('companyName', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="foundedYear">Founded Year</Label>
                      <Input
                        id="foundedYear"
                        value={aboutCompanyInfo.foundedYear}
                        onChange={(e) => handleAboutCompanyChange('foundedYear', e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="founderName">Founder Name</Label>
                      <Input
                        id="founderName"
                        value={aboutCompanyInfo.founderName}
                        onChange={(e) => handleAboutCompanyChange('founderName', e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mission">Our Mission</Label>
                  <Textarea
                    id="mission"
                    value={aboutCompanyInfo.mission}
                    onChange={(e) => handleAboutCompanyChange('mission', e.target.value)}
                    rows={3}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vision">Our Vision</Label>
                  <Textarea
                    id="vision"
                    value={aboutCompanyInfo.vision}
                    onChange={(e) => handleAboutCompanyChange('vision', e.target.value)}
                    rows={3}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button onClick={handleSaveAboutCompany} className="bg-eco-600 hover:bg-eco-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Company Information
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-gray-900 border-gray-800 text-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-eco-400">
                  <MapPin className="h-5 w-5" />
                  Service Regions
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Information about regions you serve
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryRegions">Primary Regions</Label>
                  <Input
                    id="primaryRegions"
                    value={serviceRegions.primaryRegions}
                    onChange={(e) => handleServiceRegionsChange('primaryRegions', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="e.g., Andhra Pradesh & Telangana"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cities">Major Cities Served</Label>
                  <Input
                    id="cities"
                    value={serviceRegions.cities}
                    onChange={(e) => handleServiceRegionsChange('cities', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="e.g., Hyderabad, Visakhapatnam, Vijayawada"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deliveryInfo">Delivery Information</Label>
                  <Textarea
                    id="deliveryInfo"
                    value={serviceRegions.deliveryInfo}
                    onChange={(e) => handleServiceRegionsChange('deliveryInfo', e.target.value)}
                    rows={2}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button onClick={handleSaveServiceRegions} className="bg-eco-600 hover:bg-eco-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Service Regions
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6 pt-6">
            <Card className="bg-gray-900 border-gray-800 text-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-eco-400">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription className="text-gray-400">
                  How customers can reach your business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={contactInfo.phoneNumber}
                      onChange={(e) => handleContactInfoChange('phoneNumber', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailAddress">Email Address</Label>
                    <Input
                      id="emailAddress"
                      value={contactInfo.emailAddress}
                      onChange={(e) => handleContactInfoChange('emailAddress', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessHours">Business Hours</Label>
                  <Textarea
                    id="businessHours"
                    value={contactInfo.businessHours}
                    onChange={(e) => handleContactInfoChange('businessHours', e.target.value)}
                    rows={2}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={contactInfo.address}
                    onChange={(e) => handleContactInfoChange('address', e.target.value)}
                    rows={2}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mapLink">Google Maps Link</Label>
                  <Input
                    id="mapLink"
                    value={contactInfo.mapLink}
                    onChange={(e) => handleContactInfoChange('mapLink', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="https://maps.google.com/?q=latitude,longitude"
                  />
                </div>
                
                <div className="space-y-3 pt-3">
                  <Label>Social Media</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="text-sm">Instagram Handle</Label>
                      <Input
                        id="instagram"
                        value={contactInfo.socialMedia.instagram}
                        onChange={(e) => handleContactInfoChange('socialMedia.instagram', e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facebook" className="text-sm">Facebook Handle</Label>
                      <Input
                        id="facebook"
                        value={contactInfo.socialMedia.facebook}
                        onChange={(e) => handleContactInfoChange('socialMedia.facebook', e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="pagename"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp" className="text-sm">WhatsApp Number</Label>
                      <Input
                        id="whatsapp"
                        value={contactInfo.socialMedia.whatsapp}
                        onChange={(e) => handleContactInfoChange('socialMedia.whatsapp', e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="+91xxxxxxxxxx"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button onClick={handleSaveContactInfo} className="bg-eco-600 hover:bg-eco-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Contact Information
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-gray-900 border-gray-800 text-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-eco-400">
                  <User className="h-5 w-5" />
                  Customer Support
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Information for customer inquiries and support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerSupportEmail">Support Email</Label>
                    <Input
                      id="customerSupportEmail"
                      value={supportInfo.customerSupportEmail}
                      onChange={(e) => handleSupportInfoChange('customerSupportEmail', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerSupportPhone">Support Phone</Label>
                    <Input
                      id="customerSupportPhone"
                      value={supportInfo.customerSupportPhone}
                      onChange={(e) => handleSupportInfoChange('customerSupportPhone', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="supportHours">Support Hours</Label>
                  <Input
                    id="supportHours"
                    value={supportInfo.supportHours}
                    onChange={(e) => handleSupportInfoChange('supportHours', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="faqLink">FAQ Page Link</Label>
                  <Input
                    id="faqLink"
                    value={supportInfo.faqLink}
                    onChange={(e) => handleSupportInfoChange('faqLink', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="/faq"
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button onClick={handleSaveSupportInfo} className="bg-eco-600 hover:bg-eco-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Support Information
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default Pages;
