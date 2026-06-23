import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      loading: false,

      setToken: (token, user = null) => {
        set({ token, user })
      },

      guestLogin: async () => {
        set({ loading: true })
        try {
          const res = await fetch('http://localhost:8080/api/auth/guest', {
            method: 'POST',
          })
          const data = await res.json()
          if (data.token) {
            set({ token: data.token, user: data.user || { name: 'Guest' }, loading: false })
            return true
          }
          set({ loading: false })
          return false
        } catch (err) {
          console.error('Guest login failed:', err)
          set({ loading: false })
          return false
        }
      },

      googleLogin: async (googleToken) => {
        set({ loading: true })
        try {
          const res = await fetch('http://localhost:8080/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: googleToken }),
          })
          const data = await res.json()
          if (data.token) {
            set({ token: data.token, user: data.user || null, loading: false })
            return true
          }
          set({ loading: false })
          return false
        } catch (err) {
          console.error('Google login failed:', err)
          set({ loading: false })
          return false
        }
      },

      logout: () => {
        set({ token: null, user: null })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)

export default useAuthStore