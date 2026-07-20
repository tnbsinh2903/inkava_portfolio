import React from "react";
import { motion } from "motion/react";
import { TeamMember } from "../types";
import { Mail, Briefcase, User } from "lucide-react";

interface OurTeamProps {
  team: TeamMember[];
  bgColor?: string;
}

export const OurTeam: React.FC<OurTeamProps> = ({ team = [], bgColor }) => {
  if (!team || team.length === 0) return null;

  // Duplicate the list of members multiple times to ensure the marquee fills the screen width and loops seamlessly
  const marqueeItems = [...team];

  return (
    <section
      id="team"
      className="w-full pt-15 pb-10 scroll-mt-20 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: bgColor || "#f8fafc" }}
    >
      <div className="w-full">
        {/* Title Block */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
          {/* <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-black tracking-[0.25em] text-amber-500 uppercase font-mono">
              OUR TEAM
            </span>
          </div> */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight uppercase">
            OUR TEAM
          </h2>
          {/* <p className="text-sm sm:text-base text-gray-400 font-light mt-4 max-w-2xl mx-auto">
            Hội tụ những chuyên gia thiết kế, kỹ sư vận hành in ấn hàng đầu với khát vọng kiến tạo các kiệt tác bao bì thương hiệu.
          </p> */}
        </div>

        {/* Marquee Outer Container */}
        <div className="relative w-full overflow-hidden   select-none">
          {/* Fading side edges for luxury look */}
          {/* <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-linear-to-r from-inherit to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-linear-to-l from-inherit to-transparent z-10 pointer-events-none" /> */}

          {/* Marquee Track - scrolls from left to right w-[200%] md:w-[150%] xl:w-[120%]  animate-[marquee-ltr_10s_linear_infinite] \ animate-marquee-ltr */}
          <div className="   ">
            <div className="   shrink-0 min-w-full flex justify-center flex-wrap gap-2  cursor-pointer py-2">
              {marqueeItems.map((member, idx) => (
                <div
                  key={`${member.id}-${idx}`}
                  className="  w-1/5 bg-white rounded-2xl p-6 border border-slate-200/40 shadow-sm hover:shadow-md hover:border-amber-500/20 transition-all duration-300 flex flex-col items-center text-center group shrink-0 relative overflow-hidden"
                >
                  {/* Subtle top background highlight */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-amber-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Avatar Frame */}
                  <div className="relative h-20 w-20 rounded-2xl overflow-hidden mb-4 bg-slate-100 border border-slate-200 shadow-inner group-hover:scale-105 transition-transform duration-300">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.fullName}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-400 bg-slate-50">
                        <User size={28} />
                      </div>
                    )}
                  </div>

                  {/* Member metadata */}
                  <h3 className="text-base font-bold text-slate-950 group-hover:text-amber-500 transition-colors duration-200 leading-tight">
                    {member.fullName}
                  </h3>

                  {member.position && (
                    <p className="text-[11px] font-bold text-amber-600 uppercase tracking-widest mt-1">
                      {member.position}
                    </p>
                  )}

                  <div className="mt-4 pt-4 border-t border-slate-100 w-full space-y-2">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                      <Briefcase
                        size={13}
                        className="text-slate-400 shrink-0"
                      />
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
                        Bộ phận: {member.department}
                      </span>
                    </div>

                    {member.email && (
                      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 truncate">
                        <Mail size={12} className="text-slate-300 shrink-0" />
                        <span className="font-mono text-[10.5px] lowercase">
                          {member.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
