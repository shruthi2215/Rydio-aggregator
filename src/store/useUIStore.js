import { create } from "zustand";

const useUIStore = create((set) => ({
  theme: "dark",
  isSheetOpen: false,
  safetyChecked: false,
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
  openSheet: () => set({ isSheetOpen: true }),
  closeSheet: () => set({ isSheetOpen: false }),
  setSafetyChecked: (value) => set({ safetyChecked: value }),
}));

export default useUIStore;

