
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Leaf, Recycle, DropletIcon, TreePine, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Sustainability = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [pageContent, setPageContent] = useState({
    title: "Our Sustainability Commitment",
    subtitle: "Creating a Greener Tomorrow",
    mainContent: "At Natural Green Nursery, sustainability isn't just a buzzword—it's at the core of everything we do. From our cultivation practices to our packaging, we're committed to minimizing our environmental footprint while helping you create a thriving green space.",
    practices: [
      {
        title: "Eco-friendly Products",
        description: "All our plant varieties are carefully selected to be suitable for local environments, reducing the need for excessive watering, fertilizers, or pesticides."
      },
      {
        title: "Responsible Sourcing",
        description: "We work directly with local growers who share our commitment to sustainable growing practices and fair labor conditions."
      },
      {
        title: "Plastic Reduction",
        description: "Our packaging is made from recycled materials, and we're working toward eliminating plastic completely by 2025."
      },
      {
        title: "Community Initiatives",
        description: "For every order placed, we donate to local reforestation projects and urban greening initiatives."
      }
    ],
    contactHeading: "Join Our Eco-Friendly Initiatives"
  });

  useEffect(() => {
    // Check if custom content exists in local storage
    const storedPagesData = localStorage.getItem("pagesData");
    if (storedPagesData) {
      try {
        const parsedData = JSON.parse(storedPagesData);
        if (parsedData.sustainability) {
          // Parse the content which may be stored as a JSON string
          try {
            const sustainabilityData = typeof parsedData.sustainability.content === 'string' ? 
              JSON.parse(parsedData.sustainability.content) : 
              parsedData.sustainability.content;
              
            if (sustainabilityData) {
              setPageContent(sustainabilityData);
            }
          } catch (e) {
            console.log("Using default content for sustainability page");
          }
        }
      } catch (error) {
        console.error("Error parsing sustainability data:", error);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast({
        title: "Please complete all fields",
        description: "All fields are required to submit the form.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you would send this data to your backend
    console.log("Form submission:", { name, email, message });
    
    toast({
      title: "Message sent!",
      description: "Thank you for your interest in our sustainability initiatives.",
    });
    
    // Reset form
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-eco-800 text-white py-20">
          <div className="eco-container text-center">
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-eco-600/30 text-eco-100 mb-4">
              <Leaf className="h-5 w-5 mr-2 animate-leaf-sway" />
              <span>Eco-Friendly Practices</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{pageContent.title}</h1>
            <p className="text-xl text-eco-100 max-w-2xl mx-auto">{pageContent.subtitle}</p>
          </div>
        </div>
        
        {/* Main content */}
        <div className="eco-container py-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-lg">{pageContent.mainContent}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {pageContent.practices.map((practice, index) => (
              <div key={index} className="bg-black p-6 rounded-lg border border-green-800 hover:border-green-600 transition-all">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-eco-800/30 text-eco-500 mb-4">
                  {index === 0 && <Leaf className="h-6 w-6" />}
                  {index === 1 && <TreePine className="h-6 w-6" />}
                  {index === 2 && <Recycle className="h-6 w-6" />}
                  {index === 3 && <Sun className="h-6 w-6" />}
                </div>
                <h3 className="text-xl font-bold mb-2">{practice.title}</h3>
                <p>{practice.description}</p>
              </div>
            ))}
          </div>
          
          {/* Contact Form */}
          <div className="mt-20 bg-black p-8 rounded-lg border border-green-800">
            <h2 className="text-2xl font-bold mb-6 text-center">{pageContent.contactHeading}</h2>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
              <div className="grid gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-black border-green-700"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black border-green-700"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Your Message or Initiative Idea</label>
                  <Textarea
                    id="message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-black border-green-700"
                    placeholder="Share your eco-friendly initiative ideas or questions..."
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="bg-eco-600 hover:bg-eco-700 text-white"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Sustainability;
