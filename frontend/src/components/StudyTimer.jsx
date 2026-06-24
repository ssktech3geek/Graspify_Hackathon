import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useTrackerStore from '../store/trackerStore'
import useAuthStore from '../store/authStore'

function StudyTimer() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { activeSession, endSession, getElapsedTime } = useTrackerStore()
  const [elapsed, setElapsed] = useState(0)
  const [notes, setNotes] = useState('')
  const [showNotes, setShowNotes] = useState(false)

  useEffect(() => {
    if (!activeSession) {
      setElapsed(0)
      return
    }

    const interval = setInterval(() => {
      setElapsed(getElapsedTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [activeSession, getElapsedTime])

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handleEnd = async () => {
    await endSession(notes)
    setNotes('')
    setShowNotes(false)
  }

  if (!activeSession || user?.name === 'Guest') return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: '#FFFDF4',
      border: '2px solid #F5C842',
      borderRadius: '12px',
      padding: '12px 16px',
      boxShadow: '0 4px 16px rgba(245, 200, 66, 0.3)',
      zIndex: 1000,
      minWidth: '200px',
      animation: 'fadeInUp 0.3s ease both'
    }}>
      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            background: '#22C55E', 
            animation: 'pulse 1s ease-in-out infinite' 
          }} />
          <span style={{ fontSize: '12px', color: '#7A7560', fontWeight: '600' }}>
            {activeSession.subject || 'Studying'}
          </span>
        </div>
        <div style={{ 
          fontSize: '18px', 
          fontWeight: '800', 
          color: '#2C2A1E', 
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.5px'
        }}>
          {formatTime(elapsed)}
        </div>
      </div>

      {!showNotes ? (
        <button
          onClick={() => setShowNotes(true)}
          style={{
            width: '100%',
            marginTop: '8px',
            padding: '6px 12px',
            background: '#2C2A1E',
            border: 'none',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#FFFDF4',
            cursor: 'pointer'
          }}
        >
          End Session
        </button>
      ) : (
        <div style={{ marginTop: '8px' }}>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes (optional)..."
            style={{
              width: '100%',
              padding: '6px 8px',
              border: '1.5px solid #E8E0C8',
              borderRadius: '8px',
              fontSize: '11px',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              marginBottom: '6px'
            }}
            rows={2}
          />
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={handleEnd}
              style={{
                flex: 1,
                padding: '6px 8px',
                background: '#F5C842',
                border: 'none',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
                color: '#2C2A1E',
                cursor: 'pointer'
              }}
            >
              Save
            </button>
            <button
              onClick={() => setShowNotes(false)}
              style={{
                flex: 1,
                padding: '6px 8px',
                background: 'transparent',
                border: '1px solid #E8E0C8',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
                color: '#7A7560',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudyTimer
