import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      login: (user) =>
        set({
          user,
          isAuthenticated: true,
          isAdmin: user.rol === 'ADMIN',
        }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
        }),
      updateUser: (updatedUser) =>
        set((state) => {
          const newUser = state.user ? { ...state.user, ...updatedUser } : null;
          return {
            user: newUser,
            isAdmin: updatedUser.rol
              ? updatedUser.rol === 'ADMIN'
              : (newUser && newUser.rol === 'ADMIN') || false,
          };
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (state && state.user) {
          return {
            ...state,
            isAuthenticated: true,
            isAdmin: state.user.rol === 'ADMIN',
          };
        }
        return {
          user: null,
          isAuthenticated: false,
          isAdmin: false,
        };
      },
    }
  )
);