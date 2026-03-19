import { create } from 'zustand';
import { User, Role } from '@/types';

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  activeRole: Role;
  isSubscribed: boolean;
  login: (role: Role, user: User, isSubscribed?: boolean) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
  setSubscribed: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  activeRole: "ARTIST", // default role
  isSubscribed: false,
  login: (role, user, isSubscribed = true) => set({ 
    isLoggedIn: true, 
    user, 
    activeRole: role,
    isSubscribed
  }),
  logout: () => set({ 
    isLoggedIn: false, 
    user: null,
    isSubscribed: false
  }),
  switchRole: (role) => set({ activeRole: role }),
  setSubscribed: (status) => set({ isSubscribed: status }),
}));
