import React from "react";
import { motion } from "motion/react";
import { AboutUsConfig } from "../types";

interface AboutUsProps {
  aboutUs: AboutUsConfig;
  bgColor?: string;
}

export const AboutUs: React.FC<AboutUsProps> = ({ aboutUs, bgColor }) => {
  if (!aboutUs) return null;

  const defaultVideoUrl =
    "https://assets.mixkit.co/videos/preview/mixkit-printing-press-running-at-high-speed-42867-large.mp4";
  const videoUrl = aboutUs.videoUrl || defaultVideoUrl;

  return (
    <section
      id="about-us"
      className="w-full py-20 px-4 sm:px-6 lg:px-12 scroll-mt-20 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: bgColor || "#f8fafc" }}
    >
      <div className="w-full max-w-[1200px] mx-auto flex flex-col items-center gap-10 md:gap-14">
        {/* Top: Text Content */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-[900px] flex flex-col items-center text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-black tracking-[0.25em] text-amber-500 uppercase font-mono">
              ABOUT US
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight uppercase leading-tight max-w-2xl">
            {aboutUs.title || "Về Chúng Tôi"}
          </h2>

          <div className="text-sm sm:text-base text-gray-500 font-light leading-relaxed whitespace-pre-line space-y-4 max-w-3xl">
            {aboutUs.description ||
              "Chúng tôi cung cấp các giải pháp bao bì cao cấp nhất..."}
          </div>

          {/* Premium decorative touch */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-slate-200/60 w-full text-left">
            <div className="bg-white/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-sm font-black text-slate-950 uppercase tracking-wider font-display flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Tầm Nhìn
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed font-light">
                Trở thành biểu tượng sản xuất bao bì giấy cao cấp của khu vực,
                mang đến sự hoàn mỹ và đẳng cấp.
              </p>
            </div>
            <div className="bg-white/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-sm font-black text-slate-950 uppercase tracking-wider font-display flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Sứ Mệnh
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed font-light">
                Nâng tầm thương hiệu Việt thông qua từng nét in ấn tinh xảo,
                chất lượng đạt chuẩn G7 toàn cầu.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bottom: Landscape Video (Aspect Ratio 16:9 / 21:9) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-[900px] aspect-video rounded-3xl overflow-hidden bg-slate-900 shadow-xl border border-slate-200/50 relative group"
        >
          <video
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            controls
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Visual gradient overlay on video - only visible when not hovering to avoid blocking controls visually */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none group-hover:opacity-0 transition-opacity" />
        </motion.div>
      </div>
    </section>
  );
};
