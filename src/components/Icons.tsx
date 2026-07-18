import React from "react";
import * as Lucide from "lucide-react";

export const IconMap: Record<string, React.ComponentType<any>> = {
  Printer: Lucide.Printer,
  Box: Lucide.Box,
  BookOpen: Lucide.BookOpen,
  Tag: Lucide.Tag,
  ShoppingBag: Lucide.ShoppingBag,
  Layers: Lucide.Layers,
  Settings: Lucide.Settings,
  Phone: Lucide.Phone,
  Mail: Lucide.Mail,
  MapPin: Lucide.MapPin,
  Clock: Lucide.Clock,
  Facebook: Lucide.Facebook,
  Youtube: Lucide.Youtube,
  Globe: Lucide.Globe,
  Plus: Lucide.Plus,
  Trash2: Lucide.Trash2,
  Edit2: Lucide.Edit2,
  Check: Lucide.Check,
  Eye: Lucide.Eye,
  EyeOff: Lucide.EyeOff,
  User: Lucide.User,
  LogOut: Lucide.LogOut,
  LayoutDashboard: Lucide.LayoutDashboard,
  Image: Lucide.Image,
  Award: Lucide.Award,
  ChevronLeft: Lucide.ChevronLeft,
  ChevronRight: Lucide.ChevronRight,
  Menu: Lucide.Menu,
  X: Lucide.X,
  Upload: Lucide.Upload,
  Link: Lucide.Link,
  Save: Lucide.Save,
  MessageSquare: Lucide.MessageSquare,
  Shield: Lucide.Shield
};

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className, size = 24 }) => {
  const IconComponent = IconMap[name] || Lucide.HelpCircle;
  return <IconComponent className={className} size={size} />;
};
