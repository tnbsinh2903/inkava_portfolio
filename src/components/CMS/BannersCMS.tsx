import React, { useState } from "react";
import { Banner } from "../../types";
import { ImageUpload } from "./ImageUpload";
import { Plus, Trash2, Edit2, Eye, EyeOff, Save, X, Layers, ArrowUp, ArrowDown } from "lucide-react";

interface BannersCMSProps {
  banners: Banner[];
  token: string;
  onUpdate: (updatedBanners: Banner[]) => void;
  refreshData: () => void;
}

export const BannersCMS: React.FC<BannersCMSProps> = ({ banners, token, onUpdate, refreshData }) => {
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAddModal = () => {
    setEditingBanner({
      title: "",
      description: "",
      buttonText: "Liên Hệ",
      buttonLink: "#contact",
      secondaryButtonText: "Dịch vụ",
      secondaryButtonLink: "#services",
      image: "",
      isVisible: true,
      order: banners.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner || !editingBanner.title || !editingBanner.image) {
      alert("Vui lòng nhập Tiêu đề và hình ảnh Banner.");
      return;
    }

    const isNew = !editingBanner.id;
    const url = isNew ? "/api/admin/banners" : `/api/admin/banners/${editingBanner.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editingBanner)
      });

      if (response.ok) {
        setIsModalOpen(false);
        setEditingBanner(null);
        refreshData();
      } else {
        const data = await response.json();
        alert("Lưu thất bại: " + data.error);
      }
    } catch (err) {
      alert("Có lỗi kết nối hệ thống.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa Banner này không?")) return;

    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        refreshData();
      } else {
        alert("Xóa thất bại.");
      }
    } catch (err) {
      alert("Có lỗi kết nối hệ thống.");
    }
  };

  const handleToggleVisibility = async (banner: Banner) => {
    try {
      const response = await fetch(`/api/admin/banners/${banner.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ isVisible: !banner.isVisible })
      });
      if (response.ok) {
        refreshData();
      }
    } catch (err) {
      alert("Có lỗi kết nối hệ thống.");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === banners.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const listCopy = [...banners];
    
    // Swap order property
    const tempOrder = listCopy[index].order;
    listCopy[index].order = listCopy[targetIndex].order;
    listCopy[targetIndex].order = tempOrder;

    // Send order updates to server
    try {
      await fetch(`/api/admin/banners/${listCopy[index].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ order: listCopy[index].order })
      });
      await fetch(`/api/admin/banners/${listCopy[targetIndex].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ order: listCopy[targetIndex].order })
      });
      refreshData();
    } catch (err) {
      alert("Sắp xếp thứ tự lỗi.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 uppercase">QUẢN LÝ HERO BANNER SLIDER</h2>
          <p className="text-xs text-gray-500 mt-1">Các banner ảnh lớn tự động xoay chuyển trên đầu Landing Page.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all"
        >
          <Plus size={16} />
          Thêm Banner Mới
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
        {banners.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">Không có dữ liệu banner nào.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {banners.map((banner, index) => (
              <div key={banner.id} className="p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="h-20 w-32 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shrink-0">
                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-mono font-medium">Thứ tự: {index + 1}</span>
                      {!banner.isVisible && (
                        <span className="text-xs bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                          <EyeOff size={10} /> Ẩn
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mt-1 line-clamp-1">{banner.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 max-w-xl font-light">{banner.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                  {/* Sorting controls */}
                  <button
                    onClick={() => handleMove(index, "up")}
                    disabled={index === 0}
                    className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg disabled:opacity-20"
                    title="Di chuyển lên"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => handleMove(index, "down")}
                    disabled={index === banners.length - 1}
                    className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg disabled:opacity-20"
                    title="Di chuyển xuống"
                  >
                    <ArrowDown size={16} />
                  </button>

                  {/* Visibility control */}
                  <button
                    onClick={() => handleToggleVisibility(banner)}
                    className={`p-2 rounded-xl border transition-all ${
                      banner.isVisible
                        ? "border-emerald-100 text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                        : "border-gray-200 text-gray-400 hover:bg-gray-50"
                    }`}
                    title={banner.isVisible ? "Ẩn Banner" : "Hiển thị Banner"}
                  >
                    {banner.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>

                  {/* Edit button */}
                  <button
                    onClick={() => handleOpenEditModal(banner)}
                    className="p-2 border border-blue-100 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
                    title="Sửa"
                  >
                    <Edit2 size={16} />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 border border-rose-100 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && editingBanner && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-150 flex justify-between items-center bg-gray-50">
              <h3 className="text-base font-bold text-gray-900 uppercase">
                {editingBanner.id ? "SỬA BẢN TIN HERO BANNER" : "THÊM HERO BANNER MỚI"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Tiêu đề Banner *</label>
                <input
                  type="text"
                  required
                  value={editingBanner.title || ""}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  placeholder="Nhập tiêu đề lớn xuất hiện trên màn hình..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-gray-900"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Mô tả chi tiết</label>
                <textarea
                  rows={3}
                  value={editingBanner.description || ""}
                  onChange={(e) => setEditingBanner({ ...editingBanner, description: e.target.value })}
                  placeholder="Nhập đoạn nội dung mô tả chi tiết dưới tiêu đề..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-gray-900"
                />
              </div>

              {/* Action Button 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Tên nút chính</label>
                  <input
                    type="text"
                    value={editingBanner.buttonText || ""}
                    onChange={(e) => setEditingBanner({ ...editingBanner, buttonText: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-gray-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Liên kết nút chính</label>
                  <input
                    type="text"
                    value={editingBanner.buttonLink || ""}
                    onChange={(e) => setEditingBanner({ ...editingBanner, buttonLink: e.target.value })}
                    placeholder="#contact"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-gray-900"
                  />
                </div>
              </div>

              {/* Action Button 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Tên nút phụ</label>
                  <input
                    type="text"
                    value={editingBanner.secondaryButtonText || ""}
                    onChange={(e) => setEditingBanner({ ...editingBanner, secondaryButtonText: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Liên kết nút phụ</label>
                  <input
                    type="text"
                    value={editingBanner.secondaryButtonLink || ""}
                    onChange={(e) => setEditingBanner({ ...editingBanner, secondaryButtonLink: e.target.value })}
                    placeholder="#services"
                  />
                </div>
              </div>

              {/* Image Upload Component */}
              <ImageUpload
                value={editingBanner.image || ""}
                onChange={(url) => setEditingBanner({ ...editingBanner, image: url })}
                label="Hình nền banner (khuyên dùng tỉ lệ rảnh 16:9) *"
                token={token}
              />

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isVisible"
                  checked={editingBanner.isVisible}
                  onChange={(e) => setEditingBanner({ ...editingBanner, isVisible: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isVisible" className="text-sm font-medium text-gray-700">
                  Hiển thị ngay trên Landing Page
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-150">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-bold transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                >
                  <Save size={16} />
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
