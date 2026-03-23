import { create } from 'zustand';
import { User, Role } from '@/types';

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  activeRole: Role;
  currentMode: "TALENT" | "CLIENT" | null;
  isSubscribed: boolean;
  login: (role: Role, user: User, isSubscribed?: boolean) => void;
  logout: () => void;
  switchMode: (mode: "TALENT" | "CLIENT") => void;
  setSubscribed: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  activeRole: "TALENT", // default role
  currentMode: null, // set during login or intent selection
  isSubscribed: false,
  login: (role, user, isSubscribed = false) => {
    // Determine initial UI mode based on role
    const defaultMode = role === "CLIENT" ? "CLIENT" : "TALENT";
    set({ 
      isLoggedIn: true, 
      user, 
      activeRole: role,
      currentMode: defaultMode,
      isSubscribed
    });
  },
  logout: () => set({ 
    isLoggedIn: false, 
    user: null,
    currentMode: null,
    isSubscribed: false
  }),
  switchMode: (mode) => set({ currentMode: mode }),
  setSubscribed: (status) => set({ isSubscribed: status }),
}));
