import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Banner } from "../types";

interface HeroProps {
  banners: Banner[];
}

export const Hero: React.FC<HeroProps> = ({ banners }) => {
  if (!banners || banners.length === 0) {
    return (
      <section
        id="home"
        className="h-[90vh] bg-black flex items-center justify-center text-white"
      >
        <p className="text-xl">Đang tải dữ liệu banner...</p>
      </section>
    );
  }

  const currentBanner = banners[0];

  const handleButtonClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
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
    }
  };

  return (
    <section id="home" className="relative h-screen overflow-hidden bg-black">
      {/* Background Image with Zoom & Fade Animation */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1.02 }}
          transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Neutral dark cinematic overlays (No blue tone) */}
          {/* <div className="absolute inset-0 bg-black/55 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 z-10" /> */}
          <img
            src={currentBanner.image}
            alt={currentBanner.title}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>

      {/* Slide Content */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-center text-center">
        <div className="max-w-4xl text-white mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 sm:space-y-8 flex flex-col items-center"
          >
            {/* Slogan or Pre-title */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.8 }}
              className="inline-flex items-center gap-3 justify-center"
            >
              <span className="h-px w-8 sm:w-12 bg-amber-500" />
              <span className="text-xs sm:text-sm font-black tracking-[0.25em] text-amber-400 uppercase font-mono">
                INKAVA
              </span>
              <span className="h-px w-8 sm:w-12 bg-amber-500" />
            </motion.div>

            {/* Banner Title */}
            <h1 className="text-2xl sm:text-5xl md:text-4xl lg:text-5xl font-semibold   leading-normal uppercase font-sans  text-center max-w-2xl">
              {currentBanner.title}
            </h1>

            {/* Banner Description */}
            <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed font-sans font-light max-w-3xl text-center">
              {currentBanner.description}
            </p>

            {/* Action and Navigation buttons */}
            {((currentBanner.buttonText &&
              currentBanner.buttonText !== "Yêu Cầu Báo Giá") ||
              (currentBanner.secondaryButtonText &&
                currentBanner.secondaryButtonText !== "Dịch Vụ Cao Cấp")) && (
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                {currentBanner.buttonText &&
                  currentBanner.buttonText !== "Yêu Cầu Báo Giá" && (
                    <a
                      href={currentBanner.buttonLink || "#contact"}
                      onClick={(e) =>
                        handleButtonClick(
                          e,
                          currentBanner.buttonLink || "#contact",
                        )
                      }
                      className="px-8 py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-600/20 hover:shadow-amber-600/40 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
                    >
                      {currentBanner.buttonText}
                      <ArrowRight size={14} className="stroke-[2.5]" />
                    </a>
                  )}

                {currentBanner.secondaryButtonText &&
                  currentBanner.secondaryButtonText !== "Dịch Vụ Cao Cấp" && (
                    <a
                      href={currentBanner.secondaryButtonLink || "#services"}
                      onClick={(e) =>
                        handleButtonClick(
                          e,
                          currentBanner.secondaryButtonLink || "#services",
                        )
                      }
                      className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-sm"
                    >
                      {currentBanner.secondaryButtonText}
                    </a>
                  )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
