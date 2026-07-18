import React, { useState } from "react";
import { AboutUsConfig } from "../../types";
import { ImageUpload } from "./ImageUpload";
import { Save, Film, AlertCircle } from "lucide-react";

interface AboutUsCMSProps {
  aboutUs: AboutUsConfig;
  token: string;
  refreshData: () => void;
}

export const AboutUsCMS: React.FC<AboutUsCMSProps> = ({
  aboutUs,
  token,
  refreshData,
}) => {
  const [formData, setFormData] = useState<AboutUsConfig>({
    title: aboutUs?.title || "",
    description: aboutUs?.description || "",
    videoUrl: aboutUs?.videoUrl || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/aboutUs", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Cập nhật thông tin About Us thành công!");
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 uppercase">
          CHỈNH SỬA THÔNG TIN ABOUT US (VIDEO)
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Cấu hình video giới thiệu doanh nghiệp, tầm nhìn và sứ mệnh hoạt động
          của công ty.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Tiêu đề About Us
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-gray-900 font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Mô tả giới thiệu ngắn (Hỗ trợ xuống dòng)
            </label>
            <textarea
              rows={6}
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-gray-900 leading-relaxed"
            />
          </div>

          {/* Video Upload Section */}
          <div className="space-y-3.5 pt-4 border-t border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase flex items-center gap-2">
                <Film size={16} className="text-amber-500" /> Video Giới Thiệu
                Doanh Nghiệp
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Hỗ trợ tải lên tệp tin video hoặc dán liên kết video trực tiếp
                (MP4, WebM).
              </p>
            </div>

            <div className="space-y-3">
              <ImageUpload
                value={formData.videoUrl}
                onChange={(url) => setFormData({ ...formData, videoUrl: url })}
                label="Tải lên tệp video từ máy tính"
                token={token}
                acceptVideo={true}
              />

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Liên kết video trực tiếp
                </label>
                <input
                  type="text"
                  placeholder="Nhập liên kết tệp .mp4 trực tuyến..."
                  value={formData.videoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, videoUrl: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
                />
              </div>

              {formData.videoUrl && (
                <div className="rounded-xl overflow-hidden max-w-lg aspect-video border border-gray-200 bg-slate-950 shadow-inner mt-2">
                  <video
                    src={formData.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-150">
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
              {isSaving ? "Đang lưu..." : "Lưu cấu hình"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
