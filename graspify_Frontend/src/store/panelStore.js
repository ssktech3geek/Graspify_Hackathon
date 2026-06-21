import { create } from 'zustand'
import axios from 'axios'
import useAuthStore from './authStore'

const BASE_URL = 'http://localhost:8080/api'

const getAuthHeader = () => {
  const token = useAuthStore.getState().token
  return { headers: { Authorization: `Bearer ${token}` } }
}

const usePanelStore = create((set, get) => ({
  panels: [],
  loading: false,
  error: null,

  fetchPanels: async (canvasId) => {
    set({ loading: true, error: null })
    try {
      const res = await axios.get(`${BASE_URL}/canvases/${canvasId}/panels`, getAuthHeader())
      set({ panels: res.data, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

addPanel: async (canvasId, type, content) => {
    try {
      const orderIndex = get().panels.length
      const offset = orderIndex * 30  // each panel offset by 30px
      const res = await axios.post(
        `${BASE_URL}/canvases/${canvasId}/panels`,
        {
          type,
          positionX: 20 + offset,
          positionY: 20 + offset,
          width: 420,
          height: 320,
          content: JSON.stringify(content),
          orderIndex,
        },
        getAuthHeader()
      )
      set({ panels: [...get().panels, res.data] })
      return res.data
    } catch (err) {
      set({ error: err.message })
      return null
    }
  },

  updatePanel: async (id, updates) => {
    try {
      const res = await axios.put(`${BASE_URL}/panels/${id}`, updates, getAuthHeader())
      set({
        panels: get().panels.map((p) => (p.id === id ? res.data : p)),
      })
    } catch (err) {
      set({ error: err.message })
    }
  },

  deletePanel: async (id) => {
    try {
      await axios.delete(`${BASE_URL}/panels/${id}`, getAuthHeader())
      set({ panels: get().panels.filter((p) => p.id !== id) })
    } catch (err) {
      set({ error: err.message })
    }
  },

  clearPanels: () => set({ panels: [] }),
}))

export default usePanelStore