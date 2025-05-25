
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock, Save } from "lucide-react";

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  hours: string;
}

interface ContactPageContent {
  title: string;
  content: string;
  metaDescription: string;
  contactInfo: ContactInfo;
}

const AdminContactSettings = () => {
  const { toast } = useToast();
  const [contactData, setContactData] = useState<ContactPageContent>({
    title: "Contact Us",
    content: "We're here to help! Our team of plant experts and gardening enthusiasts is ready to answer your questions and assist you with anything you need.",
    metaDescription: "Contact Natural Green Nursery for inquiries about plants, gardening supplies, or any other questions.",
    contactInfo: {
      email: "info@naturalgreennursery.com",
      phone: "+91 9876543210",
      address: "123 Green Avenue, Eco City, EC 12345",
      hours: "Monday - Friday: 9AM - 6PM\nSaturday: 10AM - 5PM\nSunday: 10AM - 4PM"
    }
  });

  useEffect(() => {
    // Load existing contact data from localStorage
    const storedPagesData = localStorage.getItem("pagesData");
    if (storedPagesData) {
      try {
        const parsedData = JSON.parse(storedPagesData);
        if (parsedData && parsedData.contact) {
          setContactData(parsedData.contact);
        }
      } catch (error) {
        console.error("Error loading contact data:", error);
      }
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('contactInfo.')) {
      const infoField = field.split('.')[1];
      setContactData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [infoField]: value
        }
      }));
    } else {
      setContactData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = () => {
    try {
      // Save to localStorage
      const existingPagesData = JSON.parse(localStorage.getItem("pagesData") || "{}");
      const updatedPagesData = {
        ...existingPagesData,
        contact: contactData
      };
      
      localStorage.setItem("pagesData", JSON.stringify(updatedPagesData));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('pages-updated', {
        detail: { updatedPages: updatedPagesData }
      }));

      toast({
        title: "Contact page updated",
        description: "Your contact page settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving contact data",
        description: "There was an error saving your contact page settings.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Contact Page Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Page Title</Label>
            <Input
              id="title"
              value={contactData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Contact Us"
            />
          </div>
          
          <div>
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Input
              id="metaDescription"
              value={contactData.metaDescription}
              onChange={(e) => handleInputChange('metaDescription', e.target.value)}
              placeholder="Brief description for search engines"
            />
          </div>
          
          <div>
            <Label htmlFor="content">Main Content</Label>
            <Textarea
              id="content"
              value={contactData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Main contact page content"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Phone className="h-5 w-5 mr-2" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={contactData.contactInfo.email}
              onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
              placeholder="info@company.com"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={contactData.contactInfo.phone}
              onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
              placeholder="+91 9876543210"
            />
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={contactData.contactInfo.address}
              onChange={(e) => handleInputChange('contactInfo.address', e.target.value)}
              placeholder="Business address"
              rows={2}
            />
          </div>
          
          <div>
            <Label htmlFor="hours">Business Hours</Label>
            <Textarea
              id="hours"
              value={contactData.contactInfo.hours}
              onChange={(e) => handleInputChange('contactInfo.hours', e.target.value)}
              placeholder="Monday - Friday: 9AM - 6PM"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
      
      <Button onClick={handleSave} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Save Contact Settings
      </Button>
    </div>
  );
};

export default AdminContactSettings;
