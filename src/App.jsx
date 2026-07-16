import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Lock,
  User,
  Key,
  LogIn,
  X,
  Search,
  Scale,
  Calculator,
  StickyNote,
  Calendar,
  Users,
  Menu,
  Waypoints,
  Download,
  GraduationCap,
} from "lucide-react";
import { useAppStore } from "./store/useAppStore";
import Navigation from "./components/ui/Navigation";
import SectionIntro from "./pages/SectionIntro";
import SectionLocation from "./pages/SectionLocation";
import SectionMasterPlan from "./pages/SectionMasterPlan";
import SectionFilter from "./pages/SectionFilter";
import SectionPanorama from "./pages/SectionPanorama";
import SectionGallery from "./pages/SectionGallery";
import SectionVideo from "./pages/SectionVideo";
import SectionAmenities from "./pages/SectionAmenities";
import SectionSalesPolicy from "./pages/SectionSalesPolicy";
import SectionDocuments from "./pages/SectionDocuments";
import SectionFAQ from "./pages/SectionFAQ";
import SectionNews from "./pages/SectionNews";
import SectionNotifications from "./pages/SectionNotifications";
import SectionFavorites from "./pages/SectionFavorites";
import SectionNotes from "./pages/SectionNotes";
import SectionCalculator from "./pages/SectionCalculator";
import SectionAIAssistant from "./pages/SectionAIAssistant";
import SectionCalendar from "./pages/SectionCalendar";
import SectionWorkflow from "./pages/SectionWorkflow";
import SectionCustomerProfile from "./pages/SectionCustomerProfile";
import SectionSettings from "./pages/SectionSettings";
import SectionQuiz from "./pages/SectionQuiz";

import tabsData from "./data/tabs.json";

const iconMap = {
  Search,
  Scale,
  Calculator,
  Calendar,
  StickyNote,
  Users,
  Waypoints,
  GraduationCap,
};

