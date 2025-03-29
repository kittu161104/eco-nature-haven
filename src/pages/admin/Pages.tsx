
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Save } from "lucide-react";

const Pages = () => {
  const [aboutContent, setAboutContent] = useState("");
  const [contactContent, setContactContent] = useState("");
  const { toast } = useToast();

  // Load stored content on component mount
  useEffect(() => {
    const savedAboutContent = localStorage.getItem("page_about");
    const savedContactContent = localStorage.getItem("page_contact");

    if (savedAboutContent) {
      setAboutContent(savedAboutContent);
    }

    if (savedContactContent) {
      setContactContent(savedContactContent);
    }
  }, []);

  const handleSaveAbout = () => {
    localStorage.setItem("page_about", aboutContent);
    toast({
      title: "About page updated",
      description: "The About page content has been saved successfully.",
    });
  };

  const handleSaveContact = () => {
    localStorage.setItem("page_contact", contactContent);
    toast({
      title: "Contact page updated",
      description: "The Contact page content has been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-eco-800">Static Pages</h1>
      </div>

      <p className="text-gray-600">
        Edit the content of your website's static pages here. Changes will be immediately visible on the customer-facing website.
      </p>

      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="about">About Page</TabsTrigger>
          <TabsTrigger value="contact">Contact Page</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-4 pt-4">
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-eco-800">Edit About Page Content</h2>
            <p className="text-gray-600">
              This content will appear on the About page of your website. Use clear, concise language to tell your story and share your mission with customers.
            </p>

            <div className="space-y-2">
              <label htmlFor="aboutContent" className="text-sm font-medium">
                Page Content
              </label>
              <Textarea
                id="aboutContent"
                value={aboutContent}
                onChange={(e) => setAboutContent(e.target.value)}
                placeholder="Enter your About page content here..."
                rows={15}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveAbout}>
                <Save className="h-4 w-4 mr-2" />
                Save About Page
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4 pt-4">
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-eco-800">Edit Contact Page Content</h2>
            <p className="text-gray-600">
              This content will appear on the Contact page of your website. Include important information like business hours, location, and additional contact methods.
            </p>

            <div className="space-y-2">
              <label htmlFor="contactContent" className="text-sm font-medium">
                Page Content
              </label>
              <Textarea
                id="contactContent"
                value={contactContent}
                onChange={(e) => setContactContent(e.target.value)}
                placeholder="Enter your Contact page content here..."
                rows={15}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveContact}>
                <Save className="h-4 w-4 mr-2" />
                Save Contact Page
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Pages;
