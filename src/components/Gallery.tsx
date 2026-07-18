import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GalleryItem } from "../types";
import { X, ZoomIn, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

interface GalleryProps {
  items: GalleryItem[];
}

export const Gallery: React.FC<GalleryProps> = ({ items }) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((prev) => (prev === null ? 0 : (prev - 1 + items.length) % items.length));
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((prev) => (prev === null ? 0 : (prev + 1) % items.length));
    }
  };

  // Helper to dynamically get realistic categories for the gallery images
  const getCategoryForGalleryItem = (title: string) => {
    const text = title.toLowerCase();
    if (text.includes("máy in") || text.includes("heidelberg") || text.includes("in 6 màu")) {
      return "HỆ THỐNG MÁY IN";
    }
    if (text.includes("bế") || text.includes("hộp cứng") || text.includes("dán hộp") || text.includes("gia công")) {
      return "DÂY CHUYỀN GIA CÔNG";
    }
    if (text.includes("kho") || text.includes("nguyên liệu") || text.includes("giấy")) {
      return "KHO VẬT TƯ CHUẨN FSC";
    }
    if (text.includes("kiểm tra") || text.includes("chất lượng") || text.includes("thành phẩm")) {
      return "KIỂM ĐỊNH CHẤT LƯỢNG";
    }
    return "SẢN PHẨM HOÀN THIỆN";
  };

  return (
    <section id="gallery" className="py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-black tracking-[0.25em] text-amber-500 uppercase font-mono">
              HÌNH ẢNH NHÀ XƯỞNG
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight uppercase">
            HÌNH ẢNH HOẠT ĐỘNG THỰC TẾ
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-500 font-sans font-light leading-relaxed">
            Quy trình vận hành chuyên nghiệp từ khâu chuẩn bị nguyên liệu giấy, in ấn bằng máy offset công suất cao cho đến khâu gia công thủ công bồi bế hộp tinh xảo.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => {
            const category = getCategoryForGalleryItem(item.title);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="relative group h-80 rounded-3xl overflow-hidden cursor-pointer shadow-sm border border-slate-100 bg-slate-50"
                onClick={() => setActivePhotoIndex(index)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Category Badge on Card overlay */}
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur text-slate-900 text-[9px] font-black tracking-widest px-3 py-1 rounded-full border border-slate-200/50 shadow-sm transition-transform duration-500 group-hover:translate-y-0.5">
                  {category}
                </div>

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10">
                  <div className="bg-amber-500 text-white p-3 rounded-2xl w-11 h-11 flex items-center justify-center mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-md">
                    <ZoomIn size={18} className="stroke-[2.5]" />
                  </div>
                  <h4 className="text-white font-bold text-base leading-snug transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 pr-4">
                    {item.title}
                  </h4>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal with high-end dark theme styling */}
      <AnimatePresence>
        {activePhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/98 z-50 flex flex-col items-center justify-center p-4 md:p-8"
            onClick={() => setActivePhotoIndex(null)}
          >
            {/* Upper Info Row */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-white z-10">
              <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                <ImageIcon size={14} className="text-amber-500" />
                <span>THƯ VIỆN ẢNH</span>
                <span>•</span>
                <span className="text-white">
                  {(activePhotoIndex + 1).toString().padStart(2, "0")} / {items.length.toString().padStart(2, "0")}
                </span>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => setActivePhotoIndex(null)}
                className="p-2.5 rounded-full bg-white/5 hover:bg-red-600 text-white transition-colors border border-white/10"
                aria-label="Close Lightbox"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Arrows */}
            {items.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-white/5 hover:bg-amber-500 text-white transition-all border border-white/10 z-20 active:scale-95"
                  aria-label="Previous Photo"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-white/5 hover:bg-amber-500 text-white transition-all border border-white/10 z-20 active:scale-95"
                  aria-label="Next Photo"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Active Image Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              className="max-w-4xl max-h-[75vh] flex flex-col items-center gap-5 relative mt-8"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={items[activePhotoIndex].image}
                alt={items[activePhotoIndex].title}
                className="max-w-full max-h-[65vh] rounded-2xl object-contain shadow-2xl border border-white/5"
                referrerPolicy="no-referrer"
              />
              <div className="text-center text-white px-4">
                <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase font-mono block mb-1">
                  {getCategoryForGalleryItem(items[activePhotoIndex].title)}
                </span>
                <h4 className="font-bold text-lg max-w-2xl leading-relaxed">
                  {items[activePhotoIndex].title}
                </h4>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
