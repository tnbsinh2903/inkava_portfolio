import React from "react";
import { motion } from "motion/react";
import { Brand } from "../types";

// Brand vector SVGs and stylized components to replicate the uploaded image exactly
const NikeLogo = () => (
  <svg
    viewBox="0 0 100 40"
    className="w-20 h-10 text-white fill-current"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M15 12c15 8 45 10 75-3-25 12-55 15-70 12-5-1-8-5-5-9z" />
  </svg>
);

const JordanLogo = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-11 h-11 text-white fill-current"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M53.18 16.82c0-2.1-1.7-3.81-3.8-3.81s-3.81 1.71-3.81 3.81c0 2.1 1.71 3.8 3.81 3.8s3.8-1.7 3.8-3.8zm-22.31 43.1c1.32-.47 2.13-1.62 2.58-2.97l3.85-11.45-6.52.88c-.62.08-.94.71-.7 1.25l3.29 6.22-2.5 6.07zm14.81-22.6l4.24-12.59c.47-1.4 1.73-2.34 3.2-2.34h2.15l-1.92 14.93-7.67 19.34c-.45 1.13-1.55 1.86-2.76 1.86s-2.31-.73-2.76-1.86l-7.67-19.34-1.92-14.93h2.15c1.47 0 2.73.94 3.2 2.34l4.24 12.59 2.87 7.07zM69.13 59.92l-2.5-6.07 3.29-6.22c.24-.54-.08-1.17-.7-1.25l-6.52-.88 3.85 11.45c.45 1.35 1.26 2.5 2.58 2.97z" />
  </svg>
);

const LacosteLogo = () => (
  <svg
    viewBox="0 0 100 40"
    className="w-22 h-10 text-white fill-current"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M85 18c-2.5-1.5-7.5-1-11-2.5s-3.5-4-7.5-4c-4.5 0-6.5 2.5-9 2.5s-5.5-2.5-10-2.5c-6.5 0-11 4.5-11 10s3 8 9 8c3.5 0 4.5-2.5 9-2.5s4.5 1.5 9 1.5c6.5 0 10-2.5 13-5s6.5-2.5 10-2.5c2.5 0 4.5 1 7.5-1s1-3.5 0-4.5zm-41 3.5c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z" />
  </svg>
);

const PumaLogo = () => (
  <div className="flex items-center gap-1.5 text-white">
    <svg
      viewBox="0 0 24 24"
      className="w-7 h-7 text-white fill-current"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 8c-3 0-5.5 2.5-6 5l-5 2.5c-1.2.6-2 1.8-2 3s1.2 2 2.5 2 2.5-1.2 3-2.5l5-2.5c.6-.6 1.8-1.2 2.5-1.2s1.2.6 1.2 1.2c0 .6-.6 1.2-1.2 1.8.6 0 1.2-.6 1.2-1.2s.6-2 .6-2.5c0-1.2-1.2-2.5-3-2.5z" />
    </svg>
    <span className="text-sm font-sans font-black tracking-[0.2em] uppercase leading-none">
      PUMA
    </span>
  </div>
);

const VictoriasSecretLogo = () => (
  <div className="flex flex-col items-center justify-center text-white text-center">
    <span className="text-xs font-serif tracking-[0.2em] font-bold leading-none">
      VICTORIA'S
    </span>
    <span className="text-[10px] font-serif tracking-[0.3em] font-medium leading-none mt-1">
      SECRET
    </span>
  </div>
);

const EA7Logo = () => (
  <div className="flex items-center gap-1.5 text-white">
    <span className="text-xl font-serif font-black tracking-tighter leading-none">
      E<span className="text-xs align-super font-normal italic">X</span>A
    </span>
    <div className="flex flex-col justify-center border-l border-white/20 pl-1.5 leading-none">
      <span className="text-xs font-sans tracking-[0.1em] text-white/50 leading-none">
        EMPORIO ARMANI
      </span>
      <span className="text-xs font-sans font-bold tracking-wider leading-none mt-0.5">
        EA7
      </span>
    </div>
  </div>
);

