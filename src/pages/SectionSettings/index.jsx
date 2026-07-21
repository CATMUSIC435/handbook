import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Globe,
  Database,
  RefreshCw,
  User,
  Shield,
  LogOut,
  ChevronRight,
  HardDrive,
  Smartphone,
  CheckCircle2,
  Info,
} from "lucide-react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useAppStore } from "../../store/useAppStore";
import CustomSelect from "../../components/ui/CustomSelect";
export default function SectionSettings() {
  const { isSalesLoggedIn, logout } = useAppStore();
  const [hasUpdate, setHasUpdate] = useState(window.pwaUpdateAvailable || false);

  useEffect(() => {
    const handleUpdate = () => setHasUpdate(true);
    window.addEventListener('pwa-update-available', handleUpdate);
    return () => window.removeEventListener('pwa-update-available', handleUpdate);
  }, []);
  const [isDarkMode, setIsDarkMode] = useLocalStorage(
    "fenica_theme_dark",
    false,
  );
  const [language, setLanguage] = useLocalStorage("fenica_language", "vi");
  const [offlineCache, setOfflineCache] = useLocalStorage(
    "fenica_offline_cache",
    true,
  );
  const [autoSync, setAutoSync] = useLocalStorage("fenica_auto_sync", true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useLocalStorage(
    "fenica_last_sync",
    "Vừa xong",
  );
  const [toastMessage, setToastMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
  const handleLanguageChange = (val) => {
    setLanguage(val);
    showToast(
      val === "vi"
        ? "Đã đổi ngôn ngữ sang Tiếng Việt"
        : "Language changed to English",
    );
  };
  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      setLastSync(
        `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`,
      );
    }, 2000);
  };
  const clearCache = () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa toàn bộ bộ nhớ đệm (Ghi chú, Lịch hẹn, Khách hàng)? Hành động này không thể hoàn tác.",
      )
    ) {
      window.localStorage.removeItem("fenica_notes");
      window.localStorage.removeItem("fenica_customers");
      window.localStorage.removeItem("fenica_appointments");
      alert("Đã xoá bộ nhớ đệm ngoại tuyến thành công! Ứng dụng sẽ tải lại.");
      window.location.reload();
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 p-4 flex flex-col overflow-y-auto">
      {""}
      {/* Header */}
      {""}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full mb-10 mt-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200/50 text-slate-700 font-bold text-sm mb-4 w-fit">
          <SettingsIcon size={16} /> Cài Đặt Hệ Thống{""}
        </div>
        {/* <h2 className="text-lg lg:text-xl font-bold text-slate-900 mb-2">
 Tuỳ Chỉnh Ứng Dụng
 </h2>
 <p className="text-slate-500 text-lg">
 Cá nhân hoá trải nghiệm và quản lý dữ liệu của bạn.
 </p> */}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-20 flex flex-col gap-4 lg:gap-8">
        {""}
        {/* HỆ THỐNG (System) */}
        {""}
        <div className="bg-white shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
            <h3 className="font-bold text-slate-400 uppercase tracking-wider text-xs">
              Giao diện & Ngôn ngữ
            </h3>
          </div>
          <div className="flex flex-col">
            {""}
            {/* Dark Mode */}
            {""}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 lg:p-6 border-b border-slate-50 hover:bg-slate-50/50 transition-colors gap-4 sm:gap-0">
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 shrink-0 flex items-center justify-center ${isDarkMode ? "bg-slate-900 text-amber-400" : "bg-slate-100 text-slate-600"}`}
                >
                  {""}
                  {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                  {""}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">
                    Chế độ tối (Dark Mode)
                  </h4>
                  <p className="text-sm text-slate-500">
                    Giảm mỏi mắt khi sử dụng trong bóng tối
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`w-14 h-8 shrink-0 relative transition-colors duration-300 self-end sm:self-auto ${isDarkMode ? "bg-emerald-500" : "bg-slate-200"}`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white shadow-sm transition-transform duration-300 ${isDarkMode ? "translate-x-6" : "translate-x-0"}`}
                ></div>
              </button>
            </div>
            {""}
            {/* Language */}
            {""}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 lg:p-6 hover:bg-slate-50/50 transition-colors gap-4 sm:gap-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 shrink-0 bg-blue-50 text-blue-500 flex items-center justify-center">
                  <Globe size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">
                    Ngôn ngữ (Language)
                  </h4>
                  <p className="text-sm text-slate-500">
                    Thay đổi ngôn ngữ ứng dụng
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="w-full sm:w-40">
                  <CustomSelect
                    value={language}
                    onChange={handleLanguageChange}
                    options={[
                      { value: "vi", label: "Tiếng Việt" },
                      { value: "en", label: "English" },
                    ]}
                    className="bg-slate-100 border-none px-4 py-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {""}
        {/* LƯU TRỮ & ĐỒNG BỘ (Data & Storage) */}
        {""}
        <div className="bg-white shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-400 uppercase tracking-wider text-xs">
              Lưu trữ & Dữ liệu
            </h3>
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
              <Database size={12} /> Đồng bộ lần cuối: {lastSync}
              {""}
            </span>
          </div>
          <div className="flex flex-col">
            {""}
            {/* Auto Sync */}
            {""}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 lg:p-6 border-b border-slate-50 hover:bg-slate-50/50 transition-colors gap-4 sm:gap-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 shrink-0 bg-indigo-50 text-indigo-500 flex items-center justify-center">
                  <RefreshCw
                    size={20}
                    className={isSyncing ? "animate-spin" : ""}
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">
                    Đồng bộ dữ liệu nền
                  </h4>
                  <p className="text-sm text-slate-500">
                    Tự động tải bảng hàng và giá mới nhất
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="px-4 py-1.5 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors disabled:opacity-50"
                >
                  {""}
                  {isSyncing ? "Đang đồng bộ..." : "Đồng bộ ngay"}
                  {""}
                </button>
                <button
                  onClick={() => setAutoSync(!autoSync)}
                  className={`w-14 h-8 shrink-0 relative transition-colors duration-300 ${autoSync ? "bg-emerald-500" : "bg-slate-200"}`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white shadow-sm transition-transform duration-300 ${autoSync ? "translate-x-6" : "translate-x-0"}`}
                  ></div>
                </button>
              </div>
            </div>
            {""}
            {/* Offline Cache */}
            {""}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 lg:p-6 border-b border-slate-50 hover:bg-slate-50/50 transition-colors gap-4 sm:gap-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 shrink-0 bg-amber-50 text-amber-500 flex items-center justify-center">
                  <HardDrive size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">
                    Lưu trữ ngoại tuyến (Offline Mode)
                  </h4>
                  <p className="text-sm text-slate-500">
                    Cho phép tư vấn khách hàng không cần Wifi/4G
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOfflineCache(!offlineCache)}
                className={`w-14 h-8 shrink-0 relative transition-colors duration-300 self-end sm:self-auto ${offlineCache ? "bg-emerald-500" : "bg-slate-200"}`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white shadow-sm transition-transform duration-300 ${offlineCache ? "translate-x-6" : "translate-x-0"}`}
                ></div>
              </button>
            </div>
            {""}
            {/* Cập nhật ứng dụng */}
            {""}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 lg:p-6 border-b border-slate-50 hover:bg-slate-50/50 transition-colors gap-4 sm:gap-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 shrink-0 bg-emerald-50 text-emerald-500 flex items-center justify-center">
                  <RefreshCw size={20} className={hasUpdate ? "animate-spin" : ""} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    Cập nhật ứng dụng
                    {hasUpdate && <span className="bg-rose-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 animate-pulse">Mới</span>}
                  </h4>
                  <p className="text-sm text-slate-500">
                    {hasUpdate ? "Có phiên bản mới, vui lòng cập nhật." : "Ứng dụng đang ở phiên bản mới nhất."}
                  </p>
                </div>
              </div>
              {hasUpdate && (
                <button
                  onClick={() => {
                     if (window.updateSW) window.updateSW(true);
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 shadow-md transition-colors text-sm w-full sm:w-auto self-end sm:self-auto"
                >
                  Cập nhật ngay
                </button>
              )}
            </div>
            {""}
            {/* Clear Cache */}
            {""}
            <div
              className="flex items-center justify-between p-4 lg:p-6 hover:bg-slate-50/50 transition-colors cursor-pointer"
              onClick={clearCache}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 shrink-0 bg-rose-50 text-rose-500 flex items-center justify-center">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">
                    Xoá bộ nhớ đệm (Clear Cache)
                  </h4>
                  <p className="text-sm text-slate-500">
                    Giải phóng 1.2 GB dung lượng thiết bị
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-300" />
            </div>
          </div>
        </div>
        {""}
        {/* TÀI KHOẢN (Account) */}
        {""}
        {isSalesLoggedIn && (
          <div className="bg-white shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
              <h3 className="font-bold text-slate-400 uppercase tracking-wider text-xs">
                Quản lý tài khoản
              </h3>
            </div>
            <div className="flex flex-col">
              <div className="p-4 lg:p-6 border-b border-slate-50 flex flex-col sm:flex-row items-center sm:items-center gap-4 lg:gap-6 text-center sm:text-left">
                <div className="w-20 h-20 shrink-0 bg-slate-100 border-4 border-white shadow-md flex items-center justify-center text-slate-400 shrink-0 relative overflow-hidden">
                  <img
                    src="https://i.pravatar.cc/150?img=11"
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col items-center sm:items-start w-full">
                  <h4 className="font-black text-lg lg:text-xl text-slate-900">
                    Sale Manager 01
                  </h4>
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 text-xs font-bold whitespace-nowrap">
                      <CheckCircle2 size={12} /> Đã xác thực{""}
                    </span>
                    <span className="text-slate-500 text-sm font-medium whitespace-nowrap">
                      Chuyên viên tư vấn cấp cao
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors whitespace-nowrap"
                >
                  {""}
                  Chỉnh sửa{""}
                </button>
              </div>
              <div
                onClick={() =>
                  showToast("Tính năng đổi mật khẩu đang được bảo trì.")
                }
                className="flex items-center justify-between p-4 lg:p-6 border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 shrink-0 bg-slate-100 text-slate-600 flex items-center justify-center">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">
                      Bảo mật & Đổi mật khẩu
                    </h4>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300" />
              </div>
              <div
                className="flex items-center justify-between p-4 lg:p-6 hover:bg-rose-50/50 transition-colors cursor-pointer"
                onClick={logout}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 shrink-0 bg-rose-100 text-rose-600 flex items-center justify-center">
                    <LogOut size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-rose-600 text-lg">
                      Đăng xuất hệ thống
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {""}
      </div>
      {""}
      {/* Global Toast */}
      {""}
      <AnimatePresence>
        {""}
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 bg-slate-900 text-white shadow-2xl shadow-slate-900/20 font-medium"
          >
            <Info size={18} className="text-primary" /> {toastMessage}
            {""}
          </motion.div>
        )}
        {""}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowEditModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md p-6 shadow-2xl z-10"
            >
              <h3 className="text-xl font-black text-slate-900 mb-4">
                Chỉnh sửa hồ sơ
              </h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">
                    Tên hiển thị
                  </label>
                  <input
                    type="text"
                    defaultValue="Sale Manager 01"
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 font-medium text-slate-900 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    defaultValue="0909 123 456"
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 font-medium text-slate-900 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">
                    Chức vụ
                  </label>
                  <input
                    type="text"
                    defaultValue="Chuyên viên tư vấn cấp cao"
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 font-medium text-slate-900 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    showToast("Đã lưu thông tin hồ sơ!");
                  }}
                  className="flex-1 py-3 font-bold text-white bg-primary shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
                >
                  Lưu thay đổi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
