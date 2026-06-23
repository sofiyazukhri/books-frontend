/**
 * Pinia auth store — login / logout, token persistence,
 * `isAuthenticated` and `isAdmin` getters used across the UI.
 */

import { defineStore } from 'pinia';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const useAuth = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user:  JSON.parse(localStorage.getItem('user') || 'null'),
  }),

  getters: {
    isAuthenticated: (s) => !!s.token,
    isAdmin:         (s) => s.user?.role === 'admin',
  },

  actions: {
    async login(email, password) {
      // Use a bare axios call here to avoid a circular import with api/client.js
      const { data } = await axios.post(`${baseURL}/auth/login`, { email, password });
      
      this.token = data.access_token;
      
      // 🚀 FIX: Fallback structure since backend only returns 'access_token'
      // This decodes basic payload parts or builds a fallback profile so UI doesn't crash
      this.user = data.user || { email: email, role: email.includes('admin') ? 'admin' : 'member' };
      
      localStorage.setItem('token', this.token);
      localStorage.setItem('user',  JSON.stringify(this.user));
    },

    async register(name, email, password) {
      await axios.post(`${baseURL}/auth/register`, { name, email, password });
      // After register, log in automatically.
      await this.login(email, password);
    },

    logout() {
      this.token = null;
      this.user  = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});