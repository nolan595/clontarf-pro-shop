import { Gift, Calendar, Award, Truck, CreditCard } from "lucide-react";

export const features = [
  {
    icon: Gift,
    title: "Gift Vouchers",
    description: "Perfect presents for any golf enthusiast",
  },
  {
    icon: Calendar,
    title: "Easy Booking",
    description: "Book lessons with our PGA professionals",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Top brands and expert instruction",
  },
] as const;

export const trustBadges = [
  { icon: Truck, text: "Fast Delivery" },
  { icon: CreditCard, text: "Secure Payment" },
  { icon: Award, text: "Quality Guaranteed" },
] as const;
