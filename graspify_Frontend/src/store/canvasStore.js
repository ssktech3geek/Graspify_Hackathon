import { create } from 'zustand'
import axios from 'axios'
import useAuthStore from './authStore'

const API_URL = 'http://localhost:8080/api/canvases'

const getAuthHeader = () => {
  const token = useAuthStore.getState().token
  return { headers: { Authorization: `Bearer ${token}` } }
}

const useCanvasStore = create((set, get) => ({
  canvases: [],
  deletedCanvases: [],
  loading: false,
  deletedLoading: false,
  error: null,

  fetchCanvases: async () => {
    set({ loading: true, error: null })
    try {
      const res = await axios.get(API_URL, getAuthHeader())
      set({ canvases: res.data, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  fetchDeletedCanvases: async () => {
    set({ deletedLoading: true, error: null })
    try {
      const res = await axios.get(`${API_URL}/deleted`, getAuthHeader())
      set({ deletedCanvases: res.data, deletedLoading: false })
    } catch (err) {
      set({ error: err.message, deletedLoading: false })
    }
  },

  createCanvas: async (title, subject) => {
    try {
      const res = await axios.post(API_URL, { title, subject }, getAuthHeader())
      set({ canvases: [res.data, ...get().canvases] })
      return res.data
    } catch (err) {
      set({ error: err.message })
      return null
    }
  },

  deleteCanvas: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeader())
      const removed = get().canvases.find((c) => c.id === id)
      set({
        canvases: get().canvases.filter((c) => c.id !== id),
        deletedCanvases: removed
          ? [{ ...removed, deletedAt: new Date().toISOString() }, ...get().deletedCanvases]
          : get().deletedCanvases,
      })
    } catch (err) {
      set({ error: err.message })
    }
  },

  restoreCanvas: async (id) => {
    try {
      const res = await axios.post(`${API_URL}/${id}/restore`, {}, getAuthHeader())
      set({
        deletedCanvases: get().deletedCanvases.filter((c) => c.id !== id),
        canvases: [res.data, ...get().canvases],
      })
    } catch (err) {
      set({ error: err.message })
    }
  },
}))

export default useCanvasStore