import { defineStore } from 'pinia';
import axios from 'axios';
import type { AxiosError } from 'axios';
import type { RegisterPayload, AuthState, LoginPayload, AuthResponse } from '../types/auth';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    error: null,
    user: null,
    token: localStorage.getItem('token') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    setToken(token: string | null) {
      this.token = token;
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    },

    async register(payload: RegisterPayload): Promise<boolean> {
      try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/register`, {
          ...payload,
          type: 'user',
          role: 'member',
        });
        this.error = null;
        return true;
      } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message: string }>;
        this.error = axiosError.response?.data?.message || 'Registration failed';
        return false;
      }
    },

    async login(payload: LoginPayload): Promise<boolean> {
      try {
        const response = await axios.post<AuthResponse>(
          `${import.meta.env.VITE_API_BASE_URL}/login`,
          payload,
        );
        this.user = response.data.data.user;
        this.setToken(response.data.data.token);
        this.error = null;
        return true;
      } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message: string }>;
        this.error = axiosError.response?.data?.message || 'Login failed';
        return false;
      }
    },

    logout() {
      this.user = null;
      this.setToken(null);
      this.error = null;
    },
  },
});
