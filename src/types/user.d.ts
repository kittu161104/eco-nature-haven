
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  isAdmin: boolean;
  role?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  sustainabilityBadges?: string[];
  ecoPoints?: number;
  plantCareTips?: boolean;
}

export default User;