const SALES_TABS = tabsData.salesTabs.map((tab) => ({
  ...tab,
  icon: iconMap[tab.icon],
}));

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isSalesLoggedIn,
    setIsSalesLoggedIn,
    showLoginModal,
    setShowLoginModal,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    logout,
  } = useAppStore();

  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // PWA Install state
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [isIosPrompt, setIsIosPrompt] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS detection
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };
    const isStandalone = () => {
      return ('standalone' in window.navigator) && (window.navigator.standalone);
    };

    if (isIos() && !isStandalone()) {
      setShowInstallBtn(true);
      setIsIosPrompt(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (isIosPrompt) {
      setShowIosInstructions(true);
      return;
    }
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowInstallBtn(false);
      }
      setDeferredPrompt(null);
    }
  };

  // Auto switch tab if currently on a restricted tab and user logs out
  useEffect(() => {
    const restrictedPaths = [
      "/filter",
      "/calculator",
      "/notes",
      "/calendar",
      "/workflow",
      "/crm",
      "/quiz",
    ];
    if (!isSalesLoggedIn && restrictedPaths.includes(location.pathname)) {
      navigate("/");
    }
  }, [isSalesLoggedIn, location.pathname, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "sale01" && password === "123456") {
      setIsSalesLoggedIn(true);
      setShowLoginModal(false);
      setLoginError("");
      setUsername("");
      setPassword("");
    } else {
      setLoginError("Tài khoản hoặc mật khẩu không chính xác.");
    }
  };

  return (
    <div className="flex h-screen bg-surface overflow-hidden relative">
      {/* Sidebar Navigation */}
      <Navigation
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col overflow-hidden w-full">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white/90 backdrop-blur-md border-b border-slate-200 shrink-0 z-30">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="font-bold text-slate-900 truncate px-4">
            Sổ Tay Dự Án
          </div>
          <div className="w-8"></div> {/* Spacer for centering */}
        </div>

        {/* Content Scroll Container */}
        <div className="flex-1 relative overflow-y-auto overflow-x-hidden">
          <div className="absolute inset-0 transition-opacity duration-300 pb-24 md:pb-0">
            <Routes>
              <Route path="/" element={<SectionIntro />} />
              <Route path="/location" element={<SectionLocation />} />
              <Route path="/masterplan" element={<SectionMasterPlan />} />
              <Route path="/panorama" element={<SectionPanorama />} />
              <Route path="/gallery" element={<SectionGallery />} />
              <Route path="/video" element={<SectionVideo />} />
              <Route path="/amenities" element={<SectionAmenities />} />
              <Route path="/sales" element={<SectionSalesPolicy />} />
              <Route path="/documents" element={<SectionDocuments />} />
              <Route path="/faq" element={<SectionFAQ />} />
              <Route path="/news" element={<SectionNews />} />
              <Route path="/notifications" element={<SectionNotifications />} />
              <Route path="/favorites" element={<SectionFavorites />} />
              <Route path="/ai" element={<SectionAIAssistant />} />
              <Route path="/settings" element={<SectionSettings />} />

              {/* Sales Only Content */}
              {isSalesLoggedIn && (
                <>
                  <Route path="/filter" element={<SectionFilter />} />
                  <Route path="/calculator" element={<SectionCalculator />} />
                  <Route path="/notes" element={<SectionNotes />} />
                  <Route path="/calendar" element={<SectionCalendar />} />
                  <Route path="/workflow" element={<SectionWorkflow />} />
                  <Route path="/crm" element={<SectionCustomerProfile />} />
                  <Route path="/quiz" element={<SectionQuiz />} />
                </>
              )}

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </main>

      {/* Floating Sales Dock (Bottom Center) */}
      <AnimatePresence>
        {isSalesLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40"
          >
            <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 px-2 py-2 flex items-center gap-1 shadow-2xl shadow-slate-900/50 max-w-[85vw] overflow-x-auto hide-scrollbar">
              {SALES_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = location.pathname === tab.path;
                return (
                  <button
                    key={tab.id}
                    onClick={() => navigate(tab.path)}
                    className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm transition-all duration-300 whitespace-nowrap shrink-0 ${
                      isActive
                        ? "bg-primary text-slate-900 shadow-lg shadow-primary/30 border border-[#d4ae6f]"
                        : "text-slate-400 hover:text-white hover:bg-white/10 border border-transparent"
                    }`}
                  >
                    <Icon size={18} className="shrink-0" />
                    <span className="hidden sm:block">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Sales Button (Bottom Right) */}
      {!isSalesLoggedIn && (
        <button
          onClick={() => setShowLoginModal(true)}
          className={`absolute bottom-6 right-6 w-12 h-12 shadow-xl flex items-center justify-center transition-all duration-300 z-50 border border-white/20 bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/30`}
          title="Khu vực nội bộ dành cho Sale"
        >
          <Lock size={20} />
        </button>
      )}

      {/* PWA Install Button */}
      <AnimatePresence>
        {showInstallBtn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-2 right-4 z-50 md:top-4 md:right-6"
          >
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 bg-primary text-white px-5 py-3 font-bold shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all rounded-md"
            >
              <Download size={20} /> <span className="hidden sm:inline">Cài đặt Ứng dụng</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Install Instructions Modal */}
      <AnimatePresence>
        {showIosInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end justify-center sm:items-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="w-full max-w-sm bg-white p-6 shadow-2xl relative rounded-t-3xl sm:rounded-3xl"
            >
              <button
                onClick={() => setShowIosInstructions(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 bg-slate-100 rounded-full"
              >
                <X size={16} />
              </button>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download size={32} />
                </div>
                <h3 className="font-bold text-xl mb-2 text-slate-900">Cài đặt trên iPhone/iPad</h3>
                <p className="text-slate-600 mb-6 text-sm">
                  Để cài đặt ứng dụng vào màn hình chính, vui lòng làm theo các bước sau:
                </p>
                <div className="flex flex-col gap-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center shrink-0 font-bold text-slate-700">1</div>
                    <p className="text-sm text-slate-700 pt-1.5">Nhấn vào biểu tượng <b>Chia sẻ (Share)</b> ở thanh công cụ dưới cùng của trình duyệt Safari.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center shrink-0 font-bold text-slate-700">2</div>
                    <p className="text-sm text-slate-700 pt-1.5">Chọn <b>Thêm vào MH chính (Add to Home Screen)</b>.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center shrink-0 font-bold text-slate-700">3</div>
                    <p className="text-sm text-slate-700 pt-1.5">Nhấn <b>Thêm (Add)</b> ở góc trên bên phải.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIosInstructions(false)}
                  className="w-full mt-8 py-3 bg-slate-900 text-white font-bold rounded-xl"
                >
                  Đã hiểu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-white p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary/20 text-primary flex items-center justify-center">
                  <Lock size={32} />
                </div>
              </div>

              <h2 className="text-2xl font-black text-slate-900 text-center mb-2">
                Đăng Nhập Quản Trị
              </h2>
              <p className="text-slate-500 text-center mb-8">
                Kích hoạt các tính năng đặc quyền dành cho chuyên viên kinh
                doanh.
              </p>

              <form onSubmit={handleLogin} className="flex flex-col gap-5">
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
                      placeholder="Tên đăng nhập (VD: sale01)"
                    />
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
                      placeholder="Mật khẩu (VD: 123456)"
                    />
                    <Key
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                {loginError && (
                  <p className="text-rose-500 text-sm font-bold text-center bg-rose-50 p-3 border border-rose-100">
                    {loginError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-4 mt-2 bg-slate-900 hover:bg-primary text-white hover:text-slate-900 font-bold text-lg shadow-xl shadow-slate-900/20 hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
                >
                  <LogIn size={20} /> Mở Khóa Tính Năng
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
