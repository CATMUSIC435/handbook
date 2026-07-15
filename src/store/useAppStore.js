import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAppStore = create(
  persist(
    (set) => ({
      isSalesLoggedIn: false,
      setIsSalesLoggedIn: (status) => set({ isSalesLoggedIn: status }),

      showLoginModal: false,
      setShowLoginModal: (status) => set({ showLoginModal: status }),

      isMobileMenuOpen: false,
      setIsMobileMenuOpen: (status) => set({ isMobileMenuOpen: status }),

      logout: () => set({ isSalesLoggedIn: false }),
    }),
    {
      name: "fenica-app-storage",
      partialize: (state) => ({ isSalesLoggedIn: state.isSalesLoggedIn }), // Chỉ lưu trạng thái login vào localStorage
    },
  ),
);
