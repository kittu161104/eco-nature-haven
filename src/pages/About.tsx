
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { safelyParseJSON } from "@/lib/utils";

const About = () => {
  const [pageContent, setPageContent] = useState({
    title: "About Natural Green Nursery",
    content: "Welcome to Natural Green Nursery, your one-stop destination for all your gardening needs. We are committed to providing high-quality plants and gardening supplies.",
    metaDescription: "Learn about Natural Green Nursery, our mission, vision, and commitment to sustainable gardening practices."
  });

  useEffect(() => {
    // Listen for page content updates from admin
    const handlePagesUpdated = (event: CustomEvent) => {
      if (event.detail?.updatedPages?.about) {
        setPageContent(event.detail.updatedPages.about);
      }
    };

    window.addEventListener('pages-updated', handlePagesUpdated as EventListener);

    // Initial load from localStorage
    try {
      const storedPagesData = localStorage.getItem("pagesData");
      if (storedPagesData) {
        const parsedData = safelyParseJSON(storedPagesData, {});
        if (parsedData && typeof parsedData === 'object' && 'about' in parsedData) {
          setPageContent(parsedData.about);
        }
      }
    } catch (error) {
      console.error("Error loading about page data:", error);
    }

    return () => {
      window.removeEventListener('pages-updated', handlePagesUpdated as EventListener);
    };
  }, []);

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
        
        {/* Content Section */}
        <div className="eco-container py-16">
          <Card className="bg-black border-green-900/50 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-white" dangerouslySetInnerHTML={{ __html: pageContent.content }}></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
