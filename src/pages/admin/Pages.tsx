
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, FileEdit, Eye } from "lucide-react";

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  hours: string;
}

interface PageContent {
  title: string;
  content: string;
  metaDescription: string;
  lastUpdated: string;
  contactInfo?: ContactInfo;
}

interface PagesData {
  [key: string]: PageContent;
}

const defaultAboutContent = `<h2 class="text-2xl font-semibold mb-4 text-eco-400">Our Story</h2>
<p class="mb-6">Natural Green Nursery was founded in 2010 with a mission to bring sustainable and eco-friendly gardening solutions to everyone. What started as a small family business has grown into a thriving community of plant enthusiasts and environmental advocates.</p>

<h2 class="text-2xl font-semibold mb-4 text-eco-400">Our Mission</h2>
<p class="mb-6">We believe in promoting sustainable gardening practices that not only beautify spaces but also contribute positively to the environment. Every plant we grow and product we sell is carefully selected to align with our eco-conscious values.</p>

<h2 class="text-2xl font-semibold mb-4 text-eco-400">Our Team</h2>
<p class="mb-6">Our team consists of passionate horticulturists, environmental scientists, and gardening enthusiasts who are dedicated to providing you with the healthiest plants and most sustainable gardening supplies.</p>

<h2 class="text-2xl font-semibold mb-4 text-eco-400">Sustainability Commitment</h2>
<p class="mb-6">At Natural Green Nursery, sustainability isn't just a buzzword—it's at the core of everything we do. From our biodegradable plant pots to our organic fertilizers, we're committed to reducing our environmental footprint and helping you do the same.</p>

<h2 class="text-2xl font-semibold mb-4 text-eco-400">Community Engagement</h2>
<p>We regularly organize workshops, plant adoption drives, and community gardening events. Join us in our mission to make the world greener, one plant at a time.</p>`;

const defaultContactContent = "We're here to help! Our team of plant experts and gardening enthusiasts is ready to answer your questions and assist you with anything you need. Whether you're looking for plant care advice, have questions about an order, or want to learn more about our sustainable practices, we're just a message away. Feel free to reach out through any of the channels below, and we'll get back to you as soon as possible.";

