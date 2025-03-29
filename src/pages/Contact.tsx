import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Home, Clock } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedContent = localStorage.getItem('page_contact');
    if (savedContent) {
      setContent(savedContent);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "We've received your message and will get back to you soon.",
      });
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  if (content) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <div className="bg-eco-100 py-12">
            <div className="eco-container">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-eco-800 mb-4">
                  Contact Us
                </h1>
              </div>
            </div>
          </div>
          
          <div className="eco-container py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-sm h-full">
                  <div className="prose prose-green">
                    <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }} />
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="font-medium text-gray-900 mb-3">Follow Us</h3>
                    <div className="flex space-x-4">
                      <a 
                        href="#" 
                        className="bg-eco-100 hover:bg-eco-200 text-eco-800 p-2 rounded-full transition-colors"
                        aria-label="Facebook"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                      </a>
                      <a 
                        href="#" 
                        className="bg-eco-100 hover:bg-eco-200 text-eco-800 p-2 rounded-full transition-colors"
                        aria-label="Instagram"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </a>
                      <a 
                        href="#" 
                        className="bg-eco-100 hover:bg-eco-200 text-eco-800 p-2 rounded-full transition-colors"
                        aria-label="Twitter"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                        </svg>
                      </a>
                      <a 
                        href="#" 
                        className="bg-eco-100 hover:bg-eco-200 text-eco-800 p-2 rounded-full transition-colors"
                        aria-label="Pinterest"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <path d="M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0z"></path>
                          <path d="M12 2v2"></path>
                          <path d="M12 20v2"></path>
                          <path d="M20 12h2"></path>
                          <path d="M2 12h2"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-serif font-bold text-eco-800 mb-6">
                    Send Us a Message
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Your email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="Your phone number"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="Message subject"
                          value={formData.subject}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Your message"
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto bg-eco-600 hover:bg-eco-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-eco-100 py-12">
          <div className="eco-container">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-eco-800 mb-4">
                Contact Us
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Have questions about plants, orders, or want to arrange a visit? We're here to help!
              </p>
            </div>
          </div>
        </div>
        
        <div className="eco-container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm h-full">
                <h2 className="text-2xl font-serif font-bold text-eco-800 mb-6">
                  Get In Touch
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-eco-600 mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Email</h3>
                      <p className="text-gray-600">info@naturalgreen.com</p>
                      <p className="text-gray-600">support@naturalgreen.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-eco-600 mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Phone</h3>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                      <p className="text-gray-600">Mon-Fri: 9am - 5pm EST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Home className="h-5 w-5 text-eco-600 mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Visit Our Nursery</h3>
                      <p className="text-gray-600">123 Green Avenue</p>
                      <p className="text-gray-600">Eco City, EC 12345</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-eco-600 mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Business Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 9am - 6pm</p>
                      <p className="text-gray-600">Saturday: 8am - 5pm</p>
                      <p className="text-gray-600">Sunday: 10am - 4pm</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-medium text-gray-900 mb-3">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a 
                      href="#" 
                      className="bg-eco-100 hover:bg-eco-200 text-eco-800 p-2 rounded-full transition-colors"
                      aria-label="Facebook"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                    <a 
                      href="#" 
                      className="bg-eco-100 hover:bg-eco-200 text-eco-800 p-2 rounded-full transition-colors"
                      aria-label="Instagram"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </a>
                    <a 
                      href="#" 
                      className="bg-eco-100 hover:bg-eco-200 text-eco-800 p-2 rounded-full transition-colors"
                      aria-label="Twitter"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                      </svg>
                    </a>
                    <a 
                      href="#" 
                      className="bg-eco-100 hover:bg-eco-200 text-eco-800 p-2 rounded-full transition-colors"
                      aria-label="Pinterest"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0z"></path>
                        <path d="M12 2v2"></path>
                        <path d="M12 20v2"></path>
                        <path d="M20 12h2"></path>
                        <path d="M2 12h2"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-serif font-bold text-eco-800 mb-6">
                  Send Us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="Your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Message subject"
                        value={formData.subject}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Your message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto bg-eco-600 hover:bg-eco-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-eco-800 mb-6">
                Find Us
              </h2>
              
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-eco-50">
                  <p className="text-gray-600">Interactive map will be displayed here</p>
                </div>
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
