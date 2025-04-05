
import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Leaf, Recycle, Droplets, Sun, Wind } from "lucide-react";

const Sustainability = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-green-900/30 to-black"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(22,163,74,0.3),transparent_70%)]"></div>
          </div>
          
          <div className="eco-container relative z-10">
            <motion.div 
              className="max-w-3xl mx-auto text-center"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Our Commitment to <span className="text-eco-400">Sustainability</span>
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Creating a greener future through sustainable practices, one plant at a time.
              </p>
              <div className="flex justify-center">
                <Leaf className="h-16 w-16 text-eco-500 animate-pulse" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Approach */}
        <section className="py-16 bg-black/80">
          <div className="eco-container">
            <motion.div 
              className="max-w-3xl mx-auto text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold mb-4 text-white">Our Sustainable Approach</h2>
              <p className="text-white/70">
                At Natural Green Nursery, sustainability isn't just a buzzword—it's at the core of everything we do.
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div 
                className="bg-black/50 backdrop-blur-lg p-8 rounded-lg border border-green-900/50 glass"
                variants={fadeIn}
              >
                <div className="bg-green-900/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <Recycle className="h-8 w-8 text-eco-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Eco-Friendly Packaging</h3>
                <p className="text-white/70">
                  We've eliminated plastic from our packaging, using only biodegradable and compostable materials. Our pots are made from recycled materials or biodegradable alternatives.
                </p>
              </motion.div>

              <motion.div 
                className="bg-black/50 backdrop-blur-lg p-8 rounded-lg border border-green-900/50 glass"
                variants={fadeIn}
              >
                <div className="bg-green-900/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <Droplets className="h-8 w-8 text-eco-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Water Conservation</h3>
                <p className="text-white/70">
                  Our nursery employs advanced drip irrigation systems and rainwater harvesting to minimize water usage. We also prioritize drought-resistant plants in our collection.
                </p>
              </motion.div>

              <motion.div 
                className="bg-black/50 backdrop-blur-lg p-8 rounded-lg border border-green-900/50 glass"
                variants={fadeIn}
              >
                <div className="bg-green-900/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <Sun className="h-8 w-8 text-eco-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Renewable Energy</h3>
                <p className="text-white/70">
                  Our facilities are powered by 100% renewable energy sources. Solar panels on our greenhouse roofs generate electricity for our operations.
                </p>
              </motion.div>

              <motion.div 
                className="bg-black/50 backdrop-blur-lg p-8 rounded-lg border border-green-900/50 glass"
                variants={fadeIn}
              >
                <div className="bg-green-900/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <Wind className="h-8 w-8 text-eco-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Carbon Footprint Reduction</h3>
                <p className="text-white/70">
                  We work with local growers to reduce transportation emissions and calculate our carbon footprint annually, offsetting it through verified reforestation projects.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-16 bg-black">
          <div className="eco-container">
            <motion.div 
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold mb-4 text-white">Our Certifications</h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                We're proud to be recognized for our commitment to sustainable and ethical business practices.
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {['Organic Certified', 'Fair Trade', 'B Corp', 'Carbon Neutral'].map((cert, index) => (
                <motion.div 
                  key={index}
                  className="bg-black/40 backdrop-blur-md border border-green-900/40 rounded-lg p-6 text-center hover:border-green-500 transition-colors duration-300"
                  variants={fadeIn}
                >
                  <div className="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-eco-400 text-2xl font-bold">{index + 1}</span>
                  </div>
                  <h3 className="font-bold text-white mb-2">{cert}</h3>
                  <p className="text-white/60 text-sm">
                    Verified and certified for meeting the highest industry standards.
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Environmental Impact */}
        <section className="py-16 bg-black/90">
          <div className="eco-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <h2 className="text-3xl font-bold mb-6 text-white">Our Environmental Impact</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center mb-1">
                      <h4 className="font-bold text-white">Reduced Water Usage</h4>
                      <span className="ml-auto text-eco-400">85%</span>
                    </div>
                    <div className="h-2 bg-green-900/30 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-eco-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: '85%' }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 1 }}
                      ></motion.div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-1">
                      <h4 className="font-bold text-white">Plastic Reduction</h4>
                      <span className="ml-auto text-eco-400">92%</span>
                    </div>
                    <div className="h-2 bg-green-900/30 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-eco-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: '92%' }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 1 }}
                      ></motion.div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-1">
                      <h4 className="font-bold text-white">Carbon Footprint</h4>
                      <span className="ml-auto text-eco-400">70%</span>
                    </div>
                    <div className="h-2 bg-green-900/30 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-eco-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: '70%' }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7, duration: 1 }}
                      ></motion.div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-1">
                      <h4 className="font-bold text-white">Renewable Energy</h4>
                      <span className="ml-auto text-eco-400">100%</span>
                    </div>
                    <div className="h-2 bg-green-900/30 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-eco-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.9, duration: 1 }}
                      ></motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                className="bg-black/40 backdrop-blur-lg p-8 rounded-lg border border-green-900/30"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <h3 className="text-xl font-bold mb-4 text-white">Annual Impact Report</h3>
                <p className="text-white/70 mb-6">
                  Every year, we publish a comprehensive sustainability report detailing our environmental impact, social initiatives, and progress toward our goals.
                </p>
                <ul className="space-y-3">
                  {['10,000+ trees planted', '5 million gallons of water saved', '300+ tons of carbon offset', '85% waste reduction'].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-green-900/30 p-1 rounded-full flex-shrink-0 mr-3">
                        <Leaf className="h-4 w-4 text-eco-400" />
                      </span>
                      <span className="text-white/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Sustainability;
