import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { AboutFactoryConfig } from "../types";
import {
  Calendar,
  Layers,
  Users,
  TrendingUp,
  Shield,
  Award,
  CheckCircle2,
  Globe,
  Briefcase,
  ZoomIn,
  ZoomOut,
  X,
  ExternalLink,
} from "lucide-react";

interface AboutProps {
  about: AboutFactoryConfig;
  bgColor?: string;
}

const CountUp: React.FC<{
  end: number;
  duration?: number;
  suffix?: string;
}> = ({ end, duration = 1500, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    window.requestAnimationFrame(step);
  }, [end, duration, isInView]);

  return (
    <span ref={ref} className="font-mono">
      {count.toLocaleString("vi-VN")}
      {suffix}
    </span>
  );
};

export const About: React.FC<AboutProps> = ({ about, bgColor }) => {
  if (!about) return null;

  const defaultImages = [
    "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
  ];

  const rawImages =
    about.images && about.images.length > 0 ? about.images : defaultImages;
  // Ensure we have at least 4 images to make a proper L-shape
  const images = [...rawImages];
  while (images.length < 4) {
    images.push(defaultImages[images.length % defaultImages.length]);
  }

  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState(1);

  const [tick, setTick] = useState(0);
  const intervalSeconds = about.imageRotationInterval || 7;

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => prev + 1);
    }, intervalSeconds * 1000);
    return () => clearInterval(timer);
  }, [intervalSeconds]);

  // Select 4 images dynamically based on the current tick to rotate
  const img1 = images[tick % images.length];
  const img2 = images[(tick + 1) % images.length];
  const img3 = images[(tick + 2) % images.length];
  const img4 = images[(tick + 3) % images.length];

  // Previous sequence of 4 images for a gorgeous no-blank/no-gray crossfade
  const prevImg1 = images[(tick - 1 + images.length) % images.length];
  const prevImg2 = images[tick % images.length];
  const prevImg3 = images[(tick + 1) % images.length];
  const prevImg4 = images[(tick + 2) % images.length];

  return (
    <section
      id="about"
      className="w-full min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-12 scroll-mt-20 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: bgColor || "#ffffff" }}
    >
      <div className="w-full max-w-[1600px] mx-auto">
        {/* Desktop / Tablet L-shape grid (grid-cols-3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 xl:gap-4 items-stretch">
          {/* COLUMN 1: Stem of the L (2 Squares) */}
          <div className="hidden sm:flex flex-col gap-6 justify-between lg:h-full">
            {/* Top Square Image */}
            <div
              onClick={() => setActiveImageUrl(img1)}
              className="relative overflow-hidden rounded aspect-square w-full shadow-md border border-slate-200/40 bg-slate-100 flex-1 min-h-55 cursor-zoom-in group/aboutimg"
            >
              <img
                src={prevImg1}
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
                alt="About Factory Back - 1"
              />
              <motion.img
                key={img1}
                src={img1}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
                alt="About Factory - 1"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/aboutimg:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
                <div className="bg-slate-900/80 backdrop-blur text-white p-2.5 rounded-xl border border-white/10 shadow-lg">
                  <ZoomIn size={18} className="text-amber-500" />
                </div>
              </div>
            </div>

            {/* Bottom Square Image */}
            <div
              onClick={() => setActiveImageUrl(img2)}
              className="relative overflow-hidden rounded aspect-square w-full shadow-md border border-slate-200/40 bg-slate-100 flex-1 min-h-64 cursor-zoom-in group/aboutimg"
            >
              <img
                src={prevImg2}
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
                alt="About Factory Back - 2"
              />
              <motion.img
                key={img2}
                src={img2}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
                alt="About Factory - 2"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/aboutimg:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
                <div className="bg-slate-900/80 backdrop-blur text-white p-2.5 rounded-xl border border-white/10 shadow-lg">
                  <ZoomIn size={18} className="text-amber-500" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Spans Column 2 & 3 */}
          <div className="lg:col-span-2 flex flex-col gap-2 justify-between">
            {/* ROW 1: Content Block (Top empty space of the L) */}
            <div className="flex flex-col justify-center space-y-6  ">
              {/* <div className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-black tracking-[0.25em] text-amber-500 uppercase font-mono">
                  ABOUT FACTORY
                </span>
              </div> */}

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight uppercase leading-none">
                {about.title || "Về Nhà Máy In Kava"}
              </h2>

              <p className="text-sm sm:text-base text-gray-500 font-light leading-relaxed whitespace-pre-line max-w-4xl">
                {about.description}
              </p>

              {/* Certifications row */}
              <div className="py-2 space-y-3">
                <h4 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  CAPACITY / MONTH
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  <span className="inline-flex items-center gap-1.5 bg-slate-100/80 backdrop-blur border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl">
                    PRINTING 3,600,000 (pcs)
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-slate-100/80 backdrop-blur border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl">
                    FLEXOGRAPH 10,400,000 (pcs)
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-slate-100/80 backdrop-blur border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl">
                    EMBROIDERY 260,000 (pcs)
                  </span>
                </div>
              </div>
            </div>

            {/* ROW 2: Foot of the L (2 Rectangles) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-stretch">
              {/* Left Rectangle (Cell 2 Row 2) */}
              <div
                onClick={() => setActiveImageUrl(img3)}
                className=" hidden sm:block relative overflow-hidden rounded aspect-square w-full shadow-md border border-slate-200/40 bg-slate-100 flex-1 min-h-64 cursor-zoom-in group/aboutimg"
              >
                <img
                  src={prevImg3}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  alt="About Factory Back - 3"
                />
                <motion.img
                  key={img3}
                  src={img3}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2.2, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  alt="About Factory - 3"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/aboutimg:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
                  <div className="bg-slate-900/80 backdrop-blur text-white p-2.5 rounded-xl border border-white/10 shadow-lg">
                    <ZoomIn size={18} className="text-amber-500" />
                  </div>
                </div>
              </div>

              {/* Right Rectangle (Cell 3 Row 2) */}
              <div
                onClick={() => setActiveImageUrl(img4)}
                className="relative overflow-hidden rounded aspect-square w-full shadow-md border border-slate-200/40 bg-slate-100 flex-1 min-h-64 cursor-zoom-in group/aboutimg"
              >
                <img
                  src={prevImg4}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  alt="About Factory Back - 4"
                />
                <motion.img
                  key={img4}
                  src={img4}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2.2, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  alt="About Factory - 4"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/aboutimg:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
                  <div className="bg-slate-900/80 backdrop-blur text-white p-2.5 rounded-xl border border-white/10 shadow-lg">
                    <ZoomIn size={18} className="text-amber-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Combined Stats counters strip */}
        {about.stats && (
          <div className="mt-16 bg-slate-950 rounded-[2rem] px-6 py-10 md:p-12 text-white shadow-xl relative overflow-hidden border border-white/5">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center">
              {/* 1. Years of Experience */}
              <div className="pt-4 md:pt-0">
                <div className="flex justify-center text-amber-400 mb-2">
                  <Calendar size={24} className="stroke-[1.5]" />
                </div>
                <p className="text-3xl md:text-4xl font-black font-mono text-white">
                  <CountUp
                    end={
                      about.stats.experienceYears !== undefined
                        ? about.stats.experienceYears
                        : new Date().getFullYear() -
                          (about.stats.foundationYear || 2012)
                    }
                    duration={1200}
                    suffix="+"
                  />
                </p>
                <p className="text-[10px] font-black text-gray-400 tracking-wider uppercase mt-2">
                  Years of Experience
                </p>
              </div>

              {/* 2. Global Brands */}
              <div className="pt-4 md:pt-0">
                <div className="flex justify-center text-amber-400 mb-2">
                  <Globe size={24} className="stroke-[1.5]" />
                </div>
                <p className="text-3xl md:text-4xl font-black font-mono text-white">
                  <CountUp
                    end={
                      about.stats.globalBrands !== undefined
                        ? about.stats.globalBrands
                        : 120
                    }
                    suffix="+"
                  />
                </p>
                <p className="text-[10px] font-black text-gray-400 tracking-wider uppercase mt-2">
                  Global Brands
                </p>
              </div>

              {/* 3. Projects Done */}
              <div className="pt-4 md:pt-0">
                <div className="flex justify-center text-amber-400 mb-2">
                  <Briefcase size={24} className="stroke-[1.5]" />
                </div>
                <p className="text-3xl md:text-4xl font-black font-mono text-white">
                  <CountUp
                    end={
                      about.stats.projectsDone !== undefined
                        ? about.stats.projectsDone
                        : 5000
                    }
                    suffix="+"
                  />
                </p>
                <p className="text-[10px] font-black text-gray-400 tracking-wider uppercase mt-2">
                  Projects Done
                </p>
              </div>

              {/* 4. Employees */}
              <div className="pt-4 md:pt-0">
                <div className="flex justify-center text-amber-400 mb-2">
                  <Users size={24} className="stroke-[1.5]" />
                </div>
                <p className="text-3xl md:text-4xl font-black font-mono text-white">
                  <CountUp end={about.stats.employees || 250} suffix="+" />
                </p>
                <p className="text-[10px] font-black text-gray-400 tracking-wider uppercase mt-2">
                  Employees
                </p>
              </div>

              {/* 5. Factory Acreage */}
              <div className="pt-4 md:pt-0 col-span-2 md:col-span-1 lg:col-span-1">
                <div className="flex justify-center text-amber-400 mb-2">
                  <Layers size={24} className="stroke-[1.5]" />
                </div>
                <p className="text-3xl md:text-4xl font-black font-mono text-white">
                  <CountUp end={about.stats.area || 8500} suffix=" m²" />
                </p>
                <p className="text-[10px] font-black text-gray-400 tracking-wider uppercase mt-2">
                  Factory Acreage
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gorgeous Zoomable Lightbox Modal for Factory Images */}
      {activeImageUrl && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-between p-4 backdrop-blur-sm">
          {/* Header */}
          <div className="w-full flex items-center justify-between max-w-5xl border-b border-white/10 pb-4 text-white">
            <div className="flex items-center gap-2.5">
              {/* <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <h4 className="text-sm font-bold uppercase tracking-wider">
                Hình Ảnh Nhà Máy
              </h4> */}
            </div>
            <div className="flex items-center gap-3">
              {/* Zoom Out Button */}
              <button
                onClick={() =>
                  setZoomScale((prev) => Math.max(0.5, prev - 0.25))
                }
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                title="Thu nhỏ"
              >
                <ZoomOut size={20} />
              </button>
              {/* Zoom Level Badge */}
              <span className="text-xs font-mono text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg">
                {Math.round(zoomScale * 100)}%
              </span>
              {/* Zoom In Button */}
              <button
                onClick={() => setZoomScale((prev) => Math.min(3, prev + 0.25))}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                title="Phóng to"
              >
                <ZoomIn size={20} />
              </button>
              {/* Reset Zoom Button */}
              <button
                onClick={() => setZoomScale(1)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer text-xs font-semibold"
                title="Khôi phục zoom"
              >
                100%
              </button>
              {/* Separator */}
              <span className="h-6 w-px bg-white/15" />
              {/* Open in New Tab */}
              <a
                href={activeImageUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                title="Mở trong tab mới"
              >
                <ExternalLink size={20} />
              </a>
              {/* Close Button */}
              <button
                onClick={() => setActiveImageUrl(null)}
                className="p-2 bg-rose-600/20 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl transition-all cursor-pointer"
                title="Đóng"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Image Body with Zoom Scale */}
          <div className="flex-1 w-full flex items-center justify-center overflow-hidden my-4 relative">
            <motion.div
              style={{ scale: zoomScale }}
              drag
              dragConstraints={{
                left: -300,
                right: 300,
                top: -300,
                bottom: 300,
              }}
              dragElastic={0.1}
              className="relative max-w-full max-h-[75vh] flex items-center justify-center cursor-grab active:cursor-grabbing"
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <img
                src={activeImageUrl}
                alt="Factory Detail"
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl select-none"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>

          {/* Footer Guide */}
        </div>
      )}
    </section>
  );
};
