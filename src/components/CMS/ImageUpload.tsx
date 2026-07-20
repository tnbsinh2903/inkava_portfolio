import React, { useState, useRef } from "react";
import { Upload, X, Link, Image as ImageIcon, Loader2 } from "lucide-react";
import { BRAND_PRESET_MAP } from "../Brands";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  token?: string;
  acceptPdf?: boolean;
  acceptVideo?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = "Hình ảnh",
  token,
  acceptPdf = false,
  acceptVideo = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"upload" | "url">(
    value.startsWith("http") && !value.includes("/uploads/") ? "url" : "upload",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    setError("");
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/svg+xml",
      "image/webp",
    ];
    if (acceptPdf) {
      validTypes.push("application/pdf");
    }
    if (acceptVideo) {
      validTypes.push(
        "video/mp4",
        "video/webm",
        "video/ogg",
        "video/quicktime",
      );
    }

    if (!validTypes.includes(file.type)) {
      if (acceptVideo) {
        setError(
          "Chỉ chấp nhận các định dạng video/ảnh: MP4, WEBM, MOV, JPG, JPEG, PNG, WEBP.",
        );
      } else if (acceptPdf) {
        setError(
          "Chỉ chấp nhận các định dạng tệp tin: PDF, JPG, JPEG, PNG, SVG, WEBP.",
        );
      } else {
        setError("Chỉ chấp nhận các định dạng ảnh: JPG, JPEG, PNG, SVG, WEBP.");
      }
      return;
    }

    const maxSize = acceptVideo ? 45 * 1024 * 1024 : 12 * 1024 * 1024; // 45MB for video, 12MB for others
    if (file.size > maxSize) {
      setError(
        `Dung lượng vượt quá giới hạn cho phép (tối đa ${acceptVideo ? "45MB" : "12MB"}).`,
      );
      return;
    }

    setIsUploading(true);
    try {
      // 1. Convert to Base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        // 2. Post to upload API
        const response = await fetch("/api/admin/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            file: base64String,
            name: file.name,
          }),
        });

        const resData = await response.json();
        if (response.ok && resData.success) {
          onChange(resData.url);
        } else {
          throw new Error(resData.error || "Không thể tải lên máy chủ.");
        }
        setIsUploading(false);
      };
    } catch (err: any) {
      setError(err.message || "Tải lên thất bại. Vui lòng thử lại.");
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isValueVideo = () => {
    const valLower = value.toLowerCase();
    return (
      valLower.endsWith(".mp4") ||
      valLower.endsWith(".webm") ||
      valLower.endsWith(".mov") ||
      valLower.endsWith(".ogg") ||
      value.startsWith("data:video/")
    );
  };

  const getAcceptString = () => {
    if (acceptVideo) {
      return ".jpg,.jpeg,.png,.webp,.mp4,.webm,.mov,.ogg";
    }
    if (acceptPdf) {
      return ".jpg,.jpeg,.png,.svg,.webp,.pdf";
    }
    return ".jpg,.jpeg,.png,.svg,.webp";
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          {label}
        </label>
        <div className="flex bg-gray-100 rounded-lg p-0.5 border border-gray-200">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
              mode === "upload"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Upload size={12} />
            Tải lên tệp
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
              mode === "url"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Link size={12} />
            Nhập URL
          </button>
        </div>
      </div>

      {mode === "upload" ? (
        <div className="space-y-3">
          {/* Main Upload Box */}
          {!value ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer flex flex-col items-center justify-center min-h-[140px] transition-all ${
                isDragging
                  ? "border-blue-500 bg-blue-50/50"
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100/70"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept={getAcceptString()}
              />
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                  <p className="text-sm font-semibold text-gray-700 animate-pulse">
                    Đang tải tệp tin lên máy chủ...
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-150 inline-block text-gray-400 mx-auto">
                    <Upload size={22} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {acceptVideo
                        ? "Nhấp để tải video/ảnh lên hoặc kéo thả vào đây"
                        : acceptPdf
                          ? "Nhấp để tải tài liệu/ảnh lên hoặc kéo thả vào đây"
                          : "Nhấp để tải ảnh lên hoặc kéo thả vào đây"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {acceptVideo
                        ? "Chấp nhận MP4, WEBM, MOV, JPG, PNG, WEBP (Tối đa 45MB)"
                        : acceptPdf
                          ? "Chấp nhận PDF, JPG, JPEG, PNG, SVG, WEBP (Tối đa 12MB)"
                          : "Chấp nhận JPG, JPEG, PNG, SVG, WEBP (Tối đa 8MB)"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Preview Image/PDF/Video block
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 h-44 group flex items-center justify-center">
              {value.startsWith("preset:") ? (
                <div className="bg-[#11422E] w-full h-full flex items-center justify-center p-4">
                  <div className="scale-125 flex items-center justify-center text-white">
                    {BRAND_PRESET_MAP[value] || (
                      <span className="text-[10px] uppercase font-bold text-white/50">
                        {value}
                      </span>
                    )}
                  </div>
                </div>
              ) : value.toLowerCase().includes(".pdf") ||
                value.startsWith("data:application/pdf") ? (
                <div className="flex flex-col items-center justify-center text-rose-600 gap-1.5 p-4">
                  <div className="bg-rose-50 p-3 rounded-full border border-rose-200">
                    <svg
                      className="w-8 h-8 text-rose-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                    Tài liệu PDF Chứng Chỉ
                  </span>
                  <span className="text-[10px] text-gray-500 max-w-[200px] truncate">
                    {value.split("/").pop()}
                  </span>
                </div>
              ) : isValueVideo() ? (
                <video
                  src={value}
                  controls={false}
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={value}
                  alt="Uploaded preview"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 z-10">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 bg-white text-gray-900 rounded-lg text-xs font-bold shadow hover:bg-gray-100 transition-all"
                >
                  Đổi tệp
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept={getAcceptString()}
              />
            </div>
          )}
        </div>
      ) : (
        // Direct URL entry mode
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative grow">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                <Link size={14} />
              </span>
              <input
                type="url"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-gray-900"
              />
            </div>
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-sm font-semibold border border-gray-200"
              >
                Xóa
              </button>
            )}
          </div>
          {value && (
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 h-32 flex items-center justify-center">
              {value.toLowerCase().includes(".pdf") ||
              value.startsWith("data:application/pdf") ? (
                <div className="flex flex-col items-center justify-center text-rose-600 gap-1">
                  <svg
                    className="w-8 h-8 text-rose-500 animate-pulse"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-[11px] font-bold">Tài liệu PDF</span>
                </div>
              ) : isValueVideo() ? (
                <video
                  src={value}
                  controls={false}
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={value}
                  alt="URL Preview"
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as any).src =
                      "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?auto=format&fit=crop&w=600&q=80";
                  }}
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
    </div>
  );
};
