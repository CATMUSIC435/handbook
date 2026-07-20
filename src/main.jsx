import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { registerSW } from 'virtual:pwa-register';

// Tự động kiểm tra bản cập nhật mới mỗi 60 phút
window.pwaUpdateAvailable = false;
window.updateSW = registerSW({
  onRegistered(r) {
    r && setInterval(() => {
      r.update();
    }, 60 * 60 * 1000); // 1 tiếng
  },
  onNeedRefresh() {
    console.log("New content available, please refresh.");
    window.pwaUpdateAvailable = true;
    window.dispatchEvent(new CustomEvent('pwa-update-available'));
  },
  onOfflineReady() {
    console.log("Ứng dụng đã sẵn sàng hoạt động ngoại tuyến!");
  }
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