const GuessLogo = () => (
  <div className="flex flex-col items-center justify-center text-white text-center">
    <span className="text-sm font-sans font-black tracking-[0.25em] leading-none">
      GUESS
    </span>
    <span className="text-[7px] font-mono tracking-[0.35em] text-white/50 uppercase mt-1">
      LOS ANGELES
    </span>
  </div>
);

const ArenaLogo = () => (
  <div className="flex flex-col items-center justify-center text-white gap-1">
    <div className="flex gap-0.5 items-center">
      <div className="w-2 h-2 rotate-45 border-2 border-white" />
      <div className="w-2.5 h-2.5 rotate-45 border-2 border-white -mt-1" />
      <div className="w-2 h-2 rotate-45 border-2 border-white" />
    </div>
    <span className="text-xs font-sans font-bold tracking-[0.15em] lowercase leading-none">
      arena
    </span>
  </div>
);

const OakleyLogo = () => (
  <div className="flex flex-col items-center justify-center text-white gap-1">
    <svg
      viewBox="0 0 100 40"
      className="w-14 h-5 text-white fill-current"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M50 10c-15 0-25 4-25 10s10 10 25 10 25-4 25-10-10-10-25-10zm0 15c-10 0-15-2-15-5s5-5 15-5 15 2 15 5-5 5-15 5z" />
    </svg>
    <span className="text-[8px] font-sans font-black tracking-[0.3em] uppercase leading-none">
      OAKLEY
    </span>
  </div>
);

const ChampionLogo = () => (
  <div className="flex items-center justify-center text-white gap-1 font-serif italic">
    <span className="text-xl font-black tracking-tighter leading-none pr-0.5 border-r border-white/20">
      C
    </span>
    <span className="text-xs font-bold tracking-wider leading-none pl-1">
      Champion
    </span>
  </div>
);

const WedzeLogo = () => (
  <div className="flex flex-col items-center justify-center text-white text-center">
    <span className="text-sm font-sans font-black tracking-wide italic leading-none">
      Wed'ze
    </span>
    <div className="flex gap-1 mt-1 justify-center">
      <div className="w-1.5 h-1.5 rounded-full bg-white" />
      <div className="w-2.5 h-1.5 rounded-full bg-white" />
      <div className="w-1.5 h-1.5 rounded-full bg-white" />
    </div>
  </div>
);

const FilaLogo = () => (
  <div className="flex items-center justify-center gap-1 font-sans font-black text-xl italic tracking-tighter">
    <span className="text-white border-b-4 border-white leading-none">F</span>
    <span className="text-white leading-none">I</span>
    <span className="text-white leading-none">L</span>
    <span className="text-white leading-none">A</span>
  </div>
);

const ColumbiaLogo = () => (
  <div className="flex items-center gap-2 text-white">
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6 fill-current text-white"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm0 6h4v4h-4v-4zm-6 0h4v4H4v-4zm12-6h4v4h-4V4zm0 6h4v4h-4v-4zm-6 6h4v4h-4v-4zm-6 0h4v4H4v-4z" />
    </svg>
    <span className="text-xs font-sans font-black tracking-widest uppercase">
      Columbia
    </span>
  </div>
);

const PetitBateauLogo = () => (
  <div className="flex flex-col items-center justify-center text-white text-center gap-1">
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6 stroke-current text-white fill-none stroke-[2]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14h8l-4 4zM12 6v8" />
    </svg>
    <span className="text-[7px] font-sans font-black tracking-widest uppercase leading-none">
      PETIT BATEAU
    </span>
  </div>
);

const HurleyLogo = () => (
  <div className="flex flex-col items-center justify-center text-white">
    <svg
      viewBox="0 0 100 40"
      className="w-16 h-8 text-white fill-current"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M35 10c0 0 10 8 15 10 5-2 15-10 15-10s-5 12-5 20c0 0 5 8 5 10 0 0-10-8-15-10-5 2-15 10-15 10s5-12 5-20c0 0-5-8-5-10z" />
    </svg>
  </div>
);

const QuechuaLogo = () => (
  <div className="flex items-center gap-1.5 text-white">
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5 stroke-current text-white fill-none stroke-[2.5]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 14l5-5 5 5 6-6" />
    </svg>
    <span className="text-xs font-sans font-black tracking-widest uppercase italic">
      Quechua
    </span>
  </div>
);

