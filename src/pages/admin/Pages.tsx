
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, FileEdit, Eye } from "lucide-react";

interface PageContent {
  title: string;
  content: string;
  metaDescription: string;
  lastUpdated: string;
}

interface PagesData {
  [key: string]: PageContent;
}

const Pages = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("about");
  const [pagesData, setPagesData] = useState<PagesData>({
    about: {
      title: "About Natural Green Nursery",
      content: "Welcome to Natural Green Nursery, your one-stop destination for all your gardening needs. We are committed to providing high-quality plants and gardening supplies.",
      metaDescription: "Learn about Natural Green Nursery, our mission, vision, and commitment to sustainable gardening practices.",
      lastUpdated: new Date().toISOString(),
    },
    contact: {
      title: "Contact Us",
      content: "We're here to help! Reach out to us for any queries or assistance.",
      metaDescription: "Contact Natural Green Nursery for inquiries about plants, gardening supplies, or any other questions.",
      lastUpdated: new Date().toISOString(),
    }
  });
  
  const [editMode, setEditMode] = useState(true);
  
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
  
  const handleSave = () => {
    // Update the lastUpdated timestamp
    const updatedPagesData = {
      ...pagesData,
      [activeTab]: {
        ...pagesData[activeTab],
        lastUpdated: new Date().toISOString(),
      },
    };
    
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Page Management</h1>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </>
            ) : (
              <>
                <FileEdit className="h-4 w-4 mr-2" />
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
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>
        
        {Object.keys(pagesData).map((pageKey) => (
          <TabsContent key={pageKey} value={pageKey} className="space-y-4">
            {editMode ? (
              <div className="space-y-4">
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
                    <div className="whitespace-pre-wrap text-white">{pagesData[pageKey].content}</div>
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
