import { create } from "zustand";

const useUIStore = create((set) => ({
  theme: "dark",
  isSheetOpen: false,
  safetyChecklist: [false, false, false],
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
  openSheet: () => set({ isSheetOpen: true }),
  closeSheet: () => set({ isSheetOpen: false }),
  toggleSafetyItem: (index, value) =>
    set((state) => {
      if (index < 0 || index >= state.safetyChecklist.length) return {};
      const next = [...state.safetyChecklist];
      next[index] = value ?? !next[index];
      return { safetyChecklist: next };
    }),
  resetSafetyChecklist: () => set({ safetyChecklist: [false, false, false] }),
}));

export default useUIStore;

