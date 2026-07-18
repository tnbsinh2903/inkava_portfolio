import React, { useState } from "react";
import { Service } from "../../types";
import { ImageUpload } from "./ImageUpload";
import { DynamicIcon } from "../Icons";
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Save,
  X,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface ServicesCMSProps {
  services: Service[];
  token: string;
  onUpdate: (updatedServices: Service[]) => void;
  refreshData: () => void;
}

const AVAILABLE_ICONS = [
  "Printer",
  "Box",
  "BookOpen",
  "Tag",
  "ShoppingBag",
  "Layers",
  "Settings",
  "Award",
  "Clock",
  "TrendingUp",
];

export const ServicesCMS: React.FC<ServicesCMSProps> = ({
  services,
  token,
  onUpdate,
  refreshData,
}) => {
  const [editingService, setEditingService] = useState<Partial<Service> | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAddModal = () => {
    setEditingService({
      name: "",
      description: "",
      descriptionTitle: "",
      details: [""],
      icon: "Printer",
      image: "",
      images: [],
      isVisible: true,
      order: services.length + 1,
      certificates: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service: Service) => {
    setEditingService({
      ...service,
      descriptionTitle: service.descriptionTitle || service.description || "",
      details: service.details || [""],
      images: service.images || [],
      certificates: service.certificates || [],
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.name || !editingService.image) {
      alert("Vui lòng điền đầy đủ Tên dịch vụ và tải lên ảnh đại diện.");
      return;
    }

    const isNew = !editingService.id;
    const url = isNew
      ? "/api/admin/services"
      : `/api/admin/services/${editingService.id}`;
    const method = isNew ? "POST" : "PUT";

    // Clean details to remove empty entries
    const cleanedDetails = (editingService.details || [])
      .map((d) => d.trim())
      .filter((d) => d !== "");

    const title = (
      editingService.descriptionTitle ||
      editingService.description ||
      ""
    ).trim();

    // Clean certificates
    const cleanedCerts = (editingService.certificates || [])
      .filter((cert) => cert.fileUrl && cert.fileUrl.trim() !== "")
      .map((cert) => ({
        name: (cert.name || "Chứng chỉ").trim(),
        fileUrl: cert.fileUrl.trim(),
      }));

    // Clean extra images
    const cleanedImages = (editingService.images || [])
      .map((img) => img.trim())
      .filter((img) => img !== "");

    const payload = {
      ...editingService,
      descriptionTitle: title,
      description: title, // keep fallback in sync
      details: cleanedDetails,
      images: cleanedImages,
      certificates: cleanedCerts,
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setEditingService(null);
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
    if (!confirm("Bạn có chắc chắn muốn xóa dịch vụ này không?")) return;

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  const handleToggleVisibility = async (service: Service) => {
    try {
      const response = await fetch(`/api/admin/services/${service.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isVisible: !service.isVisible }),
      });
      if (response.ok) {
        refreshData();
      }
    } catch (err) {
      alert("Có lỗi kết nối hệ thống.");
    }
  };

  const sortedServices = [...services].sort(
    (a, b) => (a.order || 0) - (b.order || 0),
  );

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === sortedServices.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const listCopy = [...sortedServices];

    const tempOrder = listCopy[index].order;
    listCopy[index].order = listCopy[targetIndex].order;
    listCopy[targetIndex].order = tempOrder;

    try {
      await fetch(`/api/admin/services/${listCopy[index].id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order: listCopy[index].order }),
      });
      await fetch(`/api/admin/services/${listCopy[targetIndex].id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order: listCopy[targetIndex].order }),
      });
      refreshData();
    } catch (err) {
      alert("Lỗi sắp xếp.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 uppercase">
            QUẢN LÝ DỊCH VỤ IN ẤN
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Các danh mục dịch vụ in ấn chính hiển thị dạng Card bento bên ngoài.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all"
        >
          <Plus size={16} />
          Thêm Dịch Vụ Mới
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedServices.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm col-span-full">
            Không tìm thấy dữ liệu dịch vụ.
          </div>
        ) : (
          sortedServices.map((service, index) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-gray-150 shadow-sm p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-4">
                  {/* Photo Thumbnail */}
                  <div className="h-16 w-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shrink-0 relative">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-1 right-1 bg-blue-600 text-white p-1 rounded-md">
                      <DynamicIcon name={service.icon} size={10} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-mono font-medium">
                        Thứ tự: {index + 1}
                      </span>
                      {!service.isVisible && (
                        <span className="text-xs bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-medium">
                          Ẩn
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mt-1">
                      {service.name}
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 font-light leading-relaxed line-clamp-2">
                  {service.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-4">
                <div className="flex gap-1">
                  <button
                    onClick={() => handleMove(index, "up")}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-20"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => handleMove(index, "down")}
                    disabled={index === sortedServices.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-20"
                  >
                    <ArrowDown size={16} />
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleVisibility(service)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      service.isVisible
                        ? "border-emerald-100 text-emerald-600 bg-emerald-50"
                        : "border-gray-200 text-gray-400"
                    }`}
                  >
                    {service.isVisible ? (
                      <Eye size={14} />
                    ) : (
                      <EyeOff size={14} />
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(service)}
                    className="p-1.5 border border-blue-100 text-blue-600 bg-blue-50 rounded-lg"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-1.5 border border-rose-100 text-rose-600 bg-rose-50 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && editingService && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden my-8 max-h-[85vh] md:max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-150 flex justify-between items-center bg-gray-50 shrink-0">
              <h3 className="text-base font-bold text-gray-900 uppercase">
                {editingService.id
                  ? "SỬA DANH MỤC DỊCH VỤ"
                  : "THÊM DỊCH VỤ IN MỚI"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="p-6 space-y-4 overflow-y-auto flex-1"
            >
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Tên dịch vụ *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.name || ""}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      name: e.target.value,
                    })
                  }
                  placeholder="In Offset, In Bao bì, In Hộp giấy..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-gray-900"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Tiêu đề phần mô tả *
                </label>
                <textarea
                  rows={2}
                  required
                  value={
                    editingService.descriptionTitle ??
                    editingService.description ??
                    ""
                  }
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      descriptionTitle: e.target.value,
                      description: e.target.value, // support fallback
                    })
                  }
                  placeholder="Tiêu đề chính của mô tả chi tiết"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Các chi tiết nhỏ mô tả (Dấu chấm đầu dòng, không giới hạn)
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(editingService.details || []).map((detail, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="text-gray-400 font-mono text-xs">•</span>
                      <input
                        type="text"
                        value={detail}
                        onChange={(e) => {
                          const newDetails = [
                            ...(editingService.details || []),
                          ];
                          newDetails[idx] = e.target.value;
                          setEditingService({
                            ...editingService,
                            details: newDetails,
                          });
                        }}
                        placeholder={`Chi tiết thứ ${idx + 1}`}
                        className="flex-grow px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newDetails = (
                            editingService.details || []
                          ).filter((_, i) => i !== idx);
                          setEditingService({
                            ...editingService,
                            details: newDetails,
                          });
                        }}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 transition-all cursor-pointer shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {(editingService.details || []).length === 0 && (
                    <p className="text-xs text-gray-400 italic">
                      Chưa có chi tiết nhỏ nào.
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingService({
                      ...editingService,
                      details: [...(editingService.details || []), ""],
                    });
                  }}
                  className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <Plus size={14} />
                  Thêm ô chi tiết
                </button>
              </div>

              {/* Icon selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Biểu tượng (Icon)
                </label>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  {AVAILABLE_ICONS.map((iconName) => (
                    <button
                      type="button"
                      key={iconName}
                      onClick={() =>
                        setEditingService({ ...editingService, icon: iconName })
                      }
                      className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                        editingService.icon === iconName
                          ? "bg-blue-600 text-white border-blue-600 scale-110 shadow-sm"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"
                      }`}
                      title={iconName}
                    >
                      <DynamicIcon name={iconName} size={18} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <ImageUpload
                value={editingService.image || ""}
                onChange={(url) =>
                  setEditingService({ ...editingService, image: url })
                }
                label="Ảnh bìa chính của dịch vụ *"
                token={token}
              />

              {/* Extra Images Upload Section */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Các ảnh bìa bổ sung (Tối đa 3 ảnh)
                  </label>
                  <span className="text-[10px] text-gray-500">
                    Dùng để hiển thị slide/album ảnh trên web
                  </span>
                </div>

                <div className="space-y-3">
                  {(editingService.images || []).map((imgUrl, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-2xl border border-gray-200 relative space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-600">
                          Ảnh bổ sung #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = (
                              editingService.images || []
                            ).filter((_, idx) => idx !== index);
                            setEditingService({
                              ...editingService,
                              images: newImages,
                            });
                          }}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 transition-all cursor-pointer z-10"
                          title="Xóa ảnh này"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <ImageUpload
                        value={imgUrl}
                        onChange={(url) => {
                          const newImages = [...(editingService.images || [])];
                          newImages[index] = url;
                          setEditingService({
                            ...editingService,
                            images: newImages,
                          });
                        }}
                        label={`Tải lên ảnh bổ sung #${index + 1}`}
                        token={token}
                      />
                    </div>
                  ))}

                  {(editingService.images || []).length === 0 && (
                    <p className="text-xs text-gray-400 italic py-2 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl text-center">
                      Chưa thêm ảnh bìa bổ sung nào. Dịch vụ sẽ chỉ hiển thị 1
                      ảnh bìa chính.
                    </p>
                  )}
                </div>

                {(!editingService.images ||
                  editingService.images.length < 3) && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingService({
                        ...editingService,
                        images: [...(editingService.images || []), ""],
                      });
                    }}
                    className="w-full py-2 bg-white hover:bg-gray-50 text-blue-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-dashed border-gray-250 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} />
                    Thêm ảnh bìa bổ sung
                  </button>
                )}
              </div>

              {/* List of Certificates / Documents */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div>
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                    <span>Chứng chỉ & Tài liệu đính kèm (Tối đa 4)</span>
                    <span className="text-[10px] text-gray-500 font-normal normal-case">
                      (Có thể tải lên tài liệu PDF hoặc hình ảnh chứng nhận)
                    </span>
                  </h4>
                </div>

                <div className="space-y-4">
                  {(editingService.certificates || []).map((cert, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-2xl border border-gray-200 relative space-y-3"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const newCerts = (
                            editingService.certificates || []
                          ).filter((_, idx) => idx !== index);
                          setEditingService({
                            ...editingService,
                            certificates: newCerts,
                          });
                        }}
                        className="absolute top-3 right-3 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-150 transition-all cursor-pointer z-10"
                        title="Xóa chứng chỉ này"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="space-y-1 pr-8">
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          Tên chứng chỉ / tài liệu *
                        </label>
                        <input
                          type="text"
                          required
                          value={cert.name}
                          onChange={(e) => {
                            const newCerts = [
                              ...(editingService.certificates || []),
                            ];
                            newCerts[index] = {
                              ...newCerts[index],
                              name: e.target.value,
                            };
                            setEditingService({
                              ...editingService,
                              certificates: newCerts,
                            });
                          }}
                          placeholder="VD: Chứng chỉ OEKO-TEX Standard 100"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-gray-900"
                        />
                      </div>

                      <ImageUpload
                        value={cert.fileUrl}
                        onChange={(url) => {
                          const newCerts = [
                            ...(editingService.certificates || []),
                          ];
                          newCerts[index] = {
                            ...newCerts[index],
                            fileUrl: url,
                          };
                          setEditingService({
                            ...editingService,
                            certificates: newCerts,
                          });
                        }}
                        label="Tệp chứng chỉ (Ảnh/PDF) *"
                        token={token}
                        acceptPdf={true}
                      />
                    </div>
                  ))}

                  {(editingService.certificates || []).length === 0 && (
                    <p className="text-xs text-gray-500 italic py-3 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl text-center">
                      Chưa có chứng chỉ hay tài liệu đính kèm nào được tải lên.
                    </p>
                  )}
                </div>

                {(!editingService.certificates ||
                  editingService.certificates.length < 4) && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingService({
                        ...editingService,
                        certificates: [
                          ...(editingService.certificates || []),
                          { name: "", fileUrl: "" },
                        ],
                      });
                    }}
                    className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-blue-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-dashed border-gray-200 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} />
                    Thêm Chứng Chỉ / Tài Liệu Mới
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isVisible"
                  checked={editingService.isVisible}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      isVisible: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="isVisible"
                  className="text-sm font-medium text-gray-700"
                >
                  Hiển thị trên website
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-150">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4.5 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md flex items-center gap-1.5"
                >
                  <Save size={16} />
                  Lưu thông tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
