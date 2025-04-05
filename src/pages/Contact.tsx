
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { safelyParseJSON } from "@/lib/utils";

const Contact = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  
  const [pageContent, setPageContent] = useState({
    title: "Contact Us",
    content: "We're here to help! Reach out to us for any queries or assistance.",
    metaDescription: "Contact Natural Green Nursery for inquiries about plants, gardening supplies, or any other questions.",
    contactInfo: {
      email: "info@naturalgreennursery.com",
      phone: "+91 9876543210",
      address: "123 Green Avenue, Eco City, EC 12345",
      hours: "Monday - Saturday: 9AM - 6PM\nSunday: 10AM - 4PM"
    }
  });

  useEffect(() => {
    // Listen for page content updates from admin
    const handlePagesUpdated = (event: CustomEvent) => {
      if (event.detail?.updatedPages?.contact) {
        setPageContent(event.detail.updatedPages.contact);
      }
    };

    window.addEventListener('pages-updated', handlePagesUpdated as EventListener);

    // Initial load from localStorage
    try {
      const storedPagesData = localStorage.getItem("pagesData");
      if (storedPagesData) {
        const parsedData = safelyParseJSON(storedPagesData, {});
        if (parsedData && parsedData.contact) {
          setPageContent(parsedData.contact);
        }
      }
    } catch (error) {
      console.error("Error loading contact page data:", error);
    }

    return () => {
      window.removeEventListener('pages-updated', handlePagesUpdated as EventListener);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would send the form data to a backend
    console.log("Form submitted:", { name, email, subject, message });
    
    toast({
      title: "Message sent!",
      description: "Thank you for contacting us. We'll get back to you soon."
    });
    
    // Reset form
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-eco-800 py-20">
          <div className="eco-container text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-white">
              {pageContent.title}
            </h1>
            <p className="text-xl text-eco-100 max-w-2xl mx-auto">
              {pageContent.metaDescription}
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="eco-container py-16">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <Card className="bg-black border-green-900/50 h-fit">
              <CardContent className="p-8">
                <h2 className="text-2xl font-serif font-bold mb-6 text-white">Get In Touch</h2>
                
                <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                  <div className="whitespace-pre-wrap text-white" dangerouslySetInnerHTML={{ __html: pageContent.content }}></div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-eco-800/30 p-2 rounded-full">
                      <Mail className="h-5 w-5 text-eco-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1 text-eco-400">Email</h3>
                      <p className="text-white">{pageContent.contactInfo?.email || "info@naturalgreennursery.com"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-eco-800/30 p-2 rounded-full">
                      <Phone className="h-5 w-5 text-eco-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1 text-eco-400">Phone</h3>
                      <p className="text-white">{pageContent.contactInfo?.phone || "+91 9876543210"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-eco-800/30 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-eco-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1 text-eco-400">Location</h3>
                      <p className="text-white">{pageContent.contactInfo?.address || "123 Green Avenue, Eco City, EC 12345"}</p>
                    </div>
                  </div>
                </div>
                
                {pageContent.contactInfo?.hours && (
                  <div className="mt-8 border-t border-green-900/50 pt-6">
                    <h3 className="font-medium mb-2 text-eco-400">Business Hours</h3>
                    <p className="text-sm whitespace-pre-line text-white">
                      {pageContent.contactInfo.hours}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card className="bg-black border-green-900/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-serif font-bold mb-6 text-white">Send Us A Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1 text-white">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="bg-black border-green-700"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1 text-white">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="bg-black border-green-700"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1 text-white">
                      Subject
                    </label>
                    <Input 
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="What's this about?"
                      className="bg-black border-green-700"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1 text-white">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <Textarea 
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?"
                      rows={5}
                      className="bg-black border-green-700"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-green-700 hover:bg-green-800"
                  >
                    <Send className="mr-2 h-4 w-4" /> Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