const OlaianLogo = () => (
  <div className="flex items-center gap-1.5 text-white">
    <span className="text-xs font-sans font-black tracking-[0.2em] uppercase">
      OLAIAN
    </span>
    <svg
      viewBox="0 0 24 24"
      className="w-3.5 h-3.5 fill-current text-white"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="8" className="opacity-40" />
      <path d="M12 6a6 6 0 0 1 6 6h-6V6z" />
    </svg>
  </div>
);

const NabaijiLogo = () => (
  <div className="flex items-center gap-1 text-white text-center">
    <span className="text-xs font-sans font-bold tracking-wide lowercase">
      nabaiji
    </span>
    <div className="flex gap-0.5">
      <div className="w-1 h-1 rounded-full bg-white" />
      <div className="w-1.5 h-1.5 rounded-full bg-white" />
    </div>
  </div>
);

const ConverseLogo = () => (
  <div className="flex flex-col items-center justify-center text-white gap-1">
    <div className="flex items-center gap-1">
      <svg
        viewBox="0 0 24 24"
        className="w-6 h-6 fill-current text-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 14.5l-2.5-1.5-2.5 1.5.8-3-2.3-2 3-.2L11 8.5l1.5 2.8 3 .2-2.3 2 .8 3z" />
      </svg>
    </div>
    <span className="text-[8px] font-sans font-black tracking-[0.25em] uppercase leading-none">
      CONVERSE
    </span>
  </div>
);

const LevisLogo = () => (
  <div className="bg-white text-[#11422E] font-sans font-black text-[10px] tracking-widest px-3 py-1.5 rounded-b-md rounded-tr-md uppercase shadow-sm flex items-center justify-center">
    LEVI'S
  </div>
);

const KalenjiLogo = () => (
  <div className="flex items-center gap-1.5 text-white">
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5 fill-none stroke-current stroke-[2.5]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5 12c4-4 8-4 14 0" />
      <path d="M5 8c4-2 8-2 14 0" />
    </svg>
    <span className="text-xs font-sans font-bold tracking-wide italic leading-none">
      Kalenji
    </span>
  </div>
);

const DomyosLogo = () => (
  <div className="flex flex-col items-center justify-center text-white">
    <span className="text-xs font-sans font-black tracking-[0.2em] uppercase leading-none">
      DOMYOS
    </span>
  </div>
);

const HbiLogo = () => (
  <div className="flex items-center justify-center text-white">
    <span className="text-lg font-serif tracking-tight font-black leading-none italic">
      Hbi
    </span>
  </div>
);

const WellLogo = () => (
  <div className="flex items-center justify-center text-white">
    <span className="text-base font-serif italic tracking-wide font-medium leading-none">
      Well
    </span>
  </div>
);

const DimLogo = () => (
  <div className="border border-white px-3.5 py-1 text-white font-sans font-black text-xs tracking-[0.15em] uppercase rounded-sm flex items-center justify-center">
    DIM
  </div>
);

const CamaieuLogo = () => (
  <div className="flex items-center justify-center text-white">
    <span className="text-[11px] font-sans font-black tracking-[0.25em] uppercase leading-none">
      CAMAÏEU
    </span>
  </div>
);

const AdoreMeLogo = () => (
  <div className="flex flex-col items-center justify-center text-white text-center">
    <span className="text-xs font-serif tracking-widest font-black italic leading-none">
      ADORE ME
    </span>
    <span className="h-[1px] w-12 bg-white/40 mt-1" />
  </div>
);

const CarrefourLogo = () => (
  <div className="flex flex-col items-center justify-center text-white gap-1">
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6 fill-current text-white"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19 12c-1.5 0-2.5-1-2.5-2.5S17.5 7 19 7s2.5 1 2.5 2.5S20.5 12 19 12zM5 12c1.5 0 2.5-1 2.5-2.5S6.5 7 5 7 2.5 8 2.5 9.5 3.5 12 5 12z"
        className="opacity-30"
      />
      <path d="M12 3l-6 6h12zM12 21l6-6H6z" />
    </svg>
    <span className="text-[7.5px] font-sans font-black tracking-widest uppercase leading-none">
      Carrefour
    </span>
  </div>
);

