import React, { useState, useEffect } from "react";
import { TeamMember } from "../../types";
import { ImageUpload } from "./ImageUpload";
import { Save, Plus, Trash2, Edit2, X, ArrowUp, ArrowDown, User } from "lucide-react";

interface OurTeamCMSProps {
  token: string;
  refreshData: () => void;
}

export const OurTeamCMS: React.FC<OurTeamCMSProps> = ({ token, refreshData }) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Modal/Form States
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    fullName: "",
    email: "",
    department: "Văn phòng",
    position: "",
    avatar: "",
    order: 0
  });

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/team", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Sort by order asc
        setMembers(data.sort((a: TeamMember, b: TeamMember) => a.order - b.order));
      }
    } catch (err) {
      console.error("Error fetching team members:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [token]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      fullName: "",
      email: "",
      department: "Văn phòng",
      position: "",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      order: members.length + 1
    });
    setShowForm(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setFormData({ ...member });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thành viên này không?")) return;
    try {
      const response = await fetch(`/api/admin/team/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        fetchMembers();
        refreshData();
      } else {
        alert("Xóa thành viên thất bại.");
      }
    } catch (err) {
      alert("Lỗi kết nối.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/admin/team/${editingId}` : "/api/admin/team";
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
        fetchMembers();
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
    const sortedMembers = [...members];
    if (direction === "up" && index > 0) {
      const current = sortedMembers[index];
      const prev = sortedMembers[index - 1];
      
      const tempOrder = current.order;
      current.order = prev.order;
      prev.order = tempOrder;

      // Persist changes
      await saveMemberOrder(current);
      await saveMemberOrder(prev);
    } else if (direction === "down" && index < sortedMembers.length - 1) {
      const current = sortedMembers[index];
      const next = sortedMembers[index + 1];
      
      const tempOrder = current.order;
      current.order = next.order;
      next.order = tempOrder;

      // Persist changes
      await saveMemberOrder(current);
      await saveMemberOrder(next);
    }
    fetchMembers();
    refreshData();
  };

  const saveMemberOrder = async (member: TeamMember) => {
    try {
      await fetch(`/api/admin/team/${member.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ order: member.order })
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 uppercase">QUẢN LÝ ĐỘI NGŨ (OUR TEAM)</h2>
          <p className="text-xs text-gray-500 mt-1">Danh sách nhân sự xuất sắc của nhà xưởng hiển thị tại mục Carousel trượt tự động ngoài trang chủ.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Plus size={15} /> Thêm nhân sự mới
        </button>
      </div>

      {/* FORM MODAL / PANEL */}
      {showForm && (
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-850">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              {editingId ? "Cập nhật thành viên" : "Tạo thành viên mới"}
            </h3>
            <button onClick={() => setShowForm(false)} className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400">Họ và Tên *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400">Chức vụ / Vị trí</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Giám đốc kĩ thuật, Chuyên viên thiết kế..."
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400">Bộ phận</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:ring-1 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="Ban lãnh đạo">Ban lãnh đạo</option>
                  <option value="Sản xuất & Vận hành">Sản xuất & Vận hành</option>
                  <option value="Thiết kế sáng tạo">Thiết kế sáng tạo</option>
                  <option value="Chăm sóc khách hàng">Chăm sóc khách hàng</option>
                  <option value="Kế toán & Nhân sự">Kế toán & Nhân sự</option>
                  <option value="Văn phòng">Văn phòng</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400">Email liên hệ</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <ImageUpload
                value={formData.avatar || ""}
                onChange={(url) => setFormData({ ...formData, avatar: url })}
                label="Hình ảnh chân dung (Avatar)"
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
                <Save size={14} /> Lưu thông tin
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TEAM MEMBERS GRID */}
      {isLoading ? (
        <div className="py-12 text-center text-gray-400 animate-pulse text-xs">
          Đang tải dữ liệu đội ngũ kỹ thuật...
        </div>
      ) : members.length === 0 ? (
        <div className="bg-white p-12 border border-dashed border-gray-200 rounded-2xl text-center text-gray-400 text-xs">
          Không có thành viên đội ngũ nào. Nhấp "Thêm nhân sự mới" để bắt đầu.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((member, index) => (
            <div
              key={member.id}
              className="bg-white border border-gray-150 p-4 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="h-14 w-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shrink-0">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.fullName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      <User size={20} />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div>
                  <h4 className="text-sm font-black text-gray-900">{member.fullName}</h4>
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mt-0.5">{member.position || "Kỹ sư in"}</p>
                  <p className="text-xs text-gray-400 mt-1 font-light">Bộ phận: <strong className="font-semibold text-gray-600">{member.department}</strong></p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5">
                {/* Order Up/Down buttons */}
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleOrderChange(index, "up")}
                  className="p-2 rounded-xl bg-gray-50 hover:bg-amber-100 hover:text-amber-700 text-gray-500 disabled:opacity-30 disabled:hover:bg-gray-50 transition-colors"
                  title="Di chuyển lên trước"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  type="button"
                  disabled={index === members.length - 1}
                  onClick={() => handleOrderChange(index, "down")}
                  className="p-2 rounded-xl bg-gray-50 hover:bg-amber-100 hover:text-amber-700 text-gray-500 disabled:opacity-30 disabled:hover:bg-gray-50 transition-colors"
                  title="Di chuyển xuống sau"
                >
                  <ArrowDown size={13} />
                </button>

                <div className="h-6 w-[1px] bg-gray-100 mx-1" />

                {/* Edit */}
                <button
                  onClick={() => handleOpenEdit(member)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-all cursor-pointer"
                  title="Sửa thành viên"
                >
                  <Edit2 size={13} />
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(member.id)}
                  className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all cursor-pointer"
                  title="Xóa thành viên"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
