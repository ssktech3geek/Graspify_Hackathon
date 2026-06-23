import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useTrackerStore from '../store/trackerStore'

function Tracker() {
  const navigate = useNavigate()
  const { sessions, weeklySessions, activeSession, fetchSessions, fetchWeeklySessions, startSession, endSession } = useTrackerStore()

  const [subject, setSubject] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [view, setView] = useState('list') // 'list' | 'timetable'
  const [notes, setNotes] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    fetchSessions()
    fetchWeeklySessions()
  }, [])

  useEffect(() => {
    if (activeSession) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    } else {
      clearInterval(timerRef.current)
      setElapsed(0)
    }
    return () => clearInterval(timerRef.current)
  }, [activeSession])

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const formatDuration = (minutes) => {
    if (!minutes) return '< 1 min'
    if (minutes < 60) return `${minutes} min`
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m > 0 ? `${h}h ${m}m` : `${h}h`
  }

  const getTotalMinutes = (list) =>
    list.reduce((sum, s) => sum + (s.durationMinutes || 0), 0)

  const getTodaySessions = () => {
    const today = new Date().toDateString()
    return sessions.filter(s => new Date(s.startTime).toDateString() === today)
  }

  const getWeekDays = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dayStr = d.toDateString()
      const daySessions = weeklySessions.filter(
        s => new Date(s.startTime).toDateString() === dayStr
      )
      const totalMin = getTotalMinutes(daySessions)
      days.push({
        label: d.toLocaleDateString('en', { weekday: 'short' }),
        date: d.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        minutes: totalMin,
        isToday: i === 0,
      })
    }
    return days
  }

  const maxMinutes = Math.max(...getWeekDays().map(d => d.minutes), 60)

  const handleStart = async () => {
    if (!subject.trim()) {
      alert('Please enter a subject first!')
      return
    }
    await startSession(subject)
  }

  const handleEnd = async () => {
    await endSession(notes)
    setNotes('')
    fetchSessions()
    fetchWeeklySessions()
  }

  const weekDays = getWeekDays()
  const todaySessions = getTodaySessions()
  const totalWeekMinutes = getTotalMinutes(weeklySessions)
  const totalTodayMinutes = getTotalMinutes(todaySessions)

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#FFFDF4', minHeight: '100vh' }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .session-row { display:flex; align-items:center; gap:12px; padding:14px 0; border-bottom:1px solid #F5F0DC; animation:fadeInUp 0.4s ease both; }
        .session-row:last-child { border-bottom:none; }
      `}</style>

      {/* Header */}
      <div style={{ background: '#F5F0DC', borderBottom: '1px solid #E8E0C8', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: '1.5px solid #E8E0C8', borderRadius: '10px', padding: '8px 16px', cursor: 'pointer', fontSize: '14px', color: '#2C2A1E' }}>
          ← Dashboard
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#2C2A1E' }}>📚 Study Tracker</h1>
          <p style={{ margin: 0, fontSize: '12px', color: '#7A7560' }}>Track your study sessions and build a streak</p>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Today', value: formatDuration(totalTodayMinutes), sub: `${todaySessions.length} sessions`, emoji: '☀️' },
            { label: 'This week', value: formatDuration(totalWeekMinutes), sub: `${weeklySessions.length} sessions`, emoji: '📅' },
            { label: 'All time', value: formatDuration(getTotalMinutes(sessions)), sub: `${sessions.length} total sessions`, emoji: '🏆' },
          ].map((stat, i) => (
            <div key={i} style={{ background: '#fff', border: '1.5px solid #E8E0C8', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '6px' }}>{stat.emoji}</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#2C2A1E' }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: '#7A7560', marginTop: '4px' }}>{stat.label}</div>
              <div style={{ fontSize: '11px', color: '#B0A890', marginTop: '2px' }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Weekly bar chart */}
        <div style={{ background: '#fff', border: '1.5px solid #E8E0C8', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: '700', color: '#2C2A1E' }}>📊 This week</h2>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' }}>
            {weekDays.map((day, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '10px', color: '#7A7560' }}>
                  {day.minutes > 0 ? formatDuration(day.minutes) : ''}
                </div>
                <div style={{
                  width: '100%',
                  height: `${Math.max(4, (day.minutes / maxMinutes) * 90)}px`,
                  background: day.isToday ? '#F5C842' : day.minutes > 0 ? '#F5E090' : '#F5F0DC',
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.5s ease',
                  border: day.isToday ? '2px solid #D4A800' : 'none',
                }} />
                <div style={{ fontSize: '11px', fontWeight: day.isToday ? '700' : '400', color: day.isToday ? '#2C2A1E' : '#7A7560' }}>
                  {day.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timer */}
        <div style={{ background: '#fff', border: '1.5px solid #E8E0C8', borderRadius: '16px', padding: '28px', marginBottom: '32px', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: '700', color: '#2C2A1E' }}>⏱ Session Timer</h2>

          {!activeSession ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What are you studying? (e.g. Maths, Physics)"
                style={{ width: '100%', maxWidth: '400px', padding: '12px 16px', border: '1.5px solid #E8E0C8', borderRadius: '12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              />
              <button
                onClick={handleStart}
                style={{ padding: '14px 40px', background: '#F5C842', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: '700', color: '#2C2A1E', cursor: 'pointer', boxShadow: '0 4px 0 #D4A800' }}
              >
                ▶ Start Session
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '13px', color: '#7A7560' }}>
                Studying: <strong style={{ color: '#2C2A1E' }}>{activeSession.subject}</strong>
              </div>
              <div style={{ fontSize: '56px', fontWeight: '800', color: '#2C2A1E', fontVariantNumeric: 'tabular-nums', letterSpacing: '-2px', animation: 'pulse 2s ease-in-out infinite' }}>
                {formatTime(elapsed)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#7A7560' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E', animation: 'pulse 1s ease-in-out infinite' }} />
                Session in progress
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes before ending (optional)..."
                style={{ width: '100%', maxWidth: '400px', padding: '10px 14px', border: '1.5px solid #E8E0C8', borderRadius: '10px', fontSize: '13px', resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                rows={2}
              />
              <button
                onClick={handleEnd}
                style={{ padding: '14px 40px', background: '#2C2A1E', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: '700', color: '#FFFDF4', cursor: 'pointer' }}
              >
                ⏹ End Session
              </button>
            </div>
          )}
        </div>

        {/* Session history */}
        <div style={{ background: '#fff', border: '1.5px solid #E8E0C8', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#2C2A1E' }}>📋 Session History</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setView('list')}
                style={{ padding: '6px 14px', borderRadius: '8px', border: '1.5px solid #E8E0C8', background: view === 'list' ? '#F5C842' : 'transparent', fontWeight: '600', fontSize: '12px', cursor: 'pointer', color: '#2C2A1E' }}
              >
                List
              </button>
              <button
                onClick={() => setView('timetable')}
                style={{ padding: '6px 14px', borderRadius: '8px', border: '1.5px solid #E8E0C8', background: view === 'timetable' ? '#F5C842' : 'transparent', fontWeight: '600', fontSize: '12px', cursor: 'pointer', color: '#2C2A1E' }}
              >
                Timetable
              </button>
            </div>
          </div>

          {sessions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7A7560', fontSize: '14px' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>📖</div>
              No sessions yet — start your first one above!
            </div>
          )}

          {view === 'list' && sessions.map((s, i) => (
            <div key={s.id} className="session-row" style={{ animationDelay: `${i * 0.05}s` }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#F5F0DC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                📚
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#2C2A1E' }}>{s.subject || 'General'}</div>
                <div style={{ fontSize: '12px', color: '#7A7560', marginTop: '2px' }}>
                  {new Date(s.startTime).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })} · {new Date(s.startTime).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                  {s.endTime && ` → ${new Date(s.endTime).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}`}
                </div>
                {s.notes && <div style={{ fontSize: '12px', color: '#7A7560', marginTop: '4px', fontStyle: 'italic' }}>"{s.notes}"</div>}
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#2C2A1E' }}>{formatDuration(s.durationMinutes)}</div>
                {!s.endTime && <div style={{ fontSize: '11px', color: '#22C55E', fontWeight: '600' }}>Active</div>}
              </div>
            </div>
          ))}

          {view === 'timetable' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                {weekDays.map((day, i) => {
                  const daySessions = weeklySessions.filter(
                    s => new Date(s.startTime).toDateString() === new Date(Date.now() - (6 - i) * 86400000).toDateString()
                  )
                  return (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: day.isToday ? '#2C2A1E' : '#7A7560', marginBottom: '6px' }}>
                        {day.label}
                      </div>
                      <div style={{ fontSize: '10px', color: '#B0A890', marginBottom: '8px' }}>{day.date}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {daySessions.length === 0 ? (
                          <div style={{ height: '60px', background: '#F5F0DC', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#B0A890' }}>—</div>
                        ) : daySessions.map((s, j) => (
                          <div key={j} style={{ background: day.isToday ? '#F5C842' : '#F5E090', borderRadius: '8px', padding: '6px 4px', fontSize: '10px', fontWeight: '600', color: '#2C2A1E' }}>
                            {s.subject}<br />
                            <span style={{ fontWeight: '400', color: '#7A7560' }}>{formatDuration(s.durationMinutes)}</span>
                          </div>
                        ))}
                      </div>
                      {day.minutes > 0 && (
                        <div style={{ fontSize: '11px', color: '#7A7560', marginTop: '6px', fontWeight: '600' }}>
                          {formatDuration(day.minutes)}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Tracker