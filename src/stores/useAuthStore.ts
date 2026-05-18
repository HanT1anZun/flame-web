import { create } from "zustand";
import { authApi } from "../api/auth";

interface User {
  id: string;
  username?: string;
  is_anonymous: boolean;
  role?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAnonymous: boolean;
  isLoggedIn: boolean;
  isLoading: boolean;

  anonymousLogin: () => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

function getDeviceId(): string {
  let deviceId = localStorage.getItem("flame_device_id");
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem("flame_device_id", deviceId);
  }
  return deviceId;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem("flame_token"),
  user: null,
  isAnonymous: true,
  isLoggedIn: !!localStorage.getItem("flame_token"),
  isLoading: false,

  anonymousLogin: async () => {
    set({ isLoading: true });
    try {
      const deviceId = getDeviceId();
      const data = await authApi.anonymous(deviceId);
      localStorage.setItem("flame_token", data.access_token);
      set({
        token: data.access_token,
        user: { id: data.user.id, is_anonymous: true },
        isAnonymous: true,
        isLoggedIn: true,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  register: async (username: string, password: string) => {
    const data = await authApi.register(username, password);
    localStorage.setItem("flame_token", data.access_token);
    set({
      token: data.access_token,
      user: { id: data.user.id, username: data.user.username, is_anonymous: false },
      isAnonymous: false,
      isLoggedIn: true,
    });
  },

  login: async (username: string, password: string) => {
    const data = await authApi.login(username, password);
    localStorage.setItem("flame_token", data.access_token);
    set({
      token: data.access_token,
      user: { id: data.user.id, username: data.user.username, is_anonymous: false, role: data.user.role },
      isAnonymous: false,
      isLoggedIn: true,
    });
  },

  logout: () => {
    localStorage.removeItem("flame_token");
    localStorage.removeItem("flame_user");
    set({
      token: null,
      user: null,
      isAnonymous: true,
      isLoggedIn: false,
    });
    get().anonymousLogin();
  },
}));
