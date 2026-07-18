import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SettingsConfig } from "../types";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Facebook,
  Youtube,
  Instagram,
  Linkedin,
} from "lucide-react";

interface ContactProps {
  settings: SettingsConfig;
  bgColor?: string;
}

export const Contact: React.FC<ContactProps> = ({ settings, bgColor }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    company: "",
    address: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      setSubmitStatus("error");
      setErrorMessage("Vui lòng điền đầy đủ Họ và tên và Địa chỉ Email.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          fullName: "",
          phone: "",
          email: "",
          company: "",
          address: "",
          message: "",
        });
      } else {
        const errData = await response.json();
        throw new Error(errData.error || "Gửi yêu cầu thất bại.");
      }
    } catch (err: any) {
      setSubmitStatus("error");
      setErrorMessage(
        err.message || "Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-10 scroll-mt-20 transition-colors duration-500"
      style={{ backgroundColor: bgColor || "#f9fafb" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          {/* <span className="text-xs font-bold tracking-widest text-amber-600 bg-amber-500/5 px-3 py-1 rounded-full inline-block mb-3">
            Liên hệ tư vấn
          </span> */}
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight uppercase">
            CONTACT US
          </h2>
          {/* <p className="mt-4 text-base text-gray-600 font-sans font-light">
            Quý khách hàng có nhu cầu in ấn số lượng lớn hoặc tư vấn giải pháp
            bao bì chuyên biệt, vui lòng điền form hoặc liên hệ trực tiếp với
            chúng tôi.
          </p> */}
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 grid grid-cols-1 lg:grid-cols-12">
          {/* Info Side (Left) */}
          <div className="lg:col-span-5 bg-stone-700 text-white p-8 sm:p-10 relative flex flex-col justify-between">
            {/* Ambient Background Blur */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div>
                <h3 className="text-2xl font-black tracking-tight text-white uppercase">
                  INKAVA Joint Stock Company
                </h3>
              </div>

              {/* Contacts info list */}
              <div className="space-y-2">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="bg-white/5 p-3 rounded-2xl text-amber-400 mt-0.5 border border-white/5 shadow-inner">
                    <MapPin size={20} className="stroke-[1.8]" />
                  </div>
                  <div>
                    {/* <h4 className="text-[10px] font-black text-slate-400 tracking-wider uppercase">
                      Địa chỉ văn phòng & nhà xưởng
                    </h4> */}
                    <p className="text-sm text-slate-200 mt-1.5 leading-relaxed font-light">
                      {settings.address}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-4">
                  <div className="bg-white/5 p-3 rounded-2xl text-amber-400 mt-0.5 border border-white/5 shadow-inner">
                    <Phone size={20} className="stroke-[1.8]" />
                  </div>
                  <div>
                    {/* <h4 className="text-[10px] font-black text-slate-400 tracking-wider uppercase">
                      Hotline Kinh doanh (Zalo)
                    </h4> */}
                    <p className="text-xl text-amber-400 font-black mt-1 font-mono tracking-wide">
                      {settings.hotline}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4">
                  <div className="bg-white/5 p-3 rounded-2xl text-amber-400 mt-0.5 border border-white/5 shadow-inner">
                    <Mail size={20} className="stroke-[1.8]" />
                  </div>
                  <div>
                    {/* <h4 className="text-[10px] font-black text-slate-400 tracking-wider uppercase">
                      Email yêu cầu báo giá
                    </h4> */}
                    <p className="text-sm text-slate-200 mt-1.5 font-light hover:text-amber-400 transition-colors">
                      {settings.email}
                    </p>
                  </div>
                </div>

                {/* Operating hours */}
                <div className="flex items-center gap-4">
                  <div className="bg-white/5 p-3 rounded-2xl text-amber-400 mt-0.5 border border-white/5 shadow-inner">
                    <Clock size={20} className="stroke-[1.8]" />
                  </div>
                  <div>
                    {/* <h4 className="text-[10px] font-black text-slate-400 tracking-wider uppercase">
                      Giờ đón khách tư vấn
                    </h4> */}
                    <p className="text-sm text-slate-200 mt-1.5 font-light">
                      08:00 - 18:00 (Hỗ trợ Hotline & Sản xuất 24/7)
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Channels Section */}
              {((settings.facebook && settings.showFacebook !== false) ||
                (settings.youtube && settings.showYoutube !== false) ||
                (settings.tiktok && settings.showTiktok !== false) ||
                (settings.zalo && settings.showZalo !== false) ||
                (settings.instagram && settings.showInstagram !== false) ||
                (settings.linkedin && settings.showLinkedin === true)) && (
                <div className="pt-3 border-t border-white/5">
                  <h4 className="text-[10px] font-black text-amber-50 tracking-wider uppercase mb-3">
                    Connect Social Us
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {settings.facebook && settings.showFacebook !== false && (
                      <a
                        href={settings.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-500 hover:text-slate-950 transition-all duration-300 text-slate-300"
                        title="Facebook"
                      >
                        <Facebook size={18} />
                      </a>
                    )}
                    {settings.youtube && settings.showYoutube !== false && (
                      <a
                        href={settings.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-500 hover:text-slate-950 transition-all duration-300 text-slate-300"
                        title="YouTube"
                      >
                        <Youtube size={18} />
                      </a>
                    )}
                    {settings.tiktok && settings.showTiktok !== false && (
                      <a
                        href={settings.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-500 hover:text-slate-950 transition-all duration-300 text-slate-300 flex items-center justify-center"
                        title="TikTok"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-[18px] h-[18px]"
                        >
                          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                        </svg>
                      </a>
                    )}
                    {settings.zalo && settings.showZalo !== false && (
                      <a
                        href={settings.zalo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-500 hover:text-slate-950 transition-all duration-300 text-slate-300 flex items-center justify-center font-bold text-xs"
                        title="Zalo"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-[18px] h-[18px]"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          <text
                            x="50%"
                            y="55%"
                            dominantBaseline="middle"
                            textAnchor="middle"
                            fontSize="8"
                            fontWeight="black"
                            fill="currentColor"
                            stroke="none"
                          >
                            Z
                          </text>
                        </svg>
                      </a>
                    )}
                    {settings.instagram && settings.showInstagram !== false && (
                      <a
                        href={settings.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-500 hover:text-slate-950 transition-all duration-300 text-slate-300"
                        title="Instagram"
                      >
                        <Instagram size={18} />
                      </a>
                    )}
                    {settings.linkedin && settings.showLinkedin === true && (
                      <a
                        href={settings.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-500 hover:text-slate-950 transition-all duration-300 text-slate-300"
                        title="LinkedIn"
                      >
                        <Linkedin size={18} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Slogan */}
            <div className="pt-3 border-t border-white/5 mt-4 relative z-10 text-[10px] text-slate-500 font-mono tracking-wider uppercase">
              {settings.slogan}
            </div>
          </div>

          {/* Form Side (Right) */}
          <div className="lg:col-span-7 p-8 sm:p-10 bg-white">
            {/* <h3 className="text-xl font-black text-slate-950 tracking-tight mb-8 uppercase">
              GỬI YÊU CẦU TƯ VẤN THIẾT KẾ
            </h3> */}

            <form onSubmit={handleSubmit} className="space-y-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-[10px] font-black text-slate-500 uppercase tracking-wider  "
                  >
                    NAME *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Jonh Doe"
                    required
                    className="w-full px-4.5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-950 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[10px] font-black text-slate-500 uppercase tracking-wider   "
                  >
                    EMAIL *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    required
                    className="w-full px-4.5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-950 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-[10px] font-black text-slate-500 uppercase tracking-wider "
                  >
                    PHONE
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="09xx xxx xxx"
                    className="w-full px-4.5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-950 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                  />
                </div>

                {/* Company */}
                <div>
                  <label
                    htmlFor="company"
                    className="block text-[10px] font-black text-slate-500 uppercase tracking-wider "
                  >
                    COMPANY
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="INKAVA Joint Stock Company"
                    className="w-full px-4.5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-950 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-[10px] font-black text-slate-500 uppercase tracking-wider  "
                >
                  ADDRESS
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4.5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-950 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-[10px] font-black text-slate-500 uppercase tracking-wider  "
                >
                  MESSAGE
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="..."
                  className="w-full px-4.5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-950 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all duration-200 resize-none"
                />
              </div>

              {/* Notification Banner */}
              <AnimatePresence mode="wait">
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-emerald-800">
                        Send request successfully!
                      </p>
                      <p className="text-xs text-emerald-600 mt-1">
                        INKAVA has received your information. Our specialist
                        will call you back to provide consultation as soon as
                        possible.
                      </p>
                    </div>
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3"
                  >
                    <AlertCircle className="h-5 w-5 text-rose-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-rose-800">
                        An error occurred!
                      </p>
                      <p className="text-xs text-rose-600 mt-1">
                        {errorMessage}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-linear-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-bold tracking-wide uppercase rounded-xl shadow-lg shadow-amber-600/20 disabled:bg-gray-400 disabled:shadow-none transition-all duration-300 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Sending information...</span>
                  ) : (
                    <>
                      <span>SEND </span>
                      <Send size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Map Embedding */}
        {settings.googleMaps && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 rounded-3xl overflow-hidden shadow-lg border border-gray-100 h-96 bg-gray-100"
          >
            <iframe
              src={settings.googleMaps}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ chỉ đường tới In Kava"
            />
          </motion.div>
        )}
      </div>
    </section>
  );
};
