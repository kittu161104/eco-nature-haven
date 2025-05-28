
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

const AdminSocialSettings = () => {
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    instagram: "",
    whatsapp: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load existing social links from localStorage
    const savedFooterData = localStorage.getItem("footerSettings");
    if (savedFooterData) {
      try {
        const parsedData = JSON.parse(savedFooterData);
        if (parsedData.socialLinks) {
          const links = {};
          parsedData.socialLinks.forEach((link: {name: string, url: string}) => {
            links[link.name] = link.url;
          });
          setSocialLinks(prev => ({ ...prev, ...links }));
        }
      } catch (error) {
        console.error("Error parsing footer data:", error);
      }
    }
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Get existing footer data
      const existingData = localStorage.getItem("footerSettings");
      let footerData = {};
      
      if (existingData) {
        footerData = JSON.parse(existingData);
      }

      // Update social links
      const updatedFooterData = {
        ...footerData,
        socialLinks: [
          { name: "facebook", url: socialLinks.facebook },
          { name: "instagram", url: socialLinks.instagram },
          { name: "whatsapp", url: socialLinks.whatsapp }
        ]
      };

      localStorage.setItem("footerSettings", JSON.stringify(updatedFooterData));
      
      toast.success("Social media links updated successfully!");
    } catch (error) {
      console.error("Error saving social links:", error);
      toast.error("Failed to save social media links");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass border-green-800/30">
      <CardHeader>
        <CardTitle className="text-white">Social Media Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-white flex items-center">
            <Facebook className="h-4 w-4 mr-2" />
            Facebook URL
          </Label>
          <Input
            value={socialLinks.facebook}
            onChange={(e) => setSocialLinks(prev => ({ ...prev, facebook: e.target.value }))}
            placeholder="https://facebook.com/yourpage"
            className="bg-black/40 border-green-900/50 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white flex items-center">
            <Instagram className="h-4 w-4 mr-2" />
            Instagram URL
          </Label>
          <Input
            value={socialLinks.instagram}
            onChange={(e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
            placeholder="https://instagram.com/yourpage"
            className="bg-black/40 border-green-900/50 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white flex items-center">
            <MessageCircle className="h-4 w-4 mr-2" />
            WhatsApp URL
          </Label>
          <Input
            value={socialLinks.whatsapp}
            onChange={(e) => setSocialLinks(prev => ({ ...prev, whatsapp: e.target.value }))}
            placeholder="https://wa.me/1234567890"
            className="bg-black/40 border-green-900/50 text-white"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isLoading ? "Saving..." : "Save Social Media Links"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminSocialSettings;
