
import TestimonialCard, { TestimonialProps } from "./TestimonialCard";

// Sample testimonials
const testimonials: TestimonialProps[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    location: "Portland, OR",
    rating: 5,
    text: "I've ordered plants from many online nurseries, but Natural Green stands out for their quality and packaging. My fiddle leaf fig arrived in perfect condition and is thriving in my home!",
    date: "June 15, 2023"
  },
  {
    id: "2",
    name: "Michael Chen",
    location: "Austin, TX",
    rating: 4,
    text: "The care instructions that came with my plants were incredibly detailed and helpful. My indoor garden is flourishing thanks to their guidance. Will definitely order again!",
    date: "July 3, 2023"
  },
  {
    id: "3",
    name: "Jessica Rivera",
    location: "Chicago, IL",
    rating: 5,
    text: "Not only are their plants healthy and beautiful, but their commitment to sustainability is evident in everything from their plastic-free packaging to their organic soil options.",
    date: "August 22, 2023"
  }
];

const TestimonialSection = () => {
  return (
    <section className="py-16 bg-earth-50">
      <div className="eco-container">
        <div className="text-center mb-12">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from plant lovers who have transformed their spaces with our plants
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
