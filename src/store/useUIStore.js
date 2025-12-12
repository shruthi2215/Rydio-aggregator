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
      // Ensure we have a valid array
      const current = state.safetyChecklist || [false, false, false];
      // Validate index bounds
      if (index < 0 || index >= current.length) return state;
      // Create a new array copy (immutable update)
      const next = [...current];
      // Update ONLY the specific index - other indices remain unchanged
      next[index] = value !== undefined ? value : !next[index];
      return { safetyChecklist: next };
    }),
  resetSafetyChecklist: () => set({ safetyChecklist: [false, false, false] }),
}));

export default useUIStore;

