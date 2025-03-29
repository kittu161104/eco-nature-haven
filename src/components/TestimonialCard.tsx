
import { Star } from "lucide-react";

export interface TestimonialProps {
  id: string;
  name: string;
  location: string;
  avatar?: string;
  rating: number;
  text: string;
  date: string;
}

const TestimonialCard = ({ testimonial }: { testimonial: TestimonialProps }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      {/* Rating */}
      <div className="flex mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < testimonial.rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      
      {/* Testimonial text */}
      <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
      
      {/* Customer info */}
      <div className="flex items-center">
        {testimonial.avatar ? (
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="h-10 w-10 rounded-full object-cover mr-3"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-eco-100 text-eco-600 flex items-center justify-center font-medium mr-3">
            {testimonial.name.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-medium text-gray-900">{testimonial.name}</p>
          <p className="text-xs text-gray-500">{testimonial.location}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
