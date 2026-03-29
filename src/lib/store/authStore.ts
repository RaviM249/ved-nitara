import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      activeRole: "TALENT",
      currentMode: null,
      isSubscribed: false,
      login: (role, user, isSubscribed = false) => {
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
      updateUser: (data) => set((state) => ({
        user: state.user ? { ...state.user, ...data } : null
      })),
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
    }
  )
);
