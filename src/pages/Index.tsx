
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeatureSection from "@/components/FeatureSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import TestimonialSection from "@/components/TestimonialSection";
import BlogPreview from "@/components/BlogPreview";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeatureSection />
        <FeaturedProducts />
        <TestimonialSection />
        <BlogPreview />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