const Pages = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("about");
  const [pagesData, setPagesData] = useState<PagesData>({
    about: {
      title: "About Natural Green Nursery",
      content: defaultAboutContent,
      metaDescription: "Learn about Natural Green Nursery, our mission, vision, and commitment to sustainable gardening practices.",
      lastUpdated: new Date().toISOString(),
    },
    contact: {
      title: "Contact Us",
      content: defaultContactContent,
      metaDescription: "Contact Natural Green Nursery for inquiries about plants, gardening supplies, or any other questions.",
      lastUpdated: new Date().toISOString(),
      contactInfo: {
        email: "info@naturalgreennursery.com",
        phone: "+91 9876543210",
        address: "123 Green Avenue, Eco City, EC 12345",
        hours: "Monday - Friday: 9AM - 6PM\nSaturday: 10AM - 5PM\nSunday: 10AM - 4PM"
      }
    }
  });
  
  const [editMode, setEditMode] = useState(true);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "info@naturalgreennursery.com",
    phone: "+91 9876543210",
    address: "123 Green Avenue, Eco City, EC 12345",
    hours: "Monday - Friday: 9AM - 6PM\nSaturday: 10AM - 5PM\nSunday: 10AM - 4PM"
  });
  
  useEffect(() => {
    const storedPages = localStorage.getItem("pagesData");
    if (storedPages) {
      try {
        const parsedData = JSON.parse(storedPages);
        // Filter out the pages we want to remove
        const filteredData = Object.keys(parsedData)
          .filter(key => ['about', 'contact'].includes(key))
          .reduce((obj, key) => {
            obj[key] = parsedData[key];
            return obj;
          }, {} as PagesData);
        
        setPagesData(filteredData);
        
        // Initialize contact info if available
        if (filteredData.contact && filteredData.contact.contactInfo) {
          setContactInfo(filteredData.contact.contactInfo);
        }
      } catch (error) {
        console.error("Error parsing pages data:", error);
      }
    }
  }, []);
  
  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPagesData({
      ...pagesData,
      [activeTab]: {
        ...pagesData[activeTab],
        [name]: value,
      },
    });
  };

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactInfo({
      ...contactInfo,
      [name]: value,
    });

    // Also update the pages data
    if (activeTab === 'contact') {
      setPagesData({
        ...pagesData,
        contact: {
          ...pagesData.contact,
          contactInfo: {
            ...contactInfo,
            [name]: value,
          }
        }
      });
    }
  };
  
  const handleSave = () => {
    // Update the lastUpdated timestamp
    const updatedPagesData = {
      ...pagesData,
      [activeTab]: {
        ...pagesData[activeTab],
        lastUpdated: new Date().toISOString(),
      },
    };
    
    // Make sure contact info is attached to contact page
    if (activeTab === 'contact') {
      updatedPagesData.contact = {
        ...updatedPagesData.contact,
        contactInfo: contactInfo
      };
    }
    
    setPagesData(updatedPagesData);
    localStorage.setItem("pagesData", JSON.stringify(updatedPagesData));
    
    toast({
      title: "Page saved",
      description: `The ${activeTab} page has been updated successfully.`,
    });

    // Dispatch an event to notify other parts of the application
    const event = new CustomEvent('pages-updated', { detail: { updatedPages: updatedPagesData } });
    window.dispatchEvent(event);
  };

  const handleReset = (tabKey: string) => {
    if (tabKey === 'about') {
      setPagesData({
        ...pagesData,
        about: {
          title: "About Natural Green Nursery",
          content: defaultAboutContent,
          metaDescription: "Learn about Natural Green Nursery, our mission, vision, and commitment to sustainable gardening practices.",
          lastUpdated: new Date().toISOString(),
        }
      });
    } else if (tabKey === 'contact') {
      const defaultContactInfo = {
        email: "info@naturalgreennursery.com",
        phone: "+91 9876543210",
        address: "123 Green Avenue, Eco City, EC 12345",
        hours: "Monday - Friday: 9AM - 6PM\nSaturday: 10AM - 5PM\nSunday: 10AM - 4PM"
      };
      
      setPagesData({
        ...pagesData,
        contact: {
          title: "Contact Us",
          content: defaultContactContent,
          metaDescription: "Contact Natural Green Nursery for inquiries about plants, gardening supplies, or any other questions.",
          lastUpdated: new Date().toISOString(),
          contactInfo: defaultContactInfo
        }
      });
      
      setContactInfo(defaultContactInfo);
    }
    
    toast({
      title: "Page reset",
      description: `The ${tabKey} page has been reset to default content.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Page Management</h1>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setEditMode(!editMode)}
            className="bg-black border-green-900/50 text-white"
          >
            {editMode ? (
              <>
                <Eye className="h-4 w-4 mr-2 text-green-400" />
                Preview
              </>
            ) : (
              <>
                <FileEdit className="h-4 w-4 mr-2 text-green-400" />
                Edit
              </>
            )}
          </Button>
          
          {editMode && (
            <Button onClick={handleSave} className="bg-green-700 hover:bg-green-800">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>
      </div>
      
      <Tabs 
        defaultValue="about" 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>
        
        {Object.keys(pagesData)
          .filter(key => ['about', 'contact'].includes(key))
          .map((pageKey) => (
          <TabsContent key={pageKey} value={pageKey} className="space-y-4">
            {editMode ? (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => handleReset(pageKey)}
                    className="text-sm bg-black border-red-900/30 text-red-400 hover:bg-red-900/20"
                  >
                    Reset to Default
                  </Button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-white">Page Title</label>
                  <Input
                    name="title"
                    value={pagesData[pageKey].title}
                    onChange={handlePageChange}
                    className="bg-black border-green-800"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-white">Meta Description</label>
                  <Input
                    name="metaDescription"
                    value={pagesData[pageKey].metaDescription}
                    onChange={handlePageChange}
                    className="bg-black border-green-800"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-white">Content</label>
                  <Textarea
                    name="content"
                    value={pagesData[pageKey].content}
                    onChange={handlePageChange}
                    rows={15}
                    className="bg-black border-green-800"
                  />
                </div>

                {pageKey === 'contact' && (
                  <div className="space-y-4 border border-green-900/30 rounded-md p-4 bg-black/30">
                    <h3 className="text-lg font-medium text-green-400">Contact Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-white">Email</label>
                      <Input
                        name="email"
                        value={contactInfo.email}
                        onChange={handleContactInfoChange}
                        className="bg-black border-green-800"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-white">Phone</label>
                      <Input
                        name="phone"
                        value={contactInfo.phone}
                        onChange={handleContactInfoChange}
                        className="bg-black border-green-800"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-white">Address</label>
                      <Input
                        name="address"
                        value={contactInfo.address}
                        onChange={handleContactInfoChange}
                        className="bg-black border-green-800"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-white">Business Hours</label>
                      <Textarea
                        name="hours"
                        value={contactInfo.hours}
                        onChange={handleContactInfoChange}
                        rows={3}
                        className="bg-black border-green-800"
                        placeholder="Monday - Friday: 9AM - 6PM&#10;Saturday - Sunday: 10AM - 4PM"
                      />
                    </div>
                  </div>
                )}
                
                <p className="text-sm text-muted">
                  Last updated: {new Date(pagesData[pageKey].lastUpdated).toLocaleString()}
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[500px] w-full rounded-md border p-4 border-green-800">
                <Card className="bg-black border-green-800">
                  <CardHeader>
                    <CardTitle className="text-white">{pagesData[pageKey].title}</CardTitle>
                    <CardDescription className="text-gray-400">{pagesData[pageKey].metaDescription}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap text-white" dangerouslySetInnerHTML={{ __html: pagesData[pageKey].content }}></div>
                    
                    {pageKey === 'contact' && (
                      <div className="mt-6 border-t border-green-900/30 pt-4">
                        <h3 className="text-lg font-medium text-green-400 mb-4">Contact Information</h3>
                        <div className="grid gap-2">
                          <div className="flex">
                            <span className="text-green-400 w-20">Email:</span>
                            <span className="text-white">{contactInfo.email}</span>
                          </div>
                          <div className="flex">
                            <span className="text-green-400 w-20">Phone:</span>
                            <span className="text-white">{contactInfo.phone}</span>
                          </div>
                          <div className="flex">
                            <span className="text-green-400 w-20">Address:</span>
                            <span className="text-white">{contactInfo.address}</span>
                          </div>
                          <div className="flex">
                            <span className="text-green-400 w-20">Hours:</span>
                            <span className="text-white whitespace-pre-line">{contactInfo.hours}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="text-xs text-gray-400">
                    Last updated: {new Date(pagesData[pageKey].lastUpdated).toLocaleString()}
                  </CardFooter>
                </Card>
              </ScrollArea>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Pages;
