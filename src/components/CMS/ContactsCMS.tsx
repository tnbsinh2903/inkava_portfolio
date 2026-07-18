import React, { useState, useEffect } from "react";
import { ContactRequest } from "../../types";
import { Trash2, CheckCircle, Clock, Search, Mail, Phone, Calendar, MessageSquare, AlertCircle } from "lucide-react";

interface ContactsCMSProps {
  token: string;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

export const ContactsCMS: React.FC<ContactsCMSProps> = ({ token, refreshTrigger, triggerRefresh }) => {
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "processed" | "unprocessed">("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/contacts", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [token, refreshTrigger]);

  const handleToggleProcess = async (contact: ContactRequest) => {
    try {
      const response = await fetch(`/api/admin/contacts/${contact.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ isProcessed: !contact.isProcessed })
      });
      if (response.ok) {
        fetchContacts();
        triggerRefresh(); // Update main stats counter
      }
    } catch (err) {
      alert("Cập nhật trạng thái thất bại.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa thư liên hệ này vĩnh viễn?")) return;

    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        fetchContacts();
        triggerRefresh(); // Update main stats counter
      }
    } catch (err) {
      alert("Xóa thất bại.");
    }
  };

  // Filter & Search
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.company || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.address || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.message.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === "processed") return matchesSearch && c.isProcessed;
    if (filterStatus === "unprocessed") return matchesSearch && !c.isProcessed;
    return matchesSearch;
  });

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 uppercase">DANH SÁCH KHÁCH HÀNG LIÊN HỆ</h2>
        <p className="text-xs text-gray-500 mt-1">Danh sách thông tin khách gửi yêu cầu tư vấn báo giá từ Landing Page.</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Tìm theo Tên, SĐT, Email, Nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-gray-900"
          />
        </div>

        {/* Status filters */}
        <div className="flex bg-gray-100 rounded-lg p-0.5 border border-gray-200 w-full md:w-auto">
          <button
            onClick={() => setFilterStatus("all")}
            className={`flex-1 md:flex-initial text-xs font-semibold px-4 py-2 rounded-md uppercase tracking-wider transition-all ${
              filterStatus === "all" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilterStatus("unprocessed")}
            className={`flex-1 md:flex-initial text-xs font-semibold px-4 py-2 rounded-md uppercase tracking-wider transition-all ${
              filterStatus === "unprocessed" ? "bg-white text-rose-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Chưa xử lý
          </button>
          <button
            onClick={() => setFilterStatus("processed")}
            className={`flex-1 md:flex-initial text-xs font-semibold px-4 py-2 rounded-md uppercase tracking-wider transition-all ${
              filterStatus === "processed" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Đã xử lý
          </button>
        </div>
      </div>

      {/* Grid of contact cards */}
      {isLoading ? (
        <div className="text-center py-12 text-sm text-gray-500">Đang tải dữ liệu liên hệ...</div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center bg-white rounded-2xl border border-gray-150 py-16 text-gray-500 text-sm">
          Không tìm thấy liên hệ nào khớp với điều kiện tìm kiếm.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredContacts.map((c) => (
            <div
              key={c.id}
              className={`bg-white rounded-2xl border border-gray-150 shadow-sm p-6 transition-all relative overflow-hidden ${
                !c.isProcessed ? "border-l-4 border-l-rose-500" : "border-l-4 border-l-emerald-500"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Contact basic info */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-base font-bold text-gray-900">{c.fullName}</h3>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      c.isProcessed ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                    }`}>
                      {c.isProcessed ? <CheckCircle size={10} /> : <Clock size={10} />}
                      {c.isProcessed ? "Đã xử lý" : "Chưa liên hệ"}
                    </span>
                  </div>

                  <div className="flex flex-wrap text-xs text-gray-500 gap-x-4 gap-y-1.5 font-light">
                    <span className="flex items-center gap-1">
                      <Phone size={12} className="text-blue-500" />
                      SĐT: <strong className="font-semibold text-gray-800 font-mono">{c.phone || "N/A"}</strong>
                    </span>
                    {c.email && (
                      <span className="flex items-center gap-1">
                        <Mail size={12} className="text-blue-500" />
                        Email: <span className="font-medium text-gray-800">{c.email}</span>
                      </span>
                    )}
                    {c.company && (
                      <span className="flex items-center gap-1">
                        <span className="text-amber-500 text-[10px] font-bold">🏢</span>
                        Công ty: <span className="font-semibold text-gray-800">{c.company}</span>
                      </span>
                    )}
                    {c.address && (
                      <span className="flex items-center gap-1">
                        <span className="text-amber-500 text-[10px] font-bold">📍</span>
                        Địa chỉ: <span className="font-medium text-gray-800">{c.address}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      Gửi ngày: {formatDate(c.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Processing controls */}
                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <button
                    onClick={() => handleToggleProcess(c)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                      c.isProcessed
                        ? "bg-slate-100 hover:bg-slate-200 text-gray-600"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                    }`}
                  >
                    {c.isProcessed ? "Đánh dấu Chưa xử lý" : "Đánh dấu Đã xử lý"}
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 border border-rose-100 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg"
                    title="Xóa vĩnh viễn"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Message text content */}
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 flex gap-2.5 items-start">
                <MessageSquare size={16} className="text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Yêu cầu khách hàng:</p>
                  <p className="text-sm text-gray-700 leading-relaxed font-light mt-1 whitespace-pre-line">{c.message || "(Không có nội dung lời nhắn)"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
