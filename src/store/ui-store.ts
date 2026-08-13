"use client";

import { create } from "zustand";

interface UiState {
  sidebarOpen: boolean;
  mobileNavOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
}

/** Transient UI state (not persisted). */
export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  mobileNavOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
}));
