
import { Leaf, Truck, Settings, Book } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description: "All our plants are grown using sustainable methods without harmful pesticides or chemicals.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "We ensure your plants reach you quickly and in perfect condition with our specialized shipping.",
  },
  {
    icon: Settings,
    title: "Expert Care Guides",
    description: "Each plant comes with detailed care instructions to help you keep them thriving.",
  },
  {
    icon: Book,
    title: "Gardening Blog",
    description: "Access free gardening tips, plant care advice, and sustainability guides on our blog.",
  },
];

const FeatureSection = () => {
  return (
    <section className="py-16 bg-eco-50">
      <div className="eco-container">
        <div className="text-center mb-12">
          <h2 className="section-title">Why Choose Natural Green</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to providing healthy plants and sustainable gardening products while promoting eco-friendly practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-eco-100 text-eco-600 rounded-full mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
