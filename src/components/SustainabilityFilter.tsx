
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Leaf, Recycle, Droplet, TreePine, ShieldCheck } from "lucide-react";

interface SustainabilityFilterProps {
  selectedFilters: string[];
  onChange: (filters: string[]) => void;
}

const SustainabilityFilter = ({ selectedFilters, onChange }: SustainabilityFilterProps) => {
  const filters = [
    {
      id: "eco-friendly",
      label: "Eco-Friendly",
      description: "Products with minimal environmental impact",
      icon: <Leaf className="h-4 w-4 text-green-500" />
    },
    {
      id: "water-efficient",
      label: "Water Efficient",
      description: "Plants that require less watering",
      icon: <Droplet className="h-4 w-4 text-blue-500" />
    },
    {
      id: "recyclable",
      label: "Recyclable Packaging",
      description: "Products with recyclable packaging",
      icon: <Recycle className="h-4 w-4 text-teal-500" />
    },
    {
      id: "locally-sourced",
      label: "Locally Sourced",
      description: "Plants grown within 100km radius",
      icon: <TreePine className="h-4 w-4 text-green-600" />
    },
    {
      id: "chemical-free",
      label: "Chemical-Free",
      description: "Grown without synthetic pesticides",
      icon: <ShieldCheck className="h-4 w-4 text-emerald-500" />
    }
  ];

  const handleFilterChange = (filterId: string, isChecked: boolean) => {
    if (isChecked) {
      onChange([...selectedFilters, filterId]);
    } else {
      onChange(selectedFilters.filter(id => id !== filterId));
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-white flex items-center">
        <Leaf className="h-5 w-5 mr-2 text-green-500" />
        Sustainability
      </h3>
      
      <div className="space-y-3 filter-scroll pr-2">
        {filters.map((filter) => (
          <div key={filter.id} className="flex items-start space-x-2 p-2 rounded hover:bg-green-900/10 transition-colors">
            <Checkbox
              id={`filter-${filter.id}`}
              checked={selectedFilters.includes(filter.id)}
              onCheckedChange={(checked) => handleFilterChange(filter.id, !!checked)}
              className="border-green-600 mt-1"
            />
            <div>
              <div className="flex items-center">
                {filter.icon}
                <Label 
                  htmlFor={`filter-${filter.id}`}
                  className="ml-2 text-sm font-medium cursor-pointer text-white"
                >
                  {filter.label}
                </Label>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{filter.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SustainabilityFilter;
