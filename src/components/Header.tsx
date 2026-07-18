import React, { useState, useEffect } from "react";
import { Menu, X, Settings, ArrowRight } from "lucide-react";
import { LogoConfig } from "../types";

interface HeaderProps {
  logo: LogoConfig;
  onNavigateToAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ logo, onNavigateToAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "HOME", href: "#home" },
    { label: "SERVICES", href: "#services" },
    { label: "ABOUT FACTORY", href: "#about" },
    { label: "ABOUT US", href: "#about-us" },
    { label: "BRANDS", href: "#brands" },
    { label: "WORK", href: "#work" },
    { label: "OUR TEAM", href: "#team" },
    { label: "CONTACT", href: "#contact" },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-slate-950/45 backdrop-blur-[3px] shadow-lg shadow-black/30 border-b border-zinc-800/30 py-3.5"
          : "bg-gradient-to-b from-black/60 via-black/25 to-transparent py-5"
      }`}
    >
      <div className="max-w-full mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-14">
          {/* Logo Area */}
          <div className="flex-shrink-0 flex items-center">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, "#home")}
              className="flex items-center gap-2 group"
            >
              {logo.type === "image" && logo.image ? (
                <img
                  src={logo.image}
                  alt="Logo"
                  className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-xl font-black tracking-[0.2em] uppercase font-display transition-colors duration-300 text-white">
                  {logo.text || "INKAVA"}
                  <span className="text-amber-500 font-serif">.</span>
                </span>
              )}
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <div className="flex space-x-7">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative py-1 text-xs uppercase tracking-wider font-semibold transition-colors duration-300 group ${
                    isScrolled
                      ? "text-slate-300 hover:text-amber-500"
                      : "text-white/90 hover:text-amber-400"
                  }`}
                >
                  {item.label}
                  {/* Premium animated bottom bar */}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-amber-500" />
                </a>
              ))}
            </div>

            <div className="h-4 w-[1px] bg-white/10 self-center" />

            <div className="flex items-center gap-3">
              {/* CMS Admin Portal */}
              <button
                id="cms-login-btn"
                onClick={onNavigateToAdmin}
                className={`p-2 rounded-full border transition-all duration-300 hover:scale-105 ${
                  isScrolled
                    ? "border-white/10 text-slate-400 hover:text-amber-500 hover:border-amber-500/30 hover:bg-amber-500/5"
                    : "border-white/15 text-white/80 hover:text-white hover:bg-white/10"
                }`}
                title="Quản trị hệ thống CMS"
              >
                <Settings size={15} />
              </button>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onNavigateToAdmin}
              className={`p-2 rounded-full border transition-colors ${
                isScrolled
                  ? "border-white/10 text-white/85 hover:bg-white/5"
                  : "border-white/15 text-white hover:bg-white/10"
              }`}
              title="CMS Admin"
            >
              <Settings size={16} />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl transition-colors text-white hover:bg-white/10"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-zinc-900 border-b border-zinc-800 shadow-2xl transition-all duration-300"
        >
          <div className="px-5 pt-3 pb-7 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="block px-3.5 py-3 rounded-xl text-sm font-semibold tracking-wide text-slate-300 hover:text-amber-500 hover:bg-white/5 transition-all"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-5 px-3 flex flex-col gap-3">
              <button
                onClick={onNavigateToAdmin}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-3 bg-white/5 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/10 border border-white/10 transition-all"
              >
                <Settings size={14} />
                Quản trị CMS (Đăng nhập)
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
