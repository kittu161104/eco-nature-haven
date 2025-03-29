
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CTASection from "@/components/CTASection";
import { Leaf, Heart, Users, Globe } from "lucide-react";

const values = [
  {
    icon: Leaf,
    title: "Sustainability",
    description: "We're committed to environmental stewardship through sustainable growing practices, eco-friendly packaging, and reduced carbon footprint.",
  },
  {
    icon: Heart,
    title: "Quality",
    description: "Every plant in our nursery is carefully grown and inspected to ensure it's healthy and ready to thrive in your home or garden.",
  },
  {
    icon: Users,
    title: "Community",
    description: "We believe in building a community of plant lovers and providing education on sustainable gardening practices.",
  },
  {
    icon: Globe,
    title: "Planet-First",
    description: "Our business decisions are made with the health of our planet in mind, from sourcing to shipping.",
  },
];

const team = [
  {
    name: "Emily Johnson",
    role: "Founder & Head Botanist",
    bio: "With over 15 years of experience in plant cultivation, Emily founded Natural Green with a vision to make sustainable gardening accessible to all.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "David Chen",
    role: "Sustainability Director",
    bio: "David ensures all our operations meet the highest environmental standards. He oversees our eco-friendly initiatives and carbon offset program.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Maria Rodriguez",
    role: "Plant Care Specialist",
    bio: "Maria develops our detailed care guides and manages plant health throughout our nursery. She's passionate about helping everyone succeed with plants.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
];

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* About Hero */}
        <div className="bg-eco-800 text-white py-20">
          <div className="eco-container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                Our Story
              </h1>
              <p className="text-xl text-eco-100">
                We're on a mission to make sustainable gardening accessible and enjoyable for everyone while promoting a healthier planet.
              </p>
            </div>
          </div>
        </div>
        
        {/* Our Mission */}
        <section className="py-16">
          <div className="eco-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="section-title">Our Mission</h2>
                <p className="text-gray-600 mb-6">
                  Founded in 2015, Natural Green began with a simple idea: to create a plant nursery that puts sustainability and plant health first. What started as a small backyard greenhouse has grown into a thriving nursery dedicated to providing healthy, sustainably grown plants and expert gardening advice.
                </p>
                <p className="text-gray-600 mb-6">
                  Our mission is to inspire and enable sustainable living through plants. We believe that every plant we sell has the potential to make homes healthier, gardens more vibrant, and our planet a little greener.
                </p>
                <p className="text-gray-600">
                  We're committed to sustainable growing practices, plastic-free packaging, and supporting local conservation efforts. When you shop with us, you're not just buying plants – you're supporting a vision of a greener, more sustainable future.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1466692476655-ab0c26c69cbf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Nursery greenhouse with various plants"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-16 bg-eco-50">
          <div className="eco-container">
            <div className="text-center mb-12">
              <h2 className="section-title">Our Values</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                These core principles guide everything we do at Natural Green
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-eco-100 text-eco-600 rounded-full mb-4">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Our Team */}
        <section className="py-16">
          <div className="eco-container">
            <div className="text-center mb-12">
              <h2 className="section-title">Meet Our Team</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                The passionate plant experts behind Natural Green
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-eco-600 font-medium mb-4">{member.role}</p>
                    <p className="text-gray-600">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Visit Us */}
        <section className="py-16 bg-earth-50">
          <div className="eco-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="section-title">Visit Our Nursery</h2>
                <p className="text-gray-600 mb-6">
                  We'd love to welcome you to our physical location where you can explore our full collection of plants, get personalized advice from our experts, and experience our sustainable nursery practices firsthand.
                </p>
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-medium text-gray-900">Address</h4>
                    <p className="text-gray-600">123 Green Avenue, Eco City, EC 12345</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Hours</h4>
                    <p className="text-gray-600">Monday - Friday: 9am - 6pm</p>
                    <p className="text-gray-600">Saturday: 8am - 5pm</p>
                    <p className="text-gray-600">Sunday: 10am - 4pm</p>
                  </div>
                </div>
                <Button asChild className="bg-eco-600 hover:bg-eco-700">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80" 
                  alt="Interior of our plant nursery"
                  className="w-full h-full object-cover"
                />
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

export default About;
