import { useEffect, useRef, useState } from 'react'

const BACKUP_KEY = (canvasId) => `graspify_backup_${canvasId}`

export function useAutoSave(canvasId, panels) {
  const [saveStatus, setSaveStatus] = useState('saved') // 'saving' | 'saved' | 'error'
  const timerRef = useRef(null)

  // Auto-backup to localStorage every 30 seconds
  useEffect(() => {
    if (!canvasId || panels.length === 0) return

    timerRef.current = setInterval(() => {
      try {
        setSaveStatus('saving')
        const backup = {
          canvasId,
          panels,
          savedAt: new Date().toISOString(),
        }
        localStorage.setItem(BACKUP_KEY(canvasId), JSON.stringify(backup))
        setTimeout(() => setSaveStatus('saved'), 600)
      } catch (err) {
        setSaveStatus('error')
      }
    }, 30000)

    return () => clearInterval(timerRef.current)
  }, [canvasId, panels])

  // Check for existing backup
  const getBackup = () => {
    try {
      const raw = localStorage.getItem(BACKUP_KEY(canvasId))
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  // Clear backup after successful load
  const clearBackup = () => {
    localStorage.removeItem(BACKUP_KEY(canvasId))
  }

  return { saveStatus, getBackup, clearBackup }
}