const WalmartLogo = () => (
  <div className="flex items-center gap-1.5 text-white">
    <span className="text-xs font-sans font-black tracking-tight leading-none uppercase">
      Walmart
    </span>
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4 fill-current text-amber-400"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2v6M12 16v6M5 5l4.5 4.5M14.5 14.5L19 19M5 19l4.5-4.5M14.5 9.5L19 5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

const AmazonLogo = () => (
  <div className="flex flex-col items-center justify-center text-white">
    <span className="text-xs font-sans font-black tracking-wide lowercase leading-none">
      amazon
    </span>
    <svg
      viewBox="0 0 24 24"
      className="w-8 h-2 fill-current text-amber-500"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 2c4 3 14 3 18 0-2 2-7 4-10 4S4 4 3 2z" />
    </svg>
  </div>
);

// Define mapping of 30 exact logos matching the user-uploaded graphic for use in Brands and CMS
export const BRAND_PRESET_MAP: Record<string, React.ReactNode> = {
  "preset:nike": <NikeLogo />,
  "preset:jordan": <JordanLogo />,
  "preset:lacoste": <LacosteLogo />,
  "preset:puma": <PumaLogo />,
  "preset:vs": <VictoriasSecretLogo />,
  "preset:ea7": <EA7Logo />,
  "preset:guess": <GuessLogo />,
  "preset:arena": <ArenaLogo />,
  "preset:oakley": <OakleyLogo />,
  "preset:champion": <ChampionLogo />,
  "preset:wedze": <WedzeLogo />,
  "preset:fila": <FilaLogo />,
  "preset:columbia": <ColumbiaLogo />,
  "preset:petitbateau": <PetitBateauLogo />,
  "preset:hurley": <HurleyLogo />,
  "preset:quechua": <QuechuaLogo />,
  "preset:olaian": <OlaianLogo />,
  "preset:nabaiji": <NabaijiLogo />,
  "preset:converse": <ConverseLogo />,
  "preset:levis": <LevisLogo />,
  "preset:kalenji": <KalenjiLogo />,
  "preset:domyos": <DomyosLogo />,
  "preset:hbi": <HbiLogo />,
  "preset:well": <WellLogo />,
  "preset:dim": <DimLogo />,
  "preset:camaieu": <CamaieuLogo />,
  "preset:adoreme": <AdoreMeLogo />,
  "preset:carrefour": <CarrefourLogo />,
  "preset:walmart": <WalmartLogo />,
  "preset:amazon": <AmazonLogo />,
};

interface BrandsProps {
  brands?: Brand[];
}

export const Brands: React.FC<BrandsProps> = ({ brands = [] }) => {
  const visibleBrands = brands.filter((brand) => brand.isVisible);

  return (
    <section
      id="brands"
      className="pt-10 pb-10 bg-[#11422E] text-white scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-10">
          {/* <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-1 w-1 rounded-full bg-amber-400 animate-pulse" />
            <p className="text-xs font-black tracking-[0.25em] text-amber-400 uppercase font-mono">ĐỐI TÁC KHÁCH HÀNG</p>
          </div> */}
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight max-w-3xl mx-auto leading-tight">
            BRANDS WE'VE PRODUCED FOR{" "}
          </h3>
          {/* <p className="text-xs sm:text-sm text-gray-300 font-light mt-2 max-w-xl mx-auto">
            Hân hạnh đồng hành sản xuất bao bì cao cấp phục vụ hàng triệu người
            tiêu dùng toàn cầu.
          </p> */}
        </div>

        {/* 5-Column Grid on Desktop, matching the user photo exactly */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-12 gap-x-8 md:gap-y-4   items-center justify-items-center">
          {visibleBrands.map((brand, idx) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 10) * 0.03, duration: 0.5 }}
              className="flex items-center justify-center w-full h-16 hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center justify-center transform hover:brightness-110 transition-all duration-300">
                {brand.logo.startsWith("preset:") ? (
                  BRAND_PRESET_MAP[brand.logo] || (
                    <span className="text-xs text-white/50">{brand.name}</span>
                  )
                ) : (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-h-12 max-w-[120px] object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center text-[12px] text-gray-300 mt-8">
          *Production experience across global brands
        </div>
      </div>
    </section>
  );
};
