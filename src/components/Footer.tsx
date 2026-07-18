import React from "react";
import { ArrowUp, Phone, Mail, MapPin, Facebook, Youtube, Instagram, Linkedin } from "lucide-react";
import { LogoConfig, SettingsConfig } from "../types";

interface FooterProps {
  logo: LogoConfig;
  settings: SettingsConfig;
}

export const Footer: React.FC<FooterProps> = ({ logo, settings }) => {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <footer className="bg-slate-950 text-gray-400 py-16 relative border-t border-white/5">
      
      {/* Scroll to Top button */}
      <button
        onClick={handleScrollToTop}
        className="absolute -top-6 left-1/2 -translate-x-1/2 p-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-full shadow-lg shadow-amber-500/10 hover:scale-110 transition-all border border-slate-900"
        title="Trở về đầu trang"
        aria-label="Back to Top"
      >
        <ArrowUp size={20} className="stroke-[2.5]" />
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Logo & Description */}
          <div className="lg:col-span-4 space-y-6">
            <a href="#home" onClick={(e) => handleLinkClick(e, "#home")} className="flex items-center gap-2">
              {logo.type === "image" && logo.image ? (
                <img
                  src={logo.image}
                  alt="Logo"
                  className="h-10 w-auto object-contain brightness-0 invert"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-2xl font-black tracking-widest text-white uppercase font-display">
                  {logo.text || "INKAVA"}<span className="text-amber-500">.</span>
                </span>
              )}
            </a>
            <p className="text-sm font-sans font-light leading-relaxed text-slate-400">
              Nhà máy sản xuất bao bì giấy & hộp cứng cao cấp In Kava tự hào mang lại các giải pháp thiết kế tinh tế và in ấn hộp quà tặng luxury tiêu chuẩn G7 khắt khe nhất tại Việt Nam.
            </p>
            {/* Social Links */}
            <div className="flex flex-wrap gap-3 pt-2">
              {settings.facebook && settings.showFacebook !== false && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 hover:bg-amber-600 hover:text-white p-2.5 rounded-lg transition-all text-gray-400 border border-white/5"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
              )}
              {settings.youtube && settings.showYoutube !== false && (
                <a
                  href={settings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 hover:bg-amber-600 hover:text-white p-2.5 rounded-lg transition-all text-gray-400 border border-white/5"
                  aria-label="YouTube"
                >
                  <Youtube size={18} />
                </a>
              )}
              {settings.tiktok && settings.showTiktok !== false && (
                <a
                  href={settings.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 hover:bg-amber-600 hover:text-white p-2.5 rounded-lg transition-all text-gray-400 border border-white/5 flex items-center justify-center"
                  aria-label="TikTok"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </a>
              )}
              {settings.zalo && settings.showZalo !== false && (
                <a
                  href={settings.zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 hover:bg-amber-600 hover:text-white p-2.5 rounded-lg transition-all text-gray-400 border border-white/5 flex items-center justify-center"
                  aria-label="Zalo"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="8" fontWeight="black" fill="currentColor" stroke="none">Z</text>
                  </svg>
                </a>
              )}
              {settings.instagram && settings.showInstagram !== false && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 hover:bg-amber-600 hover:text-white p-2.5 rounded-lg transition-all text-gray-400 border border-white/5"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
              )}
              {settings.linkedin && settings.showLinkedin === true && (
                <a
                  href={settings.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 hover:bg-amber-600 hover:text-white p-2.5 rounded-lg transition-all text-gray-400 border border-white/5"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-3 lg:col-start-6 space-y-6">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase border-l-2 border-amber-500 pl-3">Liên Kết Nhanh</h4>
            <ul className="space-y-3.5 text-sm font-sans font-light">
              <li>
                <a href="#home" onClick={(e) => handleLinkClick(e, "#home")} className="hover:text-white transition-colors">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="#services" onClick={(e) => handleLinkClick(e, "#services")} className="hover:text-white transition-colors">
                  Dịch vụ in ấn
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => handleLinkClick(e, "#about")} className="hover:text-white transition-colors">
                  Giới thiệu nhà xưởng
                </a>
              </li>
              <li>
                <a href="#brands" onClick={(e) => handleLinkClick(e, "#brands")} className="hover:text-white transition-colors">
                  Đối tác tin cậy
                </a>
              </li>
              <li>
                <a href="#gallery" onClick={(e) => handleLinkClick(e, "#gallery")} className="hover:text-white transition-colors">
                  Thư viện thực tế
                </a>
              </li>
              <li>
                <a href="#contact" onClick={(e) => handleLinkClick(e, "#contact")} className="hover:text-white transition-colors">
                  Liên hệ báo giá
                </a>
              </li>
            </ul>
          </div>

          {/* Contacts info */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase border-l-2 border-amber-500 pl-3">Trụ sở nhà máy</h4>
            <ul className="space-y-4 text-sm font-sans font-light text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-amber-500 shrink-0" />
                <span className="font-mono text-white font-semibold">{settings.hotline}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-amber-500 shrink-0" />
                <span>{settings.email}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal Copyright and credit line */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs font-sans font-light text-gray-500 gap-4">
          <p>{settings.footer || "© 2026 Công Ty TNHH In Kava Việt Nam. Bảo lưu mọi quyền."}</p>
          <div className="flex gap-6">
            <a href="#home" className="hover:text-gray-400 transition-colors">Chính sách bảo mật</a>
            <a href="#home" className="hover:text-gray-400 transition-colors">Điều khoản dịch vụ</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
