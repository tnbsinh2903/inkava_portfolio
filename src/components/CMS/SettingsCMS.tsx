import React, { useState } from "react";
import { LogoConfig, SettingsConfig } from "../../types";
import { ImageUpload } from "./ImageUpload";
import { Save, Settings, Shield, Globe, Share2, MapPin, Phone, Mail } from "lucide-react";

interface SettingsCMSProps {
  settings: SettingsConfig;
  logo: LogoConfig;
  token: string;
  onUpdate: (updatedSettings: SettingsConfig, updatedLogo: LogoConfig) => void;
  refreshData: () => void;
}

export const SettingsCMS: React.FC<SettingsCMSProps> = ({ settings, logo, token, onUpdate, refreshData }) => {
  const [logoConfig, setLogoConfig] = useState<LogoConfig>({ ...logo });
  const [settingsConfig, setSettingsConfig] = useState<SettingsConfig>({ ...settings });
  const [activeTab, setActiveTab] = useState<"general" | "social" | "seo">("general");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      // 1. Save Settings
      const setResponse = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(settingsConfig)
      });

      // 2. Save Logo
      const logoResponse = await fetch("/api/admin/logo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(logoConfig)
      });

      if (setResponse.ok && logoResponse.ok) {
        setMessage("Lưu cấu hình hệ thống thành công!");
        refreshData();
        setTimeout(() => setMessage(""), 3000);
      } else {
        alert("Lưu thất bại.");
      }
    } catch (err) {
      alert("Lỗi kết nối.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSeoChange = (key: keyof SettingsConfig["seo"], value: string) => {
    setSettingsConfig((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 uppercase">CẤU HÌNH HỆ THỐNG (SETTINGS)</h2>
        <p className="text-xs text-gray-500 mt-1">Quản lý toàn bộ thông tin hiển thị ở Logo, thông tin liên lạc, bản đồ và thẻ SEO của Website.</p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => setActiveTab("general")}
          className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === "general"
              ? "border-amber-500 text-amber-500 font-extrabold"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Settings size={16} />
            Thông tin chung & Logo
          </span>
        </button>
        <button
          onClick={() => setActiveTab("social")}
          className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === "social"
              ? "border-amber-500 text-amber-500 font-extrabold"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Share2 size={16} />
            Mạng xã hội
          </span>
        </button>
        <button
          onClick={() => setActiveTab("seo")}
          className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === "seo"
              ? "border-amber-500 text-amber-500 font-extrabold"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Globe size={16} />
            Cấu hình SEO & Metadata
          </span>
        </button>
      </div>

      {/* Form content */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* TAB 1: General & Logo Settings */}
          {activeTab === "general" && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-gray-800 uppercase border-l-2 border-amber-500 pl-2.5">Cấu hình Logo</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Loại Logo hiển thị</label>
                  <div className="flex bg-white rounded-xl p-1 border border-gray-200 w-fit">
                    <button
                      type="button"
                      onClick={() => setLogoConfig({ ...logoConfig, type: "text" })}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        logoConfig.type === "text" ? "bg-amber-500 text-slate-950 font-bold" : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      Dạng Chữ (Text)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogoConfig({ ...logoConfig, type: "image" })}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        logoConfig.type === "image" ? "bg-amber-500 text-slate-950 font-bold" : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      Dạng Ảnh (Image File)
                    </button>
                  </div>
                </div>

                {logoConfig.type === "text" ? (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Văn bản Logo chữ</label>
                    <input
                      type="text"
                      value={logoConfig.text}
                      onChange={(e) => setLogoConfig({ ...logoConfig, text: e.target.value })}
                      placeholder="IN KAVA"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                ) : (
                  <ImageUpload
                    value={logoConfig.image}
                    onChange={(url) => setLogoConfig({ ...logoConfig, image: url })}
                    label="Tải lên ảnh Logo"
                    token={token}
                  />
                )}
              </div>

              <h3 className="text-sm font-bold text-gray-800 uppercase border-l-2 border-amber-500 pl-2.5 pt-4">Thông tin doanh nghiệp</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Tên công ty hiển thị</label>
                  <input
                    type="text"
                    required
                    value={settingsConfig.companyName}
                    onChange={(e) => setSettingsConfig({ ...settingsConfig, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Slogan / Khẩu hiệu</label>
                  <input
                    type="text"
                    required
                    value={settingsConfig.slogan}
                    onChange={(e) => setSettingsConfig({ ...settingsConfig, slogan: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Địa chỉ trụ sở / nhà máy</label>
                <input
                  type="text"
                  required
                  value={settingsConfig.address}
                  onChange={(e) => setSettingsConfig({ ...settingsConfig, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Hotline liên hệ</label>
                  <input
                    type="text"
                    required
                    value={settingsConfig.hotline}
                    onChange={(e) => setSettingsConfig({ ...settingsConfig, hotline: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Email hỗ trợ</label>
                  <input
                    type="email"
                    required
                    value={settingsConfig.email}
                    onChange={(e) => setSettingsConfig({ ...settingsConfig, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Link nhúng Google Maps iframe (src URL)</label>
                <input
                  type="text"
                  value={settingsConfig.googleMaps}
                  onChange={(e) => setSettingsConfig({ ...settingsConfig, googleMaps: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Bản quyền Footer (Copyright)</label>
                <input
                  type="text"
                  required
                  value={settingsConfig.footer}
                  onChange={(e) => setSettingsConfig({ ...settingsConfig, footer: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Social media profile settings */}
          {activeTab === "social" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase border-l-2 border-amber-500 pl-2.5">Hồ sơ Mạng xã hội</h3>
                <p className="text-xs text-gray-500 mt-1">Cấu hình liên kết và bật/tắt hiển thị các kênh mạng xã hội ở phần Thông tin liên hệ và Chân trang (Footer).</p>
              </div>
              
              <div className="space-y-5 bg-gray-50 p-5 rounded-2xl border border-gray-150">
                {/* 1. Facebook */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border-b border-gray-200/60 pb-4">
                  <div className="md:col-span-8 space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Trang Facebook Fanpage</label>
                    <input
                      type="url"
                      value={settingsConfig.facebook}
                      onChange={(e) => setSettingsConfig({ ...settingsConfig, facebook: e.target.value })}
                      placeholder="https://facebook.com/..."
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="md:col-span-4 flex items-center h-10 gap-2 pl-2">
                    <input
                      type="checkbox"
                      id="showFacebook"
                      checked={settingsConfig.showFacebook !== false}
                      onChange={(e) => setSettingsConfig({ ...settingsConfig, showFacebook: e.target.checked })}
                      className="w-4 h-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="showFacebook" className="text-xs font-bold text-gray-600 uppercase tracking-wide cursor-pointer select-none">
                      Hiển thị Facebook
                    </label>
                  </div>
                </div>

                {/* 2. YouTube */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border-b border-gray-200/60 pb-4">
                  <div className="md:col-span-8 space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Kênh YouTube</label>
                    <input
                      type="url"
                      value={settingsConfig.youtube}
                      onChange={(e) => setSettingsConfig({ ...settingsConfig, youtube: e.target.value })}
                      placeholder="https://youtube.com/..."
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="md:col-span-4 flex items-center h-10 gap-2 pl-2">
                    <input
                      type="checkbox"
                      id="showYoutube"
                      checked={settingsConfig.showYoutube !== false}
                      onChange={(e) => setSettingsConfig({ ...settingsConfig, showYoutube: e.target.checked })}
                      className="w-4 h-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="showYoutube" className="text-xs font-bold text-gray-600 uppercase tracking-wide cursor-pointer select-none">
                      Hiển thị YouTube
                    </label>
                  </div>
                </div>

                {/* 3. TikTok */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border-b border-gray-200/60 pb-4">
                  <div className="md:col-span-8 space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Tài khoản TikTok</label>
                    <input
                      type="url"
                      value={settingsConfig.tiktok}
                      onChange={(e) => setSettingsConfig({ ...settingsConfig, tiktok: e.target.value })}
                      placeholder="https://tiktok.com/@..."
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="md:col-span-4 flex items-center h-10 gap-2 pl-2">
                    <input
                      type="checkbox"
                      id="showTiktok"
                      checked={settingsConfig.showTiktok !== false}
                      onChange={(e) => setSettingsConfig({ ...settingsConfig, showTiktok: e.target.checked })}
                      className="w-4 h-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="showTiktok" className="text-xs font-bold text-gray-600 uppercase tracking-wide cursor-pointer select-none">
                      Hiển thị TikTok
                    </label>
                  </div>
                </div>

                {/* 4. Zalo */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border-b border-gray-200/60 pb-4">
                  <div className="md:col-span-8 space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Tài khoản Zalo (Link hoặc SĐT)</label>
                    <input
                      type="text"
                      value={settingsConfig.zalo || ""}
                      onChange={(e) => setSettingsConfig({ ...settingsConfig, zalo: e.target.value })}
                      placeholder="https://zalo.me/0963224084"
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="md:col-span-4 flex items-center h-10 gap-2 pl-2">
                    <input
                      type="checkbox"
                      id="showZalo"
                      checked={settingsConfig.showZalo !== false}
                      onChange={(e) => setSettingsConfig({ ...settingsConfig, showZalo: e.target.checked })}
                      className="w-4 h-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="showZalo" className="text-xs font-bold text-gray-600 uppercase tracking-wide cursor-pointer select-none">
                      Hiển thị Zalo
                    </label>
                  </div>
                </div>

                {/* 5. Instagram */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border-b border-gray-200/60 pb-4">
                  <div className="md:col-span-8 space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Tài khoản Instagram</label>
                    <input
                      type="url"
                      value={settingsConfig.instagram || ""}
                      onChange={(e) => setSettingsConfig({ ...settingsConfig, instagram: e.target.value })}
                      placeholder="https://instagram.com/..."
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="md:col-span-4 flex items-center h-10 gap-2 pl-2">
                    <input
                      type="checkbox"
                      id="showInstagram"
                      checked={settingsConfig.showInstagram !== false}
                      onChange={(e) => setSettingsConfig({ ...settingsConfig, showInstagram: e.target.checked })}
                      className="w-4 h-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="showInstagram" className="text-xs font-bold text-gray-600 uppercase tracking-wide cursor-pointer select-none">
                      Hiển thị Instagram
                    </label>
                  </div>
                </div>

                {/* 6. LinkedIn */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end pb-2">
                  <div className="md:col-span-8 space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Trang doanh nghiệp LinkedIn</label>
                    <input
                      type="url"
                      value={settingsConfig.linkedin || ""}
                      onChange={(e) => setSettingsConfig({ ...settingsConfig, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/company/..."
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="md:col-span-4 flex items-center h-10 gap-2 pl-2">
                    <input
                      type="checkbox"
                      id="showLinkedin"
                      checked={settingsConfig.showLinkedin === true}
                      onChange={(e) => setSettingsConfig({ ...settingsConfig, showLinkedin: e.target.checked })}
                      className="w-4 h-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="showLinkedin" className="text-xs font-bold text-gray-600 uppercase tracking-wide cursor-pointer select-none">
                      Hiển thị LinkedIn
                    </label>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: SEO Configuration */}
          {activeTab === "seo" && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-gray-800 uppercase border-l-2 border-amber-500 pl-2.5">Thẻ SEO & Tối ưu hóa tìm kiếm</h3>
              
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">SEO Title (Tiêu đề tìm kiếm) *</label>
                <input
                  type="text"
                  required
                  value={settingsConfig.seo.title}
                  onChange={(e) => handleSeoChange("title", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">SEO Description (Đoạn mô tả ngắn tìm kiếm) *</label>
                <textarea
                  rows={4}
                  required
                  value={settingsConfig.seo.description}
                  onChange={(e) => handleSeoChange("description", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">SEO Keywords (Từ khóa, phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={settingsConfig.seo.keywords}
                  onChange={(e) => handleSeoChange("keywords", e.target.value)}
                  placeholder="in offset, in bao bi, nha may in..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <ImageUpload
                value={settingsConfig.seo.ogImage}
                onChange={(url) => handleSeoChange("ogImage", url)}
                label="Ảnh Open Graph (Chia sẻ lên Facebook/Zalo) *"
                token={token}
              />
            </div>
          )}

          {/* Footer Save Row */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-150">
            <div>
              {message && (
                <p className="text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-150 px-3 py-1.5 rounded-lg animate-fade-in">
                  {message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl text-sm font-black uppercase tracking-wider shadow-md flex items-center gap-2 disabled:bg-gray-400 cursor-pointer"
            >
              <Save size={16} />
              {isSaving ? "Đang lưu..." : "Lưu cấu hình"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
