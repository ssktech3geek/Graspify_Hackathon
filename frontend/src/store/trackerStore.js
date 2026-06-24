import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'
import useAuthStore from './authStore'

const API_URL = 'http://localhost:8080/api/sessions'

const getAuthHeader = () => {
  const token = useAuthStore.getState().token
  return { headers: { Authorization: `Bearer ${token}` } }
}

const useTrackerStore = create(
  persist(
    (set, get) => ({
      sessions: [],
      weeklySessions: [],
      activeSession: null,
      sessionStartTime: null,
      loading: false,

      fetchSessions: async () => {
        set({ loading: true })
        try {
          const res = await axios.get(API_URL, getAuthHeader())
          set({ sessions: res.data, loading: false })
        } catch {
          set({ loading: false })
        }
      },

      fetchWeeklySessions: async () => {
        try {
          const res = await axios.get(`${API_URL}/weekly`, getAuthHeader())
          set({ weeklySessions: res.data })
        } catch {}
      },

      startSession: async (subject) => {
        try {
          const res = await axios.post(`${API_URL}/start`, { subject }, getAuthHeader())
          set({ 
            activeSession: res.data,
            sessionStartTime: new Date().toISOString()
          })
          return res.data
        } catch {}
      },

      endSession: async (notes = '') => {
        const { activeSession } = get()
        if (!activeSession) return
        try {
          const res = await axios.post(
            `${API_URL}/${activeSession.id}/end`,
            { notes },
            getAuthHeader()
          )
          set((state) => ({
            activeSession: null,
            sessionStartTime: null,
            sessions: [res.data, ...state.sessions],
          }))
        } catch {}
      },

      getElapsedTime: () => {
        const { sessionStartTime } = get()
        if (!sessionStartTime) return 0
        return Math.floor((new Date() - new Date(sessionStartTime)) / 1000)
      },
    }),
    {
      name: 'tracker-storage',
      partialize: (state) => ({
        activeSession: state.activeSession,
        sessionStartTime: state.sessionStartTime,
      }),
    }
  )
)

export default useTrackerStore