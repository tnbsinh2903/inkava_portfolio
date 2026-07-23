import React, { useState } from "react";
import { motion } from "motion/react";
import { Service } from "../types";
import { DynamicIcon } from "./Icons";
import {
  ZoomIn,
  ZoomOut,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ServicesProps {
  services: Service[];
}

interface ServiceImagesCarouselProps {
  primaryImage: string;
  extraImages?: string[];
  name: string;
  badge: string;
  onImageClick: (url: string) => void;
}

const ServiceImagesCarousel: React.FC<ServiceImagesCarouselProps> = ({
  primaryImage,
  extraImages = [],
  name,
  badge,
  onImageClick,
}) => {
  const images = [primaryImage, ...extraImages].filter(Boolean);
  const [startIndex, setStartIndex] = useState(0);

  if (images.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStartIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStartIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-2.5 w-full">
      {/* Category Tag & Page Indicators */}
      <div className="flex justify-between items-center">
        {/* <span className="text-[10px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-500 border border-slate-800">
          {badge}
        </span> */}
        {images.length > 2 && (
          <span className="text-[10px] font-mono text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">
            Ảnh {startIndex + 1} & {((startIndex + 1) % images.length) + 1} /{" "}
            {images.length}
          </span>
        )}
      </div>

      <div className="relative group/gallery">
        {images.length === 1 ? (
          <div
            onClick={() => onImageClick(images[0])}
            className="relative h-25 sm:h-60 w-full rounded-xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200/40 cursor-zoom-in group/mainimg"
          >
            <img
              src={images[0]}
              alt={`${name}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover/mainimg:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/mainimg:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <ZoomIn size={14} className="text-white drop-shadow" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {[0, 1].map((offset) => {
              const idx = (startIndex + offset) % images.length;
              const img = images[idx];
              return (
                <div
                  key={offset}
                  onClick={() => onImageClick(img)}
                  className="relative h-25 sm:h-60 rounded-xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200/40 cursor-zoom-in group/mainimg"
                >
                  <img
                    src={img}
                    alt={`${name} - ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/mainimg:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/mainimg:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <ZoomIn size={14} className="text-white drop-shadow" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Navigation Arrows for > 2 images */}
        {images.length > 2 && (
          <div className="absolute -inset-x-3 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
            <button
              onClick={handlePrev}
              className="pointer-events-auto p-1 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-white/10 shadow-md opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-200 cursor-pointer flex items-center justify-center"
              title="Ảnh trước"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={handleNext}
              className="pointer-events-auto p-1 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-white/10 shadow-md opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-200 cursor-pointer flex items-center justify-center"
              title="Ảnh tiếp theo"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const Services: React.FC<ServicesProps> = ({ services }) => {
  const [activeImage, setActiveImage] = useState<{
    name: string;
    url: string;
  } | null>(null);
  const [zoomScale, setZoomScale] = useState(1);

  const handleCertClick = (cert: { name: string; fileUrl: string }) => {
    const isPdf =
      cert.fileUrl.toLowerCase().includes(".pdf") ||
      cert.fileUrl.startsWith("data:application/pdf");
    if (isPdf) {
      window.open(cert.fileUrl, "_blank");
    } else {
      setActiveImage({ name: cert.name, url: cert.fileUrl });
      setZoomScale(1);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 85,
        damping: 15,
      },
    },
  };

  // Dynamic helper to provide highly realistic print specifications for each service type
  const getSpecsForService = (id: string, name: string) => {
    const defaultSpecs = {
      material: "Bao bì Ivory, Couche cao cấp",
      tech: "In offset Heidelberg, Phủ màng bảo vệ",
      badge: "Bao Bì",
    };

    const lowercaseName = name.toLowerCase();

    if (lowercaseName.includes("offset") || id === "s1") {
      return {
        material: "Ivory, Bristol, Couche, Duplex (Định lượng 150-400gsm)",
        tech: "Máy in Heidelberg Speedmaster Đức, Offset 5-6 Màu hoàn hảo",
        badge: "CÔNG NGHỆ CHÍNH",
      };
    }
    if (
      lowercaseName.includes("hộp") ||
      lowercaseName.includes("bao bì") ||
      id === "s2"
    ) {
      return {
        material: "Carton lạnh cứng (1.5-3mm), Giấy mỹ thuật dán bồi cao cấp",
        tech: "Bế định hình thuỷ lực, khay lót nhung/lụa, ép kim sang trọng",
        badge: "HỘP CỨNG CAO CẤP",
      };
    }
    if (
      lowercaseName.includes("catalogue") ||
      lowercaseName.includes("kỷ yếu") ||
      id === "s3"
    ) {
      return {
        material: "Giấy Couche màng bóng/mờ, cán vân chìm cát Nhật Bản",
        tech: "Khâu chỉ keo nhiệt gáy, phủ UV định hình bề mặt nổi bật",
        badge: "ẤN PHẨM CATALOGUE",
      };
    }
    if (
      lowercaseName.includes("tem") ||
      lowercaseName.includes("nhãn") ||
      id === "s4"
    ) {
      return {
        material: "Decal bạc, Decal nhựa trong suốt, Decal vỡ niêm phong",
        tech: "Bế demi chính xác bằng tia laser, chống thấm nước, phủ chống tia UV",
        badge: "TEM NHÃN DECAL",
      };
    }
    if (lowercaseName.includes("túi") || id === "s5") {
      return {
        material: "Giấy Kraft sinh học, Giấy mỹ thuật có gân, Couche bồi",
        tech: "Dập khoen lỗ đồng mắt ngỗng, xỏ quai ruy-băng / dây tơ tằm",
        badge: "TÚI GIẤY QUÀ TẶNG",
      };
    }
    if (lowercaseName.includes("gia công") || id === "s6") {
      return {
        material: "Nhũ vàng kim 24K, Nhũ bạc bóng, Kim tuyến đa sắc",
        tech: "Ép nhiệt ép nhũ trực tiếp, bế nổi logo 3D, thúc nổi vân sần cát",
        badge: "GIA CÔNG SAU IN",
      };
    }

    return defaultSpecs;
  };

  return (
    <section
      id="services"
      className="  pt-20    bg-linear-to-b from-slate-50 to-white scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-3.5"
          >
            {/* <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-black tracking-[0.25em] text-amber-500 uppercase font-mono">
              SERVICES
            </span> */}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight uppercase"
          >
            FEATURED SERVICES
          </motion.h2>
        </div>

        {/* Services List */}
        {services.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            Không tìm thấy dịch vụ nào đang hiển thị.
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="  divide-y divide-slate-200 max-w-5xl mx-auto"
          >
            {services.map((service) => {
              const specs = getSpecsForService(service.id, service.name);
              return (
                <motion.div
                  key={service.id}
                  variants={itemVariants}
                  className="group grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 pt-10 md:pt-12 first:pt-0 items-start md:pb-10"
                >
                  {/* Left Column: Name, Icon, Image, and Certificates */}
                  <div className="md:col-span-5 flex flex-col justify-between gap-5">
                    <div className="space-y-4">
                      {/* Service Title & Icon Header */}
                      <div className="flex items-center gap-3.5">
                        <div className="bg-linear-to-br from-amber-500 to-amber-600 text-slate-950 p-2.5 rounded-xl shadow-md shadow-amber-500/10 flex items-center justify-center shrink-0">
                          <DynamicIcon
                            name={service.icon}
                            className="h-5 w-5 text-slate-950 stroke-[2.2]"
                          />
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-slate-950 uppercase tracking-tight leading-tight">
                          {service.name}
                        </h3>
                      </div>

                      {/* Primary Image Card Carousel */}
                      <ServiceImagesCarousel
                        primaryImage={service.image}
                        extraImages={service.images}
                        name={service.name}
                        badge={specs.badge}
                        onImageClick={(url) =>
                          setActiveImage({ name: service.name, url })
                        }
                      />
                    </div>

                    {/* Certificates and Documents directly in left column */}
                    {service.certificates &&
                      service.certificates.length > 0 && (
                        <div className="space-y-2.5">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                            Certificate
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            {service.certificates.map((cert, cIdx) => {
                              const isPdf =
                                cert.fileUrl.toLowerCase().includes(".pdf") ||
                                cert.fileUrl.startsWith("data:application/pdf");
                              return (
                                <div
                                  key={cIdx}
                                  onClick={() => handleCertClick(cert)}
                                  className="flex items-center gap-2 p-1.5 bg-white hover:bg-amber-50/10 border border-slate-200/60 hover:border-amber-500/30 rounded-xl transition-all cursor-pointer group/cert shadow-sm"
                                >
                                  <div className="h-9 w-9 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0">
                                    {isPdf ? (
                                      <svg
                                        className="w-5 h-5 text-rose-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                        />
                                      </svg>
                                    ) : (
                                      <img
                                        src={cert.fileUrl}
                                        alt={cert.name}
                                        className="h-full w-full object-cover"
                                        referrerPolicy="no-referrer"
                                      />
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-bold text-slate-850 truncate leading-tight group-hover/cert:text-amber-500 transition-colors">
                                      {cert.name}
                                    </p>
                                    <span className="text-[8px] text-slate-400 font-mono uppercase block mt-0.5 tracking-wider">
                                      {isPdf ? "Xem PDF" : "Phóng to"}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Right Column: Detailed descriptions & Specifications */}
                  <div className="flex flex-col justify-between md:col-span-7 gap-6">
                    <div className="space-y-5">
                      {/* Description Main Title */}
                      <h4 className="text-base sm:text-lg font-bold text-slate-900  transition-colors duration-300 leading-snug">
                        {service.descriptionTitle || service.description}
                      </h4>

                      {/* Dot details list */}
                      {service.details && service.details.length > 0 ? (
                        <ul className="space-y-2.5">
                          {service.details.map((detail, dIdx) => (
                            <li
                              key={dIdx}
                              className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600 font-sans font-light leading-relaxed"
                            >
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
                          {service.description}
                        </p>
                      )}

                      {/* Technical specifications */}
                      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 border-t border-slate-200">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                            Chất liệu tối ưu:
                          </span>
                          <span className="text-xs text-slate-700 font-medium leading-normal">
                            {specs.material}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                            Công nghệ gia công:
                          </span>
                          <span className="text-xs text-slate-700 font-medium leading-normal">
                            {specs.tech}
                          </span>
                        </div>
                      </div> */}
                    </div>

                    {/* Action link */}
                    {/* <div className="pt-4 border-t border-slate-200 flex items-center text-[10px] sm:text-xs font-black text-amber-500 group-hover:text-amber-600 tracking-widest uppercase gap-1.5 transition-colors">
                      <a
                        href="#contact"
                        className="hover:underline flex items-center gap-1.5"
                      >
                        Yêu cầu tư vấn thiết kế & báo giá chi tiết
                        <span className="group-hover:translate-x-1.5 transition-transform inline-block">
                          →
                        </span>
                      </a>
                    </div> */}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Gorgeous Zoomable Lightbox Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-between p-4 backdrop-blur-sm">
          {/* Header */}
          <div className="w-full flex-wrap gap-2 flex items-center justify-between max-w-5xl border-b border-white/10 pb-4 text-white">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <h4 className="text-sm font-bold uppercase tracking-wider">
                {activeImage.name}
              </h4>
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
                href={activeImage.url}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                title="Mở trong tab mới"
              >
                <ExternalLink size={20} />
              </a>
              {/* Close Button */}
              <button
                onClick={() => setActiveImage(null)}
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
                src={activeImage.url}
                alt={activeImage.name}
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl select-none"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>

          {/* Footer Guide */}
          {/* <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase pb-2">
            Mẹo: Bạn có thể kéo thả để di chuyển ảnh khi phóng to • Cuộn chuột
            để zoom
          </div> */}
        </div>
      )}
    </section>
  );
};
