import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WorkItem } from "../types";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";

// DotMatrix decor mirroring the exact technical dots grid in the uploaded photo
const DotMatrix: React.FC<{ dotColor: string }> = ({ dotColor }) => {
  return (
    <div
      className="flex flex-col gap-0.5 select-none font-black text-[8px] tracking-[0.2em] opacity-50 leading-none shrink-0 items-center justify-center"
      style={{ color: dotColor }}
    >
      <div>• • • • • •</div>
      <div>• • •</div>
      <div>•</div>
    </div>
  );
};

interface StyleConfig {
  bg: string;
  text: string;
  dotColor: string;
  label: string;
  color: string;
}

const PRESETS: Record<string, StyleConfig> = {
  waterbased: {
    bg: "bg-[#BCE33A]",
    text: "text-slate-950",
    dotColor: "rgba(15, 23, 42, 0.35)",
    label: "waterbased.",
    color: "#BCE33A",
  },
  rubber: {
    bg: "bg-[#5F65B6]",
    text: "text-white",
    dotColor: "rgba(255, 255, 255, 0.35)",
    label: "rubber.",
    color: "#818CF8",
  },
  glitter: {
    bg: "bg-[#E6DE1C]",
    text: "text-slate-950",
    dotColor: "rgba(15, 23, 42, 0.35)",
    label: "glitter.shimmer.",
    color: "#FACC15",
  },
  glow: {
    bg: "bg-[#484A6A]",
    text: "text-cyan-300",
    dotColor: "rgba(34, 211, 238, 0.35)",
    label: "glow in the dark.",
    color: "#22D3EE",
  },
  split_fountain: {
    bg: "bg-[#00ACD4]",
    text: "text-white",
    dotColor: "rgba(255, 255, 255, 0.35)",
    label: "split fountain.",
    color: "#06B6D4",
  },
  puff: {
    bg: "bg-[#F29424]",
    text: "text-slate-950",
    dotColor: "rgba(15, 23, 42, 0.35)",
    label: "puff.",
    color: "#FB923C",
  },
  metallic: {
    bg: "bg-[#E3294E]",
    text: "text-white",
    dotColor: "rgba(255, 255, 255, 0.35)",
    label: "metallic.",
    color: "#F87171",
  },
  high_density: {
    bg: "bg-[#504099]",
    text: "text-white",
    dotColor: "rgba(251, 191, 36, 0.35)",
    label: "high density.",
    color: "#A78BFA",
  },
  plastisol: {
    bg: "bg-[#E1701A]",
    text: "text-white",
    dotColor: "rgba(255, 255, 255, 0.35)",
    label: "plastisol.",
    color: "#F97316",
  },
  photo_realistic: {
    bg: "bg-[#5C6BC0]",
    text: "text-white",
    dotColor: "rgba(255, 255, 255, 0.35)",
    label: "photo-realistic.",
    color: "#6366F1",
  },
};

const PRESET_KEYS = Object.keys(PRESETS);

interface WorkProps {
  work: WorkItem[];
  bgColor?: string;
}

