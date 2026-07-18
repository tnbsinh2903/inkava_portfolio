import React, { useState } from "react";
import { AboutFactoryConfig } from "../../types";
import { ImageUpload } from "./ImageUpload";
import {
  Save,
  Calendar,
  Layers,
  Users,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Globe,
  Briefcase,
  Award,
} from "lucide-react";

interface AboutCMSProps {
  about: AboutFactoryConfig;
  token: string;
  onUpdate?: (updatedAbout: AboutFactoryConfig) => void;
  refreshData: () => void;
}

export const AboutCMS: React.FC<AboutCMSProps> = ({
  about,
  token,
  refreshData,
}) => {
  const [formData, setFormData] = useState<AboutFactoryConfig>({
    title: about?.title || "",
    description: about?.description || "",
    images: about?.images || [],
    imageRotationInterval: about?.imageRotationInterval || 5,
    stats: {
      foundationYear: about?.stats?.foundationYear || 2012,
      area: about?.stats?.area || 8500,
      employees: about?.stats?.employees || 250,
      capacity: about?.stats?.capacity || 15,
      experienceYears:
        about?.stats?.experienceYears !== undefined
          ? about?.stats?.experienceYears
          : 14,
      globalBrands:
        about?.stats?.globalBrands !== undefined
          ? about?.stats?.globalBrands
          : 120,
      projectsDone:
        about?.stats?.projectsDone !== undefined
          ? about?.stats?.projectsDone
          : 5000,
    },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  const handleStatChange = (
    key: keyof AboutFactoryConfig["stats"],
    value: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [key]: value,
      },
    }));
  };

  const handleAddImage = (url: string) => {
    if (!url.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), url.trim()],
    }));
    setNewImageUrl("");
  };

  const handleDeleteImage = (indexToDelete: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, idx) => idx !== indexToDelete),
    }));
  };

  const handleMoveImage = (index: number, direction: "up" | "down") => {
    const images = [...(formData.images || [])];
    if (direction === "up" && index > 0) {
      const temp = images[index];
      images[index] = images[index - 1];
      images[index - 1] = temp;
    } else if (direction === "down" && index < images.length - 1) {
      const temp = images[index];
      images[index] = images[index + 1];
      images[index + 1] = temp;
    }
    setFormData((prev) => ({ ...prev, images }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/aboutFactory", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Cập nhật thông tin About Factory thành công!");
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
          CHỈNH SỬA THÔNG TIN ABOUT FACTORY
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Quản lý nội dung, chỉ số thống kê, danh sách hình ảnh trượt tự động và
          chu kỳ quay vòng ảnh.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Tiêu đề chính
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
              Mô tả chi tiết (Hỗ trợ xuống dòng)
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

          {/* Time Rotation Interval configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-amber-50/50 rounded-2xl border border-amber-200/40">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-amber-800 uppercase tracking-wider">
                Tần suất chuyển ảnh (seconds)
              </label>
              <input
                type="number"
                required
                min={1}
                max={60}
                value={formData.imageRotationInterval}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    imageRotationInterval: parseInt(e.target.value) || 5,
                  })
                }
                className="w-full px-3.5 py-2.5 bg-white border border-amber-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Cấu hình thời gian hiển thị tự động của mỗi ảnh (mặc định: 5
                giây).
              </p>
            </div>
          </div>

          {/* Core metrics counter boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-5 bg-gray-50 rounded-2xl border border-gray-200">
            {/* Stat 1 */}
            <div className="space-y-1.5 bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <Calendar size={18} />
                <span className="text-xs font-bold uppercase tracking-wide text-gray-700">
                  Năm thành lập
                </span>
              </div>
              <input
                type="number"
                required
                value={formData.stats.foundationYear}
                onChange={(e) =>
                  handleStatChange(
                    "foundationYear",
                    parseInt(e.target.value) || 0,
                  )
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900"
              />
            </div>

            {/* Stat 2 */}
            <div className="space-y-1.5 bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <Layers size={18} />
                <span className="text-xs font-bold uppercase tracking-wide text-gray-700">
                  Diện tích (m²)
                </span>
              </div>
              <input
                type="number"
                required
                value={formData.stats.area}
                onChange={(e) =>
                  handleStatChange("area", parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900"
              />
            </div>

            {/* Stat 3 */}
            <div className="space-y-1.5 bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <Users size={18} />
                <span className="text-xs font-bold uppercase tracking-wide text-gray-700">
                  Nhân sự (Người)
                </span>
              </div>
              <input
                type="number"
                required
                value={formData.stats.employees}
                onChange={(e) =>
                  handleStatChange("employees", parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900"
              />
            </div>

            {/* Stat 4 */}
            <div className="space-y-1.5 bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <TrendingUp size={18} />
                <span className="text-xs font-bold uppercase tracking-wide text-gray-700">
                  Sản lượng (Tr/Thg)
                </span>
              </div>
              <input
                type="number"
                required
                value={formData.stats.capacity}
                onChange={(e) =>
                  handleStatChange("capacity", parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900"
              />
            </div>

            {/* Stat 5: Years of Experience */}
            <div className="space-y-1.5 bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <Award size={18} />
                <span className="text-xs font-bold uppercase tracking-wide text-gray-700">
                  Số năm kinh nghiệm
                </span>
              </div>
              <input
                type="number"
                required
                value={
                  formData.stats.experienceYears !== undefined
                    ? formData.stats.experienceYears
                    : 14
                }
                onChange={(e) =>
                  handleStatChange(
                    "experienceYears",
                    parseInt(e.target.value) || 0,
                  )
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900"
              />
            </div>

            {/* Stat 6: Global Brands */}
            <div className="space-y-1.5 bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <Globe size={18} />
                <span className="text-xs font-bold uppercase tracking-wide text-gray-700">
                  Thương hiệu đối tác (Global Brands)
                </span>
              </div>
              <input
                type="number"
                required
                value={
                  formData.stats.globalBrands !== undefined
                    ? formData.stats.globalBrands
                    : 120
                }
                onChange={(e) =>
                  handleStatChange(
                    "globalBrands",
                    parseInt(e.target.value) || 0,
                  )
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900"
              />
            </div>

            {/* Stat 7: Projects Done */}
            <div className="space-y-1.5 bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <Briefcase size={18} />
                <span className="text-xs font-bold uppercase tracking-wide text-gray-700">
                  Dự án đã làm (Projects Done)
                </span>
              </div>
              <input
                type="number"
                required
                value={
                  formData.stats.projectsDone !== undefined
                    ? formData.stats.projectsDone
                    : 5000
                }
                onChange={(e) =>
                  handleStatChange(
                    "projectsDone",
                    parseInt(e.target.value) || 0,
                  )
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900"
              />
            </div>
          </div>

          {/* Unlimited Images Manager Block */}
          <div className="space-y-3.5 pt-4 border-t border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase">
                Danh Sách Hình Ảnh Slider ({formData.images?.length || 0})
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Hỗ trợ tải lên không giới hạn số lượng ảnh. Kéo sắp xếp thứ tự
                hiển thị của ảnh.
              </p>
            </div>

            {/* Add Image Tool */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-grow">
                <ImageUpload
                  value={newImageUrl}
                  onChange={(url) => handleAddImage(url)}
                  label="Thêm ảnh mới từ tập tin hoặc chụp hình"
                  token={token}
                />
              </div>
              <div className="flex items-end">
                <div className="flex gap-2 w-full">
                  <input
                    type="text"
                    placeholder="Hoặc dán liên kết ảnh trực tiếp..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-grow px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddImage(newImageUrl)}
                    className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                  >
                    <Plus size={14} /> Thêm
                  </button>
                </div>
              </div>
            </div>

            {/* Images Grid list for drag-free sorting operations */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
              {formData.images?.map((url, index) => (
                <div
                  key={index}
                  className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-inner flex flex-col"
                >
                  {/* Photo area */}
                  <div className="aspect-video w-full relative">
                    <img
                      src={url}
                      alt={`Factory image ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-slate-950/80 text-white text-[10px] font-mono rounded-md">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-2.5 bg-white flex items-center justify-between gap-1.5 border-t border-gray-100">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveImage(index, "up")}
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-amber-100 hover:text-amber-700 text-gray-500 disabled:opacity-30 disabled:hover:bg-gray-50 transition-colors"
                        title="Di chuyển lên trước"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        disabled={index === formData.images.length - 1}
                        onClick={() => handleMoveImage(index, "down")}
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-amber-100 hover:text-amber-700 text-gray-500 disabled:opacity-30 disabled:hover:bg-gray-50 transition-colors"
                        title="Di chuyển xuống sau"
                      >
                        <ArrowDown size={13} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                      title="Xóa hình ảnh"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
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
