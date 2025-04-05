
import React from "react";
import { Leaf, Award, TreePine, Recycle } from "lucide-react";
import { cn } from "@/lib/utils";

type BadgeType = "eco-warrior" | "plant-savior" | "recycling-champion" | "green-thumb";

interface SustainabilityBadgeProps {
  type: BadgeType;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const badgeConfig = {
  "eco-warrior": {
    icon: <Leaf />,
    color: "bg-green-700",
    borderColor: "border-green-500",
    label: "Eco Warrior"
  },
  "plant-savior": {
    icon: <TreePine />,
    color: "bg-emerald-700",
    borderColor: "border-emerald-500",
    label: "Plant Savior"
  },
  "recycling-champion": {
    icon: <Recycle />,
    color: "bg-teal-700",
    borderColor: "border-teal-500",
    label: "Recycling Champion"
  },
  "green-thumb": {
    icon: <Award />,
    color: "bg-green-800",
    borderColor: "border-green-600",
    label: "Green Thumb"
  },
};

const SustainabilityBadge = ({ type, size = "md", className }: SustainabilityBadgeProps) => {
  const badge = badgeConfig[type];
  
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };
  
  const iconSize = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className={cn(
          "rounded-full flex items-center justify-center",
          badge.color,
          `border-2 ${badge.borderColor}`,
          sizeClasses[size],
          "green-glow",
          className
        )}
      >
        <div className={iconSize[size]}>
          {badge.icon}
        </div>
      </div>
      <span className="text-xs mt-1 text-white">{badge.label}</span>
    </div>
  );
};

export default SustainabilityBadge;
