import React, { useState, useEffect } from "react";
import { AppData, ContactRequest } from "../../types";
import { BannersCMS } from "./BannersCMS";
import { ServicesCMS } from "./ServicesCMS";
import { AboutCMS } from "./AboutCMS";
import { AboutUsCMS } from "./AboutUsCMS";
import { WorkCMS } from "./WorkCMS";
import { OurTeamCMS } from "./OurTeamCMS";
import { SectionBgColorsCMS } from "./SectionBgColorsCMS";
import { BrandsCMS } from "./BrandsCMS";
import { GalleryCMS } from "./GalleryCMS";
import { ContactsCMS } from "./ContactsCMS";
import { SettingsCMS } from "./SettingsCMS";
import {
  LayoutDashboard,
  Image,
  Printer,
  Info,
  Film,
  Briefcase,
  Palette,
  Award,
  Grid,
  Mail,
  Settings,
  LogOut,
  User,
  Activity,
  Globe
} from "lucide-react";

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
}

type MenuTab = "dashboard" | "banners" | "services" | "about" | "aboutUs" | "work" | "team" | "sectionBgColors" | "brands" | "gallery" | "contacts" | "settings";

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ token, onLogout }) => {
  const [activeTab, setActiveTab] = useState<MenuTab>("dashboard");
  const [appData, setAppData] = useState<AppData | null>(null);
  const [contactList, setContactList] = useState<ContactRequest[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchCmsData = async () => {
    try {
      const response = await fetch("/api/admin/data", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAppData(data);
        setContactList(data.contacts || []);
      }
    } catch (err) {
      console.error("Error loading CMS data:", err);
    }
  };

  useEffect(() => {
    fetchCmsData();
  }, [token, refreshTrigger]);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!appData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mx-auto" />
          <p className="text-sm font-semibold text-gray-700 animate-pulse">Đang tải dữ liệu cấu hình CMS...</p>
        </div>
      </div>
    );
  }

  // Dashboard Stats calculation
  const totalBanners = appData.banners?.length || 0;
  const totalServices = appData.services?.length || 0;
  const totalBrands = appData.brands?.length || 0;
  const totalGallery = appData.gallery?.length || 0;
  const totalContacts = contactList.length || 0;
  const unprocessedContacts = contactList.filter((c) => !c.isProcessed).length;

  const sidebarMenu = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "banners", label: "Banner", icon: Image },
    { id: "services", label: "Services", icon: Printer },
    { id: "about", label: "About Factory", icon: Info },
    { id: "aboutUs", label: "About Us (Video)", icon: Film },
    { id: "work", label: "Work Archive", icon: Grid },
    { id: "team", label: "Our Team", icon: Briefcase },
    { id: "sectionBgColors", label: "Màu nền Section", icon: Palette },
    { id: "brands", label: "Brands", icon: Award },
    { id: "gallery", label: "Gallery", icon: Grid },
    { id: "contacts", label: "Contact", icon: Mail, badge: unprocessedContacts > 0 ? unprocessedContacts : undefined },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-gray-800">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between shadow-xl border-r border-slate-800 shrink-0">
        <div>
          {/* Logo Brand */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-slate-950 rounded-lg">
              <Printer size={18} />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-widest text-white">IN KAVA</h1>
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Trang Quản Trị CMS</p>
            </div>
          </div>

          {/* User profile capsule */}
          <div className="p-4 mx-4 my-5 bg-slate-950/50 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/10">
              <User size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-300">Administrator</p>
              <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                Online
              </p>
            </div>
          </div>

          {/* Nav links list */}
          <nav className="px-3 space-y-1">
            {sidebarMenu.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as MenuTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10 font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={16} />
                    {item.label}
                  </span>
                  {item.badge !== undefined && (
                    <span className="bg-rose-500 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          {/* Back to Client */}
          <a
            href="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold uppercase transition-all"
          >
            <Globe size={14} />
            Xem Landing Page
          </a>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase transition-all shadow-md cursor-pointer"
          >
            <LogOut size={14} />
            Đăng Xuất
          </button>
        </div>
      </aside>

      {/* RIGHT CONTENT WORKSPACE */}
      <main className="flex-grow p-8 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto">
          
          {/* TAB CONTENT: DASHBOARD HOME STATS */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900 uppercase">TỔNG QUAN HỆ THỐNG</h2>
                <p className="text-sm text-gray-500 mt-1 font-light">
                  Chào mừng bạn quay trở lại trang quản trị của <strong className="font-semibold text-gray-800">{appData.settings?.companyName}</strong>.
                </p>
              </div>

              {/* Stats Counters Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Stat 1 */}
                <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tổng Banner</p>
                    <p className="text-3xl font-black font-mono text-slate-900">{totalBanners}</p>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                    <Image size={24} />
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Dịch vụ In ấn</p>
                    <p className="text-3xl font-black font-mono text-slate-900">{totalServices}</p>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                    <Printer size={24} />
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Khách liên hệ</p>
                    <p className="text-3xl font-black font-mono text-slate-900">{totalContacts}</p>
                  </div>
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 relative">
                    <Mail size={24} />
                    {unprocessedContacts > 0 && (
                      <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-rose-500 border-2 border-white animate-pulse" />
                    )}
                  </div>
                </div>

                {/* Stat 4 */}
                <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ảnh thư viện</p>
                    <p className="text-3xl font-black font-mono text-slate-900">{totalGallery}</p>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                    <Grid size={24} />
                  </div>
                </div>
              </div>

              {/* Inner quick summary banner / quick guides */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                <div className="lg:col-span-2 bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-2xl p-6.5 shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[200px] border border-amber-500/10">
                  {/* Visual overlay rings */}
                  <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full border border-white/10" />
                  <div className="absolute -right-4 -bottom-4 w-48 h-48 bg-white/5 rounded-full border border-white/10" />

                  <div className="space-y-2 relative z-10">
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-white/15 px-2.5 py-1 rounded-full border border-white/10">Trạng thái CMS</span>
                    <h3 className="text-2xl font-black tracking-tight pt-1">HỆ THỐNG HOẠT ĐỘNG HOÀN HẢO</h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      Mọi chỉnh sửa của bạn về logo, số điện thoại, hình nền, nội dung hay danh mục dịch vụ sẽ lập tức được ghi nhận vào cơ sở dữ liệu và hiển thị ngay trên Landing Page ngoài mà không cần can thiệp mã nguồn.
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4 relative z-10 text-xs">
                    <button onClick={() => setActiveTab("settings")} className="px-4 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-lg shadow hover:bg-amber-450 transition-all cursor-pointer">
                      Chỉnh sửa Cấu hình
                    </button>
                    <button onClick={() => setActiveTab("contacts")} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-all border border-slate-700 cursor-pointer">
                      Xem liên hệ ({unprocessedContacts} mới)
                    </button>
                  </div>
                </div>

                {/* System status / developer support */}
                <div className="bg-white p-6.5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thông tin máy chủ</h4>
                  
                  <div className="space-y-3 text-xs font-sans font-light">
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-gray-500">Môi trường</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Activity size={12} className="text-amber-500 animate-pulse" />
                        Node.js Fullstack
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-gray-500">Dịch vụ REST API</span>
                      <span className="font-semibold text-slate-800">Express Router</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-gray-500">Cơ sở dữ liệu</span>
                      <span className="font-semibold text-slate-800">database.json (Persistent)</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-500">Tải lên tệp</span>
                      <span className="font-semibold text-emerald-600">Đã kích hoạt</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "banners" && (
            <BannersCMS banners={appData.banners} token={token} onUpdate={() => {}} refreshData={triggerRefresh} />
          )}

          {activeTab === "services" && (
            <ServicesCMS services={appData.services} token={token} onUpdate={() => {}} refreshData={triggerRefresh} />
          )}

          {activeTab === "about" && (
            <AboutCMS about={appData.aboutFactory} token={token} refreshData={triggerRefresh} />
          )}

          {activeTab === "aboutUs" && (
            <AboutUsCMS aboutUs={appData.aboutUs} token={token} refreshData={triggerRefresh} />
          )}

          {activeTab === "work" && (
            <WorkCMS token={token} refreshData={triggerRefresh} />
          )}

          {activeTab === "team" && (
            <OurTeamCMS token={token} refreshData={triggerRefresh} />
          )}

          {activeTab === "sectionBgColors" && (
            <SectionBgColorsCMS colors={appData.sectionBgColors} token={token} refreshData={triggerRefresh} />
          )}

          {activeTab === "brands" && (
            <BrandsCMS brands={appData.brands} token={token} onUpdate={() => {}} refreshData={triggerRefresh} />
          )}

          {activeTab === "gallery" && (
            <GalleryCMS gallery={appData.gallery} token={token} onUpdate={() => {}} refreshData={triggerRefresh} />
          )}

          {activeTab === "contacts" && (
            <ContactsCMS token={token} refreshTrigger={refreshTrigger} triggerRefresh={triggerRefresh} />
          )}

          {activeTab === "settings" && (
            <SettingsCMS settings={appData.settings} logo={appData.logo} token={token} onUpdate={() => {}} refreshData={triggerRefresh} />
          )}

        </div>
      </main>
    </div>
  );
};
