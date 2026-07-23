import { useState, useEffect } from "react";
import { AppData, LogoConfig, SettingsConfig } from "./types";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { About } from "./components/About";
import { AboutUs } from "./components/AboutUs";
import { Work } from "./components/Work";
import { OurTeam } from "./components/OurTeam";
import { Brands } from "./components/Brands";
import { Gallery } from "./components/Gallery";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { AdminLogin } from "./components/CMS/AdminLogin";
import { AdminDashboard } from "./components/CMS/AdminDashboard";

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem("cms_auth_token"));
  const [appData, setAppData] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check URL hash for routing
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#admin") {
        setIsAdminMode(true);
      } else {
        setIsAdminMode(false);
      }
    };

    // Init check
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Fetch Public Data
  const fetchPublicData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/public/data");
      if (response.ok) {
        const data = await response.json();
        setAppData(data);
        
        // Update document metadata dynamically for SEO configuration
        if (data.settings && data.settings.seo) {
          document.title = data.settings.seo.title || "In Kava - Nhà Máy In & Bao Bì Cao Cấp G7";
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute("content", data.settings.seo.description);
          } else {
            const meta = document.createElement("meta");
            meta.name = "description";
            meta.content = data.settings.seo.description;
            document.head.appendChild(meta);
          }

          // Dynamic Favicon update
          if (data.settings.seo.favicon) {
            const faviconLink = document.querySelector("link[rel*='icon']");
            if (faviconLink) {
              faviconLink.setAttribute("href", data.settings.seo.favicon);
            } else {
              const link = document.createElement("link");
              link.rel = "icon";
              link.href = data.settings.seo.favicon;
              document.head.appendChild(link);
            }
          }
        }
      }
    } catch (err) {
      console.error("Error loading website data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicData();
  }, [authToken]); // Refetch when token changes to see live CMS updates

  const handleLoginSuccess = (token: string) => {
    setAuthToken(token);
    localStorage.setItem("cms_auth_token", token);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (err) {
      console.error(err);
    }
    setAuthToken(null);
    localStorage.removeItem("cms_auth_token");
    window.location.hash = "";
  };

  const handleNavigateToAdmin = () => {
    window.location.hash = "#admin";
  };

  const handleBackToClient = () => {
    window.location.hash = "";
  };

  // Loading Screen
  if (isLoading && !appData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto" />
          <p className="text-sm font-semibold tracking-wider text-gray-400 uppercase animate-pulse">InKava.vn</p>
        </div>
      </div>
    );
  }

  // Fallback structures if fetch failed
  const safeLogo: LogoConfig = appData?.logo || { type: "text", text: "IN KAVA", image: "" };
  const safeSettings: SettingsConfig = appData?.settings || {
    companyName: "Nhà Máy In Kava",
    slogan: "Tinh Hoa In Ấn - Nâng Tầm Thương Hiệu",
    address: "Lô 5, Đường CN9, KCN Từ Liêm, Hà Nội, Việt Nam",
    email: "info@inkava.vn",
    hotline: "0904 888 777",
    facebook: "",
    youtube: "",
    tiktok: "",
    googleMaps: "",
    footer: "© 2026 In Kava.",
    seo: { title: "In Kava", description: "Nhà máy sản xuất hộp cứng & túi giấy cao cấp", keywords: "", ogImage: "", favicon: "" }
  };

  // RENDER ADMIN CMS VIEW
  if (isAdminMode) {
    if (authToken) {
      return (
        <AdminDashboard
          token={authToken}
          onLogout={handleLogout}
        />
      );
    } else {
      return (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onBackToClient={handleBackToClient}
        />
      );
    }
  }

  // RENDER LANDING PAGE VIEW
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-amber-500 selection:text-slate-950 antialiased">
      {/* Header (Sticky, floating transparent-to-white) */}
      <Header logo={safeLogo} onNavigateToAdmin={handleNavigateToAdmin} />

      {/* Hero Banner Section */}
      <Hero banners={appData?.banners || []} />

      {/* Services List Section */}
      <Services services={appData?.services || []} />

      {/* About Biography Section */}
      <About 
        about={appData?.aboutFactory || { title: "Về chúng tôi", description: "", images: [], imageRotationInterval: 5, stats: { foundationYear: 2012, area: 8500, employees: 250, capacity: 15 } }} 
        bgColor={appData?.sectionBgColors?.aboutFactory} 
      />

      {/* About Us Corporate Video Section */}
      <AboutUs 
        aboutUs={appData?.aboutUs || { title: "Tầm nhìn & Sứ mệnh", description: "In Kava kiến tạo những giải pháp đóng gói chuyên nghiệp...", videoUrl: "" }} 
        bgColor={appData?.sectionBgColors?.aboutUs} 
      />

      {/* Brand Logos Scrolling Ticker Section */}
      <Brands brands={appData?.brands || []} />

      {/* Photo Gallery Lightbox Section */}
      <Gallery items={appData?.gallery || []} />

      {/* Work Portfolio Masonry Section */}
      <Work 
        work={appData?.work || []} 
        bgColor={appData?.sectionBgColors?.work} 
      />

      {/* Our Team Infinite Scrolling Section */}
      <OurTeam 
        team={appData?.team || []} 
        bgColor={appData?.sectionBgColors?.team} 
      />

      {/* Contact Form & Coordinates Map Section */}
      <Contact 
        settings={safeSettings} 
        bgColor={appData?.sectionBgColors?.contact}
      />

      {/* Quick links & Copyright Footer Section */}
      {/* <Footer logo={safeLogo} settings={safeSettings} /> */}
    </div>
  );
}
