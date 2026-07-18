import React, { useState } from "react";
import { Brand } from "../../types";
import { ImageUpload } from "./ImageUpload";
import { Plus, Trash2, Edit2, Eye, EyeOff, Save, X, ArrowUp, ArrowDown } from "lucide-react";
import { BRAND_PRESET_MAP } from "../Brands";

interface BrandsCMSProps {
  brands: Brand[];
  token: string;
  onUpdate: (updatedBrands: Brand[]) => void;
  refreshData: () => void;
}

export const BrandsCMS: React.FC<BrandsCMSProps> = ({ brands, token, onUpdate, refreshData }) => {
  const [editingBrand, setEditingBrand] = useState<Partial<Brand> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAddModal = () => {
    setEditingBrand({
      name: "",
      logo: "",
      isVisible: true,
      order: brands.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (brand: Brand) => {
    setEditingBrand(brand);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand || !editingBrand.name || !editingBrand.logo) {
      alert("Vui lòng điền đầy đủ Tên đối tác và tải lên Logo.");
      return;
    }

    const isNew = !editingBrand.id;
    const url = isNew ? "/api/admin/brands" : `/api/admin/brands/${editingBrand.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editingBrand)
      });

      if (response.ok) {
        setIsModalOpen(false);
        setEditingBrand(null);
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
    if (!confirm("Xóa đối tác này khỏi danh sách hiển thị?")) return;

    try {
      const response = await fetch(`/api/admin/brands/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) refreshData();
    } catch (err) {
      alert("Lỗi kết nối.");
    }
  };

  const handleToggleVisibility = async (brand: Brand) => {
    try {
      await fetch(`/api/admin/brands/${brand.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ isVisible: !brand.isVisible })
      });
      refreshData();
    } catch (err) {
      alert("Lỗi kết nối.");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === brands.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const listCopy = [...brands];
    
    const tempOrder = listCopy[index].order;
    listCopy[index].order = listCopy[targetIndex].order;
    listCopy[targetIndex].order = tempOrder;

    try {
      await fetch(`/api/admin/brands/${listCopy[index].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ order: listCopy[index].order })
      });
      await fetch(`/api/admin/brands/${listCopy[targetIndex].id}`, {
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
          <h2 className="text-xl font-bold text-gray-900 uppercase">QUẢN LÝ LOGO KHÁCH HÀNG & ĐỐI TÁC</h2>
          <p className="text-xs text-gray-500 mt-1">Các logo của khách hàng lớn chạy lướt trên trang chủ.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase shadow-md transition-all"
        >
          <Plus size={16} />
          Thêm Đối Tác Mới
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
        {brands.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">Không tìm thấy logo đối tác nào.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {brands.map((brand, index) => (
              <div key={brand.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Brand logo frame */}
                  <div className="h-12 w-28 bg-[#11422E] rounded-lg p-2 flex items-center justify-center border border-emerald-950 overflow-hidden shrink-0">
                    {brand.logo.startsWith("preset:") ? (
                      <div className="scale-75 flex items-center justify-center text-white">
                        {BRAND_PRESET_MAP[brand.logo] || <span className="text-[10px] uppercase font-bold text-white/50">{brand.name}</span>}
                      </div>
                    ) : (
                      <img 
                        src={brand.logo} 
                        alt={brand.name} 
                        className="max-h-full max-w-full object-contain brightness-0 invert opacity-90" 
                        referrerPolicy="no-referrer" 
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{brand.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Sắp xếp: {index + 1}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMove(index, "up")}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-20"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => handleMove(index, "down")}
                    disabled={index === brands.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-20"
                  >
                    <ArrowDown size={16} />
                  </button>

                  <button
                    onClick={() => handleToggleVisibility(brand)}
                    className={`p-1.5 rounded-lg border transition-all ml-2 ${
                      brand.isVisible ? "border-emerald-100 text-emerald-600 bg-emerald-50" : "border-gray-200 text-gray-400"
                    }`}
                  >
                    {brand.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(brand)}
                    className="p-1.5 border border-blue-100 text-blue-600 bg-blue-50 rounded-lg"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id)}
                    className="p-1.5 border border-rose-100 text-rose-600 bg-rose-50 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && editingBrand && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-150 flex justify-between items-center bg-gray-50">
              <h3 className="text-sm font-bold text-gray-900 uppercase">
                {editingBrand.id ? "SỬA LOGO ĐỐI TÁC" : "THÊM ĐỐI TÁC THƯƠNG HIỆU"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Tên công ty / Đối tác *</label>
                <input
                  type="text"
                  required
                  value={editingBrand.name || ""}
                  onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                  placeholder="Vinamilk, Samsung..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <ImageUpload
                value={editingBrand.logo || ""}
                onChange={(url) => setEditingBrand({ ...editingBrand, logo: url })}
                label="Logo đối tác (khuyên dùng dạng ngang, nền trắng/trong suốt) *"
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
    </div>
  );
};
