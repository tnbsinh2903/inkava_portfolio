import React, { useState } from "react";
import { SectionBgColors } from "../../types";
import { Save, Palette, RefreshCw } from "lucide-react";

interface SectionBgColorsCMSProps {
  colors: SectionBgColors;
  token: string;
  refreshData: () => void;
}

export const SectionBgColorsCMS: React.FC<SectionBgColorsCMSProps> = ({ colors, token, refreshData }) => {
  const [formData, setFormData] = useState<SectionBgColors>({
    aboutFactory: colors?.aboutFactory || "#ffffff",
    aboutUs: colors?.aboutUs || "#f8fafc",
    work: colors?.work || "#ffffff",
    team: colors?.team || "#f8fafc",
    contact: colors?.contact || "#f9fafb"
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const presets = [
    { name: "White Pure", hex: "#ffffff" },
    { name: "Slate Light", hex: "#f8fafc" },
    { name: "Zinc Soft", hex: "#f4f4f5" },
    { name: "Gray Pearl", hex: "#f9fafb" },
    { name: "Amber Wash", hex: "#fffbeb" },
    { name: "Cosmic Dark", hex: "#0f172a" },
    { name: "Night Pitch", hex: "#020617" }
  ];

  const handleColorChange = (key: keyof SectionBgColors, hex: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: hex
    }));
  };

  const handleResetDefaults = () => {
    if (window.confirm("Bạn có chắc chắn muốn khôi phục tất cả màu nền về mặc định không?")) {
      setFormData({
        aboutFactory: "#ffffff",
        aboutUs: "#f8fafc",
        work: "#ffffff",
        team: "#f8fafc",
        contact: "#f9fafb"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/sectionBgColors", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage("Cập nhật màu nền hệ thống thành công!");
        refreshData();
        setTimeout(() => setMessage(""), 3000);
      } else {
        const data = await response.json();
        alert("Cập nhật thất bại: " + data.error);
      }
    } catch (err) {
      alert("Lỗi kết nối.");
    } finally {
      setIsSaving(false);
    }
  };

  const sectionsList: { id: keyof SectionBgColors; label: string; description: string }[] = [
    { id: "aboutFactory", label: "About Factory Section", description: "Màu nền cho mục hồ sơ năng lực nhà máy (L-shaped)." },
    { id: "aboutUs", label: "About Us Section", description: "Màu nền cho mục video giới thiệu tầm nhìn doanh nghiệp." },
    { id: "work", label: "Work Section", description: "Màu nền cho thư viện portfolio dự án nổi bật (Masonry)." },
    { id: "team", label: "Our Team Section", description: "Màu nền cho băng chuyền Carousel ảnh nhân sự (Marquee)." },
    { id: "contact", label: "Contact Section", description: "Màu nền cho form yêu cầu báo giá và bản đồ liên hệ." }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-900 uppercase">CẤU HÌNH MÀU NỀN SECTION (BACKGROUNDS)</h2>
          <p className="text-xs text-gray-500 mt-1">Cá nhân hóa tông màu cho từng khu vực chính ngoài Landing Page để tối ưu hóa tính thẩm mỹ thương hiệu.</p>
        </div>
        <button
          type="button"
          onClick={handleResetDefaults}
          className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <RefreshCw size={14} /> Reset mặc định
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-6 divide-y divide-gray-100">
            {sectionsList.map((sec, idx) => (
              <div key={sec.id} className={`grid grid-cols-1 md:grid-cols-12 gap-6 items-center ${idx > 0 ? "pt-6" : ""}`}>
                <div className="md:col-span-5 space-y-1">
                  <h3 className="text-sm font-black text-gray-900 uppercase flex items-center gap-2">
                    <Palette size={15} className="text-amber-500" />
                    {sec.label}
                  </h3>
                  <p className="text-xs text-gray-400 font-light leading-relaxed">{sec.description}</p>
                </div>

                <div className="md:col-span-7 flex flex-wrap items-center gap-4">
                  {/* Hex input & Color picker */}
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 rounded-xl border border-gray-200 overflow-hidden shadow-inner cursor-pointer">
                      <input
                        type="color"
                        value={formData[sec.id]}
                        onChange={(e) => handleColorChange(sec.id, e.target.value)}
                        className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                      />
                      <div className="h-full w-full" style={{ backgroundColor: formData[sec.id] }} />
                    </div>
                    <input
                      type="text"
                      maxLength={7}
                      value={formData[sec.id]}
                      onChange={(e) => handleColorChange(sec.id, e.target.value)}
                      className="w-28 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono uppercase text-center focus:ring-1 focus:ring-amber-500 text-gray-900"
                    />
                  </div>

                  {/* Quick swatches */}
                  <div className="flex flex-wrap gap-1.5">
                    {presets.map((p) => (
                      <button
                        key={p.hex}
                        type="button"
                        onClick={() => handleColorChange(sec.id, p.hex)}
                        className={`h-6 px-2 rounded border text-[10px] font-semibold transition-all ${
                          formData[sec.id].toLowerCase() === p.hex.toLowerCase()
                            ? "border-amber-500 bg-amber-500/10 text-amber-700"
                            : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
                        }`}
                        title={p.name}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-150">
            <div>
              {message && (
                <p className="text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-150 px-3 py-1.5 rounded-lg">
                  {message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-sm font-bold uppercase tracking-wider shadow-md flex items-center gap-2 disabled:bg-gray-400"
            >
              <Save size={16} />
              {isSaving ? "Đang lưu..." : "Lưu màu nền"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
