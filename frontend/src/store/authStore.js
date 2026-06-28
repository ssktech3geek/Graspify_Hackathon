import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      loading: false,
      guestSessionStart: null,
      guestActionCount: 0,
      GUEST_TIME_LIMIT: 60 * 60 * 1000, // 60 minutes (1 hour) in milliseconds
      GUEST_ACTION_LIMIT: 10, // 10 actions

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
            set({ 
              token: data.token, 
              user: data.user || { name: 'Guest' }, 
              loading: false,
              guestSessionStart: Date.now(),
              guestActionCount: 0
            })
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

      incrementGuestAction: () => {
        const state = get()
        if (state.user?.name === 'Guest') {
          set({ guestActionCount: state.guestActionCount + 1 })
        }
      },

      isGuestLimitReached: () => {
        const state = get()
        if (state.user?.name !== 'Guest') return false
        
        const timeElapsed = Date.now() - (state.guestSessionStart || 0)
        const timeLimitReached = timeElapsed > state.GUEST_TIME_LIMIT
        const actionLimitReached = state.guestActionCount >= state.GUEST_ACTION_LIMIT
        
        return timeLimitReached || actionLimitReached
      },

      getGuestRemainingTime: () => {
        const state = get()
        if (state.user?.name !== 'Guest' || !state.guestSessionStart) return 0
        
        const elapsed = Date.now() - state.guestSessionStart
        const remaining = state.GUEST_TIME_LIMIT - elapsed
        return Math.max(0, remaining)
      },

      getGuestRemainingActions: () => {
        const state = get()
        if (state.user?.name !== 'Guest') return 0
        
        return Math.max(0, state.GUEST_ACTION_LIMIT - state.guestActionCount)
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

      signup: async (name, email, password) => {
        set({ loading: true })
        try {
          const res = await fetch('http://localhost:8080/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
          })
          const data = await res.json()
          if (data.token) {
            set({ token: data.token, user: { name, email }, loading: false })
            return { success: true }
          }
          set({ loading: false })
          return { success: false, error: data.error || 'Signup failed' }
        } catch (err) {
          console.error('Signup failed:', err)
          set({ loading: false })
          return { success: false, error: 'Something went wrong' }
        }
      },

      login: async (email, password) => {
        set({ loading: true })
        try {
          const res = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })
          const data = await res.json()
          if (data.token) {
            set({ token: data.token, user: { email }, loading: false })
            return { success: true }
          }
          set({ loading: false })
          return { success: false, error: data.error || 'Login failed' }
        } catch (err) {
          console.error('Login failed:', err)
          set({ loading: false })
          return { success: false, error: 'Something went wrong' }
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