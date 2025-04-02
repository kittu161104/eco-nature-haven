
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import CTASection from "@/components/CTASection";
import { Phone, Mail, Clock, MapPin, Send, Instagram, Facebook, MessageSquare } from "lucide-react";

interface ContactInfo {
  phoneNumber: string;
  emailAddress: string;
  businessHours: string;
  address: string;
  mapLink: string;
  socialMedia: {
    instagram: string;
    facebook: string;
    whatsapp: string;
  };
}

interface SupportInfo {
  customerSupportEmail: string;
  customerSupportPhone: string;
  supportHours: string;
  faqLink: string;
}

const Contact = () => {
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [supportInfo, setSupportInfo] = useState<SupportInfo | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Form handling
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    
    // Show success message
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  // Load contact info from localStorage
  useEffect(() => {
    const savedContactInfo = localStorage.getItem('contact_info');
    const savedSupportInfo = localStorage.getItem('contact_support_info');
    
    if (savedContactInfo) {
      setContactInfo(JSON.parse(savedContactInfo));
    } else {
      // Default values if not set in admin
      setContactInfo({
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
    }
    
    if (savedSupportInfo) {
      setSupportInfo(JSON.parse(savedSupportInfo));
    } else {
      // Default values if not set in admin
      setSupportInfo({
        customerSupportEmail: "support@naturalgreennursery.com",
        customerSupportPhone: "+91 8765432109",
        supportHours: "Monday - Friday: 9AM to 6PM",
        faqLink: "/faq"
      });
    }
    
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Contact Hero */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
          <div className="eco-container">
            <div className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                Get In <span className="shimmer-text">Touch</span>
              </h1>
              <p className="text-xl text-eco-100">
                Have questions or need assistance? We're here to help you with all your plant needs.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <section className="py-16">
          <div className="eco-container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-stagger">
              <div className="bg-gray-800/70 backdrop-blur-md p-6 rounded-lg shadow-md border border-gray-700 text-center">
                <div className="bg-eco-900/50 text-eco-400 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-eco-400 mb-2">Call Us</h3>
                <p className="text-gray-300 mb-2">Main Office:</p>
                <p className="text-white text-lg font-medium mb-3">{contactInfo?.phoneNumber}</p>
                <p className="text-gray-300 mb-2">Customer Support:</p>
                <p className="text-white text-lg font-medium">{supportInfo?.customerSupportPhone}</p>
              </div>

              <div className="bg-gray-800/70 backdrop-blur-md p-6 rounded-lg shadow-md border border-gray-700 text-center">
                <div className="bg-eco-900/50 text-eco-400 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-eco-400 mb-2">Email Us</h3>
                <p className="text-gray-300 mb-2">General Inquiries:</p>
                <p className="text-white text-lg font-medium mb-3">{contactInfo?.emailAddress}</p>
                <p className="text-gray-300 mb-2">Customer Support:</p>
                <p className="text-white text-lg font-medium">{supportInfo?.customerSupportEmail}</p>
              </div>

              <div className="bg-gray-800/70 backdrop-blur-md p-6 rounded-lg shadow-md border border-gray-700 text-center">
                <div className="bg-eco-900/50 text-eco-400 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-eco-400 mb-2">Working Hours</h3>
                <p className="text-gray-300 mb-2">Nursery Hours:</p>
                <div className="text-white mb-3">
                  {contactInfo?.businessHours.split("\n").map((line, index) => (
                    <p key={index} className="my-1">{line}</p>
                  ))}
                </div>
                <p className="text-gray-300 mb-2">Support Hours:</p>
                <p className="text-white">{supportInfo?.supportHours}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form and Location */}
        <section className="py-16 bg-gray-900/50">
          <div className="eco-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className={`transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <h2 className="text-2xl font-serif font-bold mb-6 text-eco-400">Send Us a Message</h2>
                <div className="bg-gray-800/70 backdrop-blur-md p-6 rounded-lg shadow-md border border-gray-700">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Your Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-white">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-white">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Product Inquiry"
                          required
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-white">Your Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        rows={5}
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-eco-600 hover:bg-eco-700">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </div>
                
                {/* Social Media Links */}
                <div className="mt-8">
                  <h3 className="text-xl font-serif font-bold mb-4 text-eco-400">Connect With Us</h3>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href={`https://instagram.com/${contactInfo?.socialMedia.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800/70 backdrop-blur-md px-4 py-3 rounded-lg shadow-md border border-gray-700 flex items-center gap-2 hover:bg-gray-700/70 transition-colors"
                    >
                      <Instagram className="h-5 w-5 text-eco-400" />
                      <span className="text-white">@{contactInfo?.socialMedia.instagram}</span>
                    </a>
                    <a
                      href={`https://facebook.com/${contactInfo?.socialMedia.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800/70 backdrop-blur-md px-4 py-3 rounded-lg shadow-md border border-gray-700 flex items-center gap-2 hover:bg-gray-700/70 transition-colors"
                    >
                      <Facebook className="h-5 w-5 text-eco-400" />
                      <span className="text-white">{contactInfo?.socialMedia.facebook}</span>
                    </a>
                    <a
                      href={`https://wa.me/${contactInfo?.socialMedia.whatsapp.replace(/\+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800/70 backdrop-blur-md px-4 py-3 rounded-lg shadow-md border border-gray-700 flex items-center gap-2 hover:bg-gray-700/70 transition-colors"
                    >
                      <MessageSquare className="h-5 w-5 text-eco-400" />
                      <span className="text-white">WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className={`space-y-6 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <h2 className="text-2xl font-serif font-bold mb-6 text-eco-400">Visit Our Nursery</h2>
                
                <div className="bg-gray-800/70 backdrop-blur-md p-6 rounded-lg shadow-md border border-gray-700 mb-6">
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin className="h-5 w-5 text-eco-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-white mb-1">Address</h3>
                      <div className="text-gray-300">
                        {contactInfo?.address.split("\n").map((line, index) => (
                          <p key={index} className="my-1">{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <a 
                    href={contactInfo?.mapLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full mt-4"
                  >
                    <Button className="w-full bg-eco-600 hover:bg-eco-700">
                      <MapPin className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                  </a>
                </div>
                
                <div className="rounded-lg overflow-hidden shadow-lg h-[300px] md:h-[400px]">
                  <iframe
                    title="Store Location"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(contactInfo?.address || "")}`}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
