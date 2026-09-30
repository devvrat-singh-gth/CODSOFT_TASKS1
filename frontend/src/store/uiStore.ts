import { create } from "zustand";

type Theme = "light" | "dark" | "system";

interface UiState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isMobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  theme: "system",
  setTheme: (theme) => set({ theme }),
  isMobileNavOpen: false,
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
}));
