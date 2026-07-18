export interface LogoConfig {
  type: "text" | "image";
  text: string;
  image: string;
}

export interface SEOCongfig {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  favicon: string;
}

export interface SettingsConfig {
  companyName: string;
  slogan: string;
  address: string;
  email: string;
  hotline: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  zalo?: string;
  instagram?: string;
  linkedin?: string;
  showFacebook?: boolean;
  showYoutube?: boolean;
  showTiktok?: boolean;
  showZalo?: boolean;
  showInstagram?: boolean;
  showLinkedin?: boolean;
  googleMaps: string;
  footer: string;
  seo: SEOCongfig;
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  image: string;
  isVisible: boolean;
  order: number;
}

export interface Certificate {
  name: string;
  fileUrl: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  descriptionTitle?: string; // Newly added: header/title for the description
  details?: string[]; // Newly added: list of bullet points for the description
  icon: string; // key of lucide-react icons (e.g. Printer, Box, BookOpen, Tag, ShoppingBag, Layers)
  image: string;
  images?: string[]; // Newly added: supporting multiple cover/showcase images
  isVisible: boolean;
  order: number;
  certificates?: Certificate[]; // List of certificates or secondary images/PDFs (up to 4)
}

export interface AboutStats {
  foundationYear: number;
  area: number;
  employees: number;
  capacity: number;
  experienceYears?: number;
  globalBrands?: number;
  projectsDone?: number;
}

export interface AboutConfig {
  title: string;
  description: string;
  image: string;
  stats: AboutStats;
}

export interface AboutFactoryConfig {
  title: string;
  description: string;
  images: string[];
  imageRotationInterval: number; // in seconds
  stats: AboutStats;
}

export interface AboutUsConfig {
  title: string;
  description: string;
  videoUrl: string;
}

export interface TeamMember {
  id: string;
  avatar: string;
  fullName: string;
  email: string;
  department: string;
  position?: string;
  order: number;
}

export interface WorkItem {
  id: string;
  image: string;
  customerName: string;
  application: string;
  stylePreset?: string;
  order: number;
}

export interface SectionBgColors {
  aboutFactory: string;
  aboutUs: string;
  work: string;
  team: string;
  contact: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  isVisible: boolean;
  order: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
}

export interface ContactRequest {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  company?: string;
  address?: string;
  message: string;
  createdAt: string;
  isProcessed: boolean;
}

export interface AppData {
  logo: LogoConfig;
  settings: SettingsConfig;
  banners: Banner[];
  services: Service[];
  about: AboutConfig;
  aboutFactory: AboutFactoryConfig;
  aboutUs: AboutUsConfig;
  team: TeamMember[];
  work: WorkItem[];
  sectionBgColors: SectionBgColors;
  brands: Brand[];
  gallery: GalleryItem[];
}