export const Work: React.FC<WorkProps> = ({ work = [], bgColor }) => {
  const [activeItemIdx, setActiveItemIdx] = useState<number | null>(null);

  if (!work || work.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeItemIdx === null) return;
    setActiveItemIdx((prev) => (prev === 0 ? work.length - 1 : prev! - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeItemIdx === null) return;
    setActiveItemIdx((prev) => (prev === work.length - 1 ? 0 : prev! + 1));
  };

  return (
    <section
      id="work"
      className="w-full pt-20 pb-0 scroll-mt-20 overflow-hidden transition-colors duration-500 bg-[#EDECE9]"
    >
      {/* Section Header */}
      <div className="w-full px-4 sm:px-6 lg:px-12 max-w-[1800px] mx-auto mb-16">
        <div className="text-center max-w-3xl mx-auto">
          {/* <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#11422E] animate-pulse" />
            <span className="text-xs font-black tracking-[0.25em] text-[#11422E] uppercase font-mono">
              WORK ARCHIVE
            </span>
          </div> */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight uppercase leading-none">
            PROJECTS{" "}
          </h2>
          {/* <p className="text-sm sm:text-base text-gray-500 font-normal mt-4 leading-relaxed">
            Danh sách các sản phẩm in ấn và bao bì cao cấp với đa dạng các kỹ
            thuật in ấn hiện đại nhất hiện nay.
          </p> */}
        </div>
      </div>

      {/* Seamless Full-Viewport Grid with exactly 3px white gaps, flat layout (no container borders/paddings) */}
      <div className="bg-white p-[3px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[3px] select-none w-full max-w-none">
        {work.map((item, idx) => {
          // Determine active preset (fall back to repeating keys if 'default' or undefined)
          const chosenPreset =
            item.stylePreset && item.stylePreset !== "default"
              ? item.stylePreset
              : PRESET_KEYS[idx % PRESET_KEYS.length];

          const preset = PRESETS[chosenPreset] || PRESETS.waterbased;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (idx % 4) * 0.05 }}
              onClick={() => setActiveItemIdx(idx)}
              className="w-full h-[280px] sm:h-[260px] relative overflow-hidden bg-zinc-900 group cursor-zoom-in"
            >
              {/* 1. Base Image - fills the entire card container */}
              <img
                src={item.image}
                alt={item.customerName}
                className="absolute inset-0 w-full h-full object-cover transform scale-100 group-hover:scale-[1.04] transition-transform duration-700 ease-out z-0"
                referrerPolicy="no-referrer"
              />

              {/* 2. Seamless Centered Glassmorphism Overlay - Reveals on Hover with light tint to keep the photo clearly visible */}
              <div className="absolute inset-0 w-full h-full bg-slate-950/45 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-all duration-400 ease-in-out z-10 flex flex-col items-center justify-center text-center p-6 text-white">
                {/* Styled Technical Badge Tag */}
                <span
                  className="text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-full border mb-4 shadow-sm backdrop-blur-sm"
                  style={{
                    borderColor: preset.color,
                    color: preset.color,
                    backgroundColor: "rgba(15, 23, 42, 0.4)",
                  }}
                >
                  {preset.label}
                </span>

                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-300 drop-shadow-sm">
                  CLIENT ARCHIVE
                </span>

                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight leading-tight mt-1.5 max-w-full line-clamp-2 px-2 drop-shadow-md">
                  {item.customerName}
                </h3>

                {/* Custom separator line matches technical color swatch */}
                <div
                  className="h-[2px] w-10 my-3.5 transition-transform duration-500 scale-x-50 group-hover:scale-x-100"
                  style={{ backgroundColor: preset.color }}
                />

                <p className="text-xs font-normal text-gray-200 max-w-full line-clamp-2 px-2 leading-relaxed drop-shadow-sm">
                  Ứng dụng:{" "}
                  <span className="font-semibold text-white">
                    {item.application}
                  </span>
                </p>

                {/* Subtly placed decorative dots matrix */}
                <div className="mt-4 opacity-55 scale-90">
                  <DotMatrix dotColor={preset.color} />
                </div>
              </div>

              {/* Quick View zoom indicator corner element */}
              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                  <ZoomIn size={14} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activeItemIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/98 backdrop-blur-xl z-[9999] flex items-center justify-center p-4 md:p-10 select-none"
            onClick={() => setActiveItemIdx(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveItemIdx(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:text-amber-500 hover:scale-105 transition-all duration-200 cursor-pointer flex items-center justify-center shadow-lg"
              title="Close (ESC)"
            >
              <X size={20} />
            </button>

            {/* Previous Button */}
            <button
              onClick={handlePrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:text-amber-500 hover:scale-105 transition-all duration-200 cursor-pointer z-50 flex items-center justify-center shadow-lg"
              title="Previous"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:text-amber-500 hover:scale-105 transition-all duration-200 cursor-pointer z-50 flex items-center justify-center shadow-lg"
              title="Next"
            >
              <ChevronRight size={24} />
            </button>

            {/* Main Image Viewport Area */}
            <div className="max-w-5xl max-h-[80vh] w-full flex flex-col items-center justify-center relative">
              <motion.img
                key={work[activeItemIdx].image}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4 }}
                src={work[activeItemIdx].image}
                alt={work[activeItemIdx].customerName}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/5"
                onClick={(e) => e.stopPropagation()}
                referrerPolicy="no-referrer"
              />

              {/* Title Overlay Info card at the bottom */}
              <div
                className="mt-6 text-center text-white bg-white/5 border border-white/10 backdrop-blur px-8 py-3.5 rounded-2xl max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h4 className="text-lg font-black tracking-tight text-white uppercase">
                  {work[activeItemIdx].customerName}
                </h4>
                <p className="text-xs text-slate-300 font-light mt-1">
                  Ứng dụng: {work[activeItemIdx].application}
                </p>
                <div className="text-[10px] font-mono text-slate-400 mt-2">
                  Hạng mục {activeItemIdx + 1} / {work.length}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
