import React, { useState } from "react";
import { GalleryItem } from "../../types";
import { ImageUpload } from "./ImageUpload";
import { Plus, Trash2, Edit2, Save, X, ZoomIn } from "lucide-react";

interface GalleryCMSProps {
  gallery: GalleryItem[];
  token: string;
  onUpdate: (updatedGallery: GalleryItem[]) => void;
  refreshData: () => void;
}

export const GalleryCMS: React.FC<GalleryCMSProps> = ({ gallery, token, onUpdate, refreshData }) => {
  const [editingItem, setEditingItem] = useState<Partial<GalleryItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingItem({ title: "", image: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title || !editingItem.image) {
      alert("Vui lòng nhập đầy đủ tiêu đề ảnh và chọn/tải ảnh lên.");
      return;
    }

    const isNew = !editingItem.id;
    const url = isNew ? "/api/admin/gallery" : `/api/admin/gallery/${editingItem.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editingItem)
      });

      if (response.ok) {
        setIsModalOpen(false);
        setEditingItem(null);
        refreshData();
      } else {
        const data = await response.json();
        alert("Lưu thất bại: " + data.error);
      }
    } catch (err) {
      alert("Lỗi kết nối.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa bức ảnh này khỏi thư viện?")) return;

    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) refreshData();
    } catch (err) {
      alert("Lỗi kết nối.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 uppercase">THƯ VIỆN ẢNH NHÀ MÁY (GALLERY)</h2>
          <p className="text-xs text-gray-500 mt-1">Các bức ảnh chụp thực tế nhà xưởng, máy in, kho hàng, bốc dỡ hàng.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase shadow-md transition-all"
        >
          <Plus size={16} />
          Tải Lên Ảnh Mới
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {gallery.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm col-span-full">Thư viện trống. Hãy tải ảnh lên.</div>
        ) : (
          gallery.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-150 shadow-sm relative group">
              <div className="h-48 w-full overflow-hidden bg-gray-50 relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                
                {/* Overlay actions on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2.5">
                  <button
                    onClick={() => setPreviewImage(item.image)}
                    className="p-2 bg-white/10 hover:bg-white/25 text-white rounded-xl border border-white/15"
                    title="Xem phóng to"
                  >
                    <ZoomIn size={16} />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 bg-white text-blue-600 rounded-xl hover:bg-gray-100"
                    title="Đổi tên"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-3.5 bg-white border-t border-gray-50">
                <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{item.title}</h4>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Rename Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-150 flex justify-between items-center bg-gray-50">
              <h3 className="text-sm font-bold text-gray-900 uppercase">
                {editingItem.id ? "ĐỔI TÊN HÌNH ẢNH" : "TẢI LÊN ẢNH THƯ VIỆN MỚI"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Tiêu đề / Caption ảnh *</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Ví dụ: Máy in Heidelberg Speedmaster..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900"
                />
              </div>

              <ImageUpload
                value={editingItem.image || ""}
                onChange={(url) => setEditingItem({ ...editingItem, image: url })}
                label="Tập tin ảnh *"
                token={token}
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-150">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4.5 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <Save size={14} />
                  Lưu cấu hình
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setPreviewImage(null)}>
          <button className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/10">
            <X size={24} />
          </button>
          <img src={previewImage} alt="Preview" className="max-w-full max-h-[85vh] rounded-lg object-contain border border-white/10" referrerPolicy="no-referrer" />
        </div>
      )}
    </div>
  );
};
