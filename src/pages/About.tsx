
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { safelyParseJSON } from "@/lib/utils";
import { Leaf, Sprout, Seedling } from "lucide-react";

interface AboutPageContent {
  title: string;
  content: string;
  metaDescription: string;
}

const About = () => {
  const [pageContent, setPageContent] = useState<AboutPageContent>({
    title: "About Natural Green Nursery",
    content: `<h2 class="text-2xl font-semibold mb-4 text-eco-400">Our Story</h2>
<p class="mb-6">Natural Green Nursery was founded in 2010 with a mission to bring sustainable and eco-friendly gardening solutions to everyone. What started as a small family business has grown into a thriving community of plant enthusiasts and environmental advocates.</p>

<h2 class="text-2xl font-semibold mb-4 text-eco-400">Our Mission</h2>
<p class="mb-6">We believe in promoting sustainable gardening practices that not only beautify spaces but also contribute positively to the environment. Every plant we grow and product we sell is carefully selected to align with our eco-conscious values.</p>

<h2 class="text-2xl font-semibold mb-4 text-eco-400">Our Team</h2>
<p class="mb-6">Our team consists of passionate horticulturists, environmental scientists, and gardening enthusiasts who are dedicated to providing you with the healthiest plants and most sustainable gardening supplies.</p>

<h2 class="text-2xl font-semibold mb-4 text-eco-400">Sustainability Commitment</h2>
<p class="mb-6">At Natural Green Nursery, sustainability isn't just a buzzword—it's at the core of everything we do. From our biodegradable plant pots to our organic fertilizers, we're committed to reducing our environmental footprint and helping you do the same.</p>

<h2 class="text-2xl font-semibold mb-4 text-eco-400">Community Engagement</h2>
<p>We regularly organize workshops, plant adoption drives, and community gardening events. Join us in our mission to make the world greener, one plant at a time.</p>`,
    metaDescription: "Learn about Natural Green Nursery, our mission, vision, and commitment to sustainable gardening practices."
  });

  useEffect(() => {
    // Listen for page content updates from admin
    const handlePagesUpdated = (event: CustomEvent) => {
      if (event.detail?.updatedPages?.about) {
        setPageContent(event.detail.updatedPages.about as AboutPageContent);
      }
    };

    window.addEventListener('pages-updated', handlePagesUpdated as EventListener);

    // Initial load from localStorage
    try {
      const storedPagesData = localStorage.getItem("pagesData");
      if (storedPagesData) {
        const parsedData = safelyParseJSON(storedPagesData, {});
        if (parsedData && typeof parsedData === 'object' && 'about' in parsedData) {
          setPageContent(parsedData.about as AboutPageContent);
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
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-eco-900/30 backdrop-blur-sm rounded-lg border border-eco-700/30 transform transition-all hover:scale-105 duration-300">
              <div className="mx-auto h-16 w-16 bg-eco-800/50 rounded-full flex items-center justify-center mb-4">
                <Leaf className="h-8 w-8 text-eco-400" />
              </div>
              <h3 className="text-xl font-semibold text-eco-400 mb-2">Eco-Friendly</h3>
              <p className="text-white">All our products and practices are designed with environmental sustainability in mind.</p>
            </div>
            
            <div className="text-center p-6 bg-eco-900/30 backdrop-blur-sm rounded-lg border border-eco-700/30 transform transition-all hover:scale-105 duration-300">
              <div className="mx-auto h-16 w-16 bg-eco-800/50 rounded-full flex items-center justify-center mb-4">
                <Sprout className="h-8 w-8 text-eco-400" />
              </div>
              <h3 className="text-xl font-semibold text-eco-400 mb-2">Expert Care</h3>
              <p className="text-white">Our team of horticulturists provides expert advice and care for all our plants.</p>
            </div>
            
            <div className="text-center p-6 bg-eco-900/30 backdrop-blur-sm rounded-lg border border-eco-700/30 transform transition-all hover:scale-105 duration-300">
              <div className="mx-auto h-16 w-16 bg-eco-800/50 rounded-full flex items-center justify-center mb-4">
                <Seedling className="h-8 w-8 text-eco-400" />
              </div>
              <h3 className="text-xl font-semibold text-eco-400 mb-2">Community-Focused</h3>
              <p className="text-white">We believe in building a community of plant lovers and environmental stewards.</p>
            </div>
          </div>
          
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
