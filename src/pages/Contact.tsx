
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, Clock, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { safelyParseJSON } from "@/lib/utils";

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

const Contact = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  
  const [pageContent, setPageContent] = useState<ContactPageContent>({
    title: "Contact Us",
    content: "We're here to help! Our team of plant experts and gardening enthusiasts is ready to answer your questions and assist you with anything you need. Whether you're looking for plant care advice, have questions about an order, or want to learn more about our sustainable practices, we're just a message away. Feel free to reach out through any of the channels below, and we'll get back to you as soon as possible.",
    metaDescription: "Contact Natural Green Nursery for inquiries about plants, gardening supplies, or any other questions.",
    contactInfo: {
      email: "info@naturalgreennursery.com",
      phone: "+91 9876543210",
      address: "123 Green Avenue, Eco City, EC 12345",
      hours: "Monday - Friday: 9AM - 6PM\nSaturday: 10AM - 5PM\nSunday: 10AM - 4PM"
    }
  });

  useEffect(() => {
    // Listen for page content updates from admin
    const handlePagesUpdated = (event: CustomEvent) => {
      if (event.detail?.updatedPages?.contact) {
        setPageContent(event.detail.updatedPages.contact as ContactPageContent);
      }
    };

    window.addEventListener('pages-updated', handlePagesUpdated as EventListener);

    // Initial load from localStorage
    try {
      const storedPagesData = localStorage.getItem("pagesData");
      if (storedPagesData) {
        const parsedData = safelyParseJSON(storedPagesData, {});
        if (parsedData && typeof parsedData === 'object' && 'contact' in parsedData) {
          setPageContent(parsedData.contact as ContactPageContent);
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
            <Card className="bg-black border-green-900/50 h-fit transform transition-all duration-500 hover:shadow-lg hover:shadow-green-800/30">
              <CardContent className="p-8">
                <h2 className="text-2xl font-serif font-bold mb-6 text-white">Get In Touch</h2>
                
                <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                  <div className="whitespace-pre-wrap text-white" dangerouslySetInnerHTML={{ __html: pageContent.content }}></div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 transform transition-all duration-300 hover:translate-x-1">
                    <div className="bg-eco-800/30 p-3 rounded-full">
                      <Mail className="h-5 w-5 text-eco-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1 text-eco-400">Email</h3>
                      <p className="text-white">{pageContent.contactInfo?.email || "info@naturalgreennursery.com"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 transform transition-all duration-300 hover:translate-x-1">
                    <div className="bg-eco-800/30 p-3 rounded-full">
                      <Phone className="h-5 w-5 text-eco-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1 text-eco-400">Phone</h3>
                      <p className="text-white">{pageContent.contactInfo?.phone || "+91 9876543210"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 transform transition-all duration-300 hover:translate-x-1">
                    <div className="bg-eco-800/30 p-3 rounded-full">
                      <MapPin className="h-5 w-5 text-eco-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1 text-eco-400">Location</h3>
                      <p className="text-white">{pageContent.contactInfo?.address || "123 Green Avenue, Eco City, EC 12345"}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 transform transition-all duration-300 hover:translate-x-1">
                    <div className="bg-eco-800/30 p-3 rounded-full">
                      <Clock className="h-5 w-5 text-eco-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1 text-eco-400">Business Hours</h3>
                      <p className="text-sm whitespace-pre-line text-white">
                        {pageContent.contactInfo?.hours || "Monday - Friday: 9AM - 6PM\nSaturday - Sunday: 10AM - 4PM"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 transform transition-all duration-300 hover:translate-x-1">
                    <div className="bg-eco-800/30 p-3 rounded-full">
                      <Globe className="h-5 w-5 text-eco-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1 text-eco-400">Follow Us</h3>
                      <div className="flex space-x-3 mt-2">
                        <a href="#" className="bg-eco-800/50 p-2 rounded-full hover:bg-eco-700/50 transition-colors">
                          <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                          </svg>
                        </a>
                        <a href="#" className="bg-eco-800/50 p-2 rounded-full hover:bg-eco-700/50 transition-colors">
                          <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                          </svg>
                        </a>
                        <a href="#" className="bg-eco-800/50 p-2 rounded-full hover:bg-eco-700/50 transition-colors">
                          <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card className="bg-black border-green-900/50 transform transition-all duration-500 hover:shadow-lg hover:shadow-green-800/30">
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
                      className="bg-black border-green-700 focus:border-green-500 transition-all"
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
                      className="bg-black border-green-700 focus:border-green-500 transition-all"
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
                      className="bg-black border-green-700 focus:border-green-500 transition-all"
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
                      className="bg-black border-green-700 focus:border-green-500 transition-all"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-green-700 hover:bg-green-800 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <Send className="mr-2 h-4 w-4" /> Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-eco-900/30 py-16">
          <div className="eco-container">
            <h2 className="text-3xl font-serif font-bold mb-8 text-center text-white">Find Us</h2>
            <div className="h-96 w-full rounded-lg overflow-hidden border-4 border-eco-800 shadow-lg shadow-eco-800/20">
              <div className="bg-eco-900/50 h-full w-full flex items-center justify-center">
                <p className="text-eco-400">Interactive map will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
