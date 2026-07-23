import React, { useState, useEffect } from "react";
import { WorkItem } from "../../types";
import { ImageUpload } from "./ImageUpload";
import { Save, Plus, Trash2, Edit2, X, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";

interface WorkCMSProps {
  token: string;
  refreshData: () => void;
}

export const WorkCMS: React.FC<WorkCMSProps> = ({ token, refreshData }) => {
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form / Modal view states
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<WorkItem>>({
    customerName: "",
    application: "",
    image: "",
    stylePreset: "default",
    order: 0
  });

  const fetchWorks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/work", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Sort by order asc
        setWorks(data.sort((a: WorkItem, b: WorkItem) => a.order - b.order));
      }
    } catch (err) {
      console.error("Error loading work items:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, [token]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      customerName: "",
      application: "",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
      stylePreset: "default",
      order: works.length + 1
    });
    setShowForm(true);
  };

  const handleOpenEdit = (item: WorkItem) => {
    setEditingId(item.id);
    setFormData({
      stylePreset: "default",
      ...item
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa dự án này không?")) return;
    try {
      const response = await fetch(`/api/admin/work/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        fetchWorks();
        refreshData();
      } else {
        alert("Xóa hạng mục thất bại.");
      }
    } catch (err) {
      alert("Lỗi kết nối.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/admin/work/${editingId}` : "/api/admin/work";
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowForm(false);
        fetchWorks();
        refreshData();
      } else {
        const errData = await response.json();
        alert("Lưu thông tin thất bại: " + errData.error);
      }
    } catch (err) {
      alert("Lỗi kết nối.");
    }
  };

  const handleOrderChange = async (index: number, direction: "up" | "down") => {
    const sortedWorks = [...works];
    if (direction === "up" && index > 0) {
      const current = sortedWorks[index];
      const prev = sortedWorks[index - 1];

      const tempOrder = current.order;
      current.order = prev.order;
      prev.order = tempOrder;

      await saveWorkOrder(current);
      await saveWorkOrder(prev);
    } else if (direction === "down" && index < sortedWorks.length - 1) {
      const current = sortedWorks[index];
      const next = sortedWorks[index + 1];

      const tempOrder = current.order;
      current.order = next.order;
      next.order = tempOrder;

      await saveWorkOrder(current);
      await saveWorkOrder(next);
    }
    fetchWorks();
    refreshData();
  };

  const saveWorkOrder = async (item: WorkItem) => {
    try {
      await fetch(`/api/admin/work/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ order: item.order })
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 uppercase">QUẢN LÝ DỰ ÁN (WORK ARCHIVE)</h2>
          <p className="text-xs text-gray-500 mt-1">Quản lý và cập nhật danh sách các sản phẩm in ấn, bao bì, hộp quà đã sản xuất ngoài trang chủ.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Plus size={15} /> Thêm dự án mới
        </button>
      </div>

      {/* FORM MODAL PANEL */}
      {showForm && (
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-850">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              {editingId ? "Cập nhật dự án" : "Tạo dự án mới"}
            </h3>
            <button onClick={() => setShowForm(false)} className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400">Tên Khách Hàng / Thương Hiệu *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Ví dụ: Tập đoàn Samsung, Highland Coffee..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400">Ứng dụng sản phẩm / Mô tả ngắn *</label>
                <input
                  type="text"
                   
                  value={formData.application}
                  onChange={(e) => setFormData({ ...formData, application: e.target.value })}
                  placeholder="Ví dụ: Hộp quà tết cao cấp, Túi giấy Kraft tái chế..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400">Hiệu ứng / Phong cách in ấn (Work Style Preset) *</label>
              <select
                value={formData.stylePreset || "default"}
                onChange={(e) => setFormData({ ...formData, stylePreset: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:ring-1 focus:ring-amber-500 focus:outline-none"
              >
                <option value="default">Giao diện mặc định (Chỉ hiển thị ảnh mẫu)</option>
                <option value="waterbased">Waterbased (Màu Xanh Bơ / Neon)</option>
                <option value="rubber">Rubber (Màu Tím Violet)</option>
                <option value="glitter">Glitter & Shimmer (Màu Vàng Chanh)</option>
                <option value="glow">Glow In The Dark (Màu Tím Xám Khói)</option>
                <option value="split_fountain">Split Fountain (Màu Xanh Cyan / Mòng két)</option>
                <option value="puff">Puff (Màu Cam Hoàng Hôn)</option>
                <option value="metallic">Metallic (Màu Đỏ Lựu)</option>
                <option value="high_density">High Density (Màu Tím Sẫm)</option>
                <option value="plastisol">Plastisol (Màu Cam Đậm)</option>
                <option value="photo_realistic">Photo-Realistic (Màu Xanh Indigo)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <ImageUpload
                value={formData.image || ""}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Hình ảnh thực tế dự án"
                token={token}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-850">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Save size={14} /> Lưu dự án
              </button>
            </div>
          </form>
        </div>
      )}

      {/* WORKS ITEMS GRID */}
      {isLoading ? (
        <div className="py-12 text-center text-gray-400 animate-pulse text-xs">
          Đang tải danh sách dự án...
        </div>
      ) : works.length === 0 ? (
        <div className="bg-white p-12 border border-dashed border-gray-200 rounded-2xl text-center text-gray-400 text-xs">
          Chưa có dự án nào được lưu. Bấm "Thêm dự án mới" để bắt đầu thiết lập.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((item, index) => (
            <div
              key={item.id}
              className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Photo View */}
              <div className="aspect-video w-full bg-gray-50 relative overflow-hidden border-b border-gray-100">
                <img src={item.image} alt={item.customerName} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 px-2 py-0.5 bg-slate-950/80 text-white text-[10px] font-mono rounded-md">
                  Thứ tự: {item.order}
                </span>
              </div>

              {/* Data and Actions */}
              <div className="p-4 space-y-3">
                <div>
                  <h4 className="text-sm font-black text-gray-900 truncate uppercase">{item.customerName}</h4>
                  <p className="text-xs text-gray-400 mt-1 truncate">Ứng dụng: <strong className="font-semibold text-gray-600">{item.application}</strong></p>
                  <div className="mt-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full border border-amber-200">
                      Hiệu ứng: {item.stylePreset || "default"}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleOrderChange(index, "up")}
                      className="p-1.5 rounded-lg bg-gray-50 hover:bg-amber-100 hover:text-amber-700 text-gray-500 disabled:opacity-30 disabled:hover:bg-gray-50 transition-colors"
                      title="Di chuyển lên trước"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={index === works.length - 1}
                      onClick={() => handleOrderChange(index, "down")}
                      className="p-1.5 rounded-lg bg-gray-50 hover:bg-amber-100 hover:text-amber-700 text-gray-500 disabled:opacity-30 disabled:hover:bg-gray-50 transition-colors"
                      title="Di chuyển xuống sau"
                    >
                      <ArrowDown size={13} />
                    </button>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-all cursor-pointer text-xs flex items-center gap-1 font-bold"
                    >
                      <Edit2 size={12} /> Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all cursor-pointer text-xs flex items-center gap-1 font-bold"
                    >
                      <Trash2 size={12} /> Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
