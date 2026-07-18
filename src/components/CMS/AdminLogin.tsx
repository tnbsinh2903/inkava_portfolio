import React, { useState } from "react";
import { Printer, Shield, Eye, EyeOff, Loader2 } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: (token: string) => void;
  onBackToClient: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToClient }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Vui lòng điền đầy đủ Tên đăng nhập và Mật khẩu.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        onLoginSuccess(data.token);
      } else {
        setError(data.error || "Tên đăng nhập hoặc mật khẩu sai.");
      }
    } catch (err) {
      setError("Không thể kết nối máy chủ dịch vụ. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background radial overlays */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative z-10">
        
        {/* Card Header branding */}
        <div className="p-8 text-center bg-slate-50 border-b border-gray-150 relative">
          <div className="mx-auto w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30">
            <Printer size={22} />
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider mt-4">IN KAVA PORTAL</h2>
          <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider mt-1.5 flex items-center justify-center gap-1.5">
            <Shield size={12} />
            Hệ thống quản lý nội dung CMS
          </p>
        </div>

        {/* Login Form body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold p-3.5 rounded-xl text-center">
              {error}
            </div>
          )}

          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Tên Đăng Nhập</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập (mặc định: admin)"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Mật Khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu (mặc định: admin123)"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white pr-10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Credentials guideline */}
          <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl text-[11px] text-amber-700 leading-normal font-sans">
            <p className="font-semibold uppercase tracking-wider">Tài khoản demo:</p>
            <p className="mt-1">Tên đăng nhập: <strong className="font-bold">admin</strong></p>
            <p>Mật khẩu: <strong className="font-bold">admin123</strong></p>
          </div>

          {/* Actions button */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black tracking-wide uppercase rounded-xl shadow-lg shadow-amber-500/20 disabled:bg-gray-400 disabled:shadow-none transition-all duration-300 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang xác minh...</span>
                </>
              ) : (
                <span>ĐĂNG NHẬP HỆ THỐNG</span>
              )}
            </button>

            <button
              type="button"
              onClick={onBackToClient}
              className="w-full flex items-center justify-center px-4 py-3 text-gray-500 hover:text-gray-900 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Quay lại Trang Chủ
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
