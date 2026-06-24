import { useEffect, useState } from 'react'
import useAuthStore from '../store/authStore'
import useCanvasStore from '../store/canvasStore'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const { logout, user, isGuestLimitReached, getGuestRemainingTime, getGuestRemainingActions, incrementGuestAction } = useAuthStore()
  const {
    canvases,
    deletedCanvases,
    loading,
    deletedLoading,
    fetchCanvases,
    fetchDeletedCanvases,
    createCanvas,
    deleteCanvas,
    restoreCanvas,
    permanentDeleteCanvas,
  } = useCanvasStore()
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newSubject, setNewSubject] = useState('')
  const [creating, setCreating] = useState(false)
  const [activeTab, setActiveTab] = useState('active')
  const [searchQuery, setSearchQuery] = useState('')
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [guestWarningShown, setGuestWarningShown] = useState(false)

  const filteredCanvases = canvases.filter(c =>
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    fetchCanvases()
    fetchDeletedCanvases()
  }, [])

  useEffect(() => {
    if (user?.name === 'Guest' && !guestWarningShown) {
      const timer = setTimeout(() => {
        setGuestWarningShown(true)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [user, guestWarningShown])

  useEffect(() => {
    if (user?.name === 'Guest' && isGuestLimitReached()) {
      setShowLimitModal(true)
    }
  }, [user, isGuestLimitReached])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleCreate = async () => {
    if (!newTitle.trim()) return
    if (user?.name === 'Guest' && isGuestLimitReached()) {
      setShowLimitModal(true)
      return
    }
    setCreating(true)
    incrementGuestAction()
    const canvas = await createCanvas(newTitle, newSubject)
    setCreating(false)
    if (canvas) {
      setShowModal(false)
      setNewTitle('')
      setNewSubject('')
    }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (window.confirm('Delete this canvas?')) {
      await deleteCanvas(id)
    }
  }

  const handleRestore = async (id, e) => {
    e.stopPropagation()
    await restoreCanvas(id)
  }

  const handlePermanentDelete = async (id, e) => {
    e.stopPropagation()
    if (window.confirm('Permanently delete this canvas? This action cannot be undone.')) {
      await permanentDeleteCanvas(id)
    }
  }

  const cardEmojis = ['📘', '🧪', '📐', '🌍', '💻', '🎨', '🔬', '📊']
  const getEmoji = (id) => cardEmojis[id ? id.toString().charCodeAt(0) % cardEmojis.length : 0]

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#FFFDF4', minHeight: '100vh', overflow: 'hidden' }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes particleFloat { 0%{transform:translateY(0) scale(1);opacity:0.8} 100%{transform:translateY(-100px) scale(0.5);opacity:0} }
        @keyframes bgPulse { 0%,100%{transform:scale(1);opacity:0.05} 50%{transform:scale(1.05);opacity:0.09} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .canvas-card { background:#fff; border:1.5px solid #E8E0C8; border-radius:18px; padding:22px; cursor:pointer; transition:all 0.22s cubic-bezier(.2,.8,.2,1); position:relative; overflow:hidden; animation:fadeInUp 0.5s ease both; }
        .canvas-card:hover { transform:translateY(-5px); border-color:#F5C842; box-shadow:0 10px 28px rgba(245,200,66,0.18); }
        .canvas-card:hover .card-emoji { transform:scale(1.15) rotate(-6deg); }
        .card-emoji { transition:transform 0.25s ease; display:inline-block; }
        .new-canvas-btn { padding:13px 18px; background:#F5C842; border:none; border-radius:14px; font-weight:700; color:#2C2A1E; cursor:pointer; font-size:14px; transition:all 0.2s; box-shadow:0 4px 0 #D4A800; width:100%; }
        .new-canvas-btn:hover { transform:translateY(-2px); box-shadow:0 6px 0 #D4A800; }
        .new-canvas-btn:active { transform:translateY(2px); box-shadow:0 2px 0 #D4A800; }
        .logout-btn { width:100%; padding:11px 16px; background:transparent; border:1.5px solid #E8E0C8; border-radius:12px; color:#7A7560; cursor:pointer; font-size:13px; transition:all 0.2s; }
        .logout-btn:hover { background:#F5F0DC; border-color:#D8D0B8; }
        .tracker-btn { width:100%; padding:11px 16px; background:transparent; border:1.5px solid #E8E0C8; border-radius:12px; color:#2C2A1E; cursor:pointer; font-size:13px; font-weight:600; text-align:left; transition:all 0.2s; }
        .tracker-btn:hover { background:#F5F0DC; border-color:#D8D0B8; }
        .delete-btn { background:transparent; border:none; color:#B0A890; cursor:pointer; font-size:14px; width:26px; height:26px; border-radius:8px; display:flex; align-items:center; justify-content:center; transition:all 0.15s; }
        .delete-btn:hover { background:#FCEBEB; color:#E53E3E; }
        .canvas-card-deleted { cursor:default; opacity:0.85; }
        .canvas-card-deleted:hover { transform:none; box-shadow:none; border-color:#E8E0C8; }
        .restore-btn { background:#F5F0DC; border:1px solid #E8E0C8; color:#2C2A1E; cursor:pointer; font-size:11px; font-weight:600; padding:5px 10px; border-radius:8px; transition:all 0.15s; }
        .restore-btn:hover { background:#F5C842; border-color:#F5C842; }
        .permanent-delete-btn { background:transparent; border:1px solid #E8E0C8; color:#B0A890; cursor:pointer; font-size:11px; font-weight:600; padding:5px 10px; border-radius:8px; transition:all 0.15s; }
        .permanent-delete-btn:hover { background:#FCEBEB; color:#E53E3E; border-color:#E53E3E; }
        .tab-btn { background:transparent; border:none; padding:10px 4px; font-size:14px; font-weight:600; color:#B0A890; cursor:pointer; display:flex; align-items:center; gap:6px; border-bottom:2px solid transparent; transition:all 0.15s; }
        .tab-btn:hover { color:#7A7560; }
        .tab-btn-active { color:#2C2A1E; border-bottom-color:#F5C842; }
        .modal-input { width:100%; padding:13px 14px; border:1.5px solid #E8E0C8; border-radius:12px; font-size:14px; margin-bottom:12px; box-sizing:border-box; font-family:inherit; outline:none; transition:border-color 0.2s; }
        .modal-input:focus { border-color:#F5C842; }
        .modal-cancel { padding:11px 20px; background:transparent; border:1.5px solid #E8E0C8; border-radius:12px; color:#7A7560; cursor:pointer; font-size:14px; transition:all 0.2s; }
        .modal-cancel:hover { background:#F5F0DC; }
        .modal-create { padding:11px 20px; background:#F5C842; border:none; border-radius:12px; font-weight:700; color:#2C2A1E; cursor:pointer; font-size:14px; transition:all 0.2s; display:flex; align-items:center; gap:8px; }
        .modal-create:hover { transform:translateY(-1px); }
        .modal-create:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
        .spinner { width:14px; height:14px; border:2px solid rgba(44,42,30,0.25); border-top-color:#2C2A1E; border-radius:50%; animation:spin 0.6s linear infinite; }
        .search-input { width:100%; padding:10px 40px 10px 16px; border:1.5px solid #E8E0C8; border-radius:12px; font-size:14px; outline:none; box-sizing:border-box; font-family:inherit; background:#fff; transition:border-color 0.2s; }
        .search-input:focus { border-color:#F5C842; }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
        <div style={{ position: 'absolute', width: '320px', height: '320px', borderRadius: '50%', background: '#F5C842', top: '-100px', left: '-120px', opacity: 0.06, animation: 'bgPulse 7s ease-in-out infinite', pointerEvents: 'none' }} />

        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.logoArea}>
            <div style={styles.logo}>G</div>
            <span style={styles.logoText}>Graspify</span>
          </div>

          <button className="new-canvas-btn" onClick={() => setShowModal(true)}>
            + New canvas
          </button>

          <button className="tracker-btn" onClick={() => navigate('/tracker')}>
            📚 Study Tracker
          </button>

          {user?.name && (
            <div style={styles.userChip}>
              <div style={styles.userAvatar}>{(user.name || 'G')[0].toUpperCase()}</div>
              <span style={{ fontSize: '13px', color: '#7A7560', fontWeight: '500' }}>{user.name}</span>
            </div>
          )}

          <div style={styles.sidebarFooter}>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {/* Main content */}
        <div style={styles.main}>
          {[
            { top: '8%', left: '85%', size: 6, dur: '4s', delay: '0s' },
            { top: '40%', left: '95%', size: 8, dur: '5s', delay: '1s' },
            { top: '70%', left: '90%', size: 5, dur: '3.6s', delay: '0.5s' },
          ].map((p, i) => (
            <div key={i} style={{ position: 'fixed', top: p.top, left: p.left, width: p.size, height: p.size, borderRadius: '50%', background: '#F5C842', opacity: 0.35, animation: `particleFloat linear ${p.dur} ${p.delay} infinite`, pointerEvents: 'none' }} />
          ))}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F5F0DC', border: '1.5px solid #E8E0C8', borderRadius: '100px', padding: '5px 14px', fontSize: '12px', color: '#7A7560', marginBottom: '14px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F5C842', animation: 'pulse 1.5s ease-in-out infinite' }} />
                {canvases.length} active · {deletedCanvases.length} deleted
              </div>
              <h1 style={styles.heading}>
                {activeTab === 'active' ? 'Your canvases' : 'Deleted canvases'}
              </h1>
            </div>
          </div>

          <div style={styles.tabRow}>
            <button className={activeTab === 'active' ? 'tab-btn tab-btn-active' : 'tab-btn'} onClick={() => setActiveTab('active')}>
              Your canvases
              {canvases.length > 0 && <span style={styles.tabCount}>{canvases.length}</span>}
            </button>
            <button className={activeTab === 'deleted' ? 'tab-btn tab-btn-active' : 'tab-btn'} onClick={() => setActiveTab('deleted')}>
              Deleted canvases
              {deletedCanvases.length > 0 && <span style={styles.tabCount}>{deletedCanvases.length}</span>}
            </button>
          </div>

          {activeTab === 'active' && (
            <div style={{ position: 'relative', marginTop: '16px', marginBottom: '4px' }}>
              <input
                className="search-input"
                placeholder="🔍 Search canvases by title or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: '#7A7560', fontSize: '16px' }}>✕</button>
              )}
            </div>
          )}

          {activeTab === 'active' && (
            <>
              {loading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#7A7560', fontSize: '14px', marginTop: '20px' }}>
                  <div className="spinner" /> Loading your canvases...
                </div>
              )}

              {!loading && filteredCanvases.length === 0 && (
                <div style={styles.emptyState}>
                  <div style={{ fontSize: '40px', marginBottom: '14px', animation: searchQuery ? 'none' : 'float 3s ease-in-out infinite' }}>
                    {searchQuery ? '🔍' : '🎨'}
                  </div>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#2C2A1E', margin: '0 0 6px' }}>
                    {searchQuery ? `No results for "${searchQuery}"` : 'No canvases yet'}
                  </p>
                  <p style={{ fontSize: '13px', color: '#7A7560', margin: '0 0 20px' }}>
                    {searchQuery ? 'Try a different search term' : 'Create your first canvas to start studying smarter'}
                  </p>
                  {!searchQuery && (
                    <button className="new-canvas-btn" style={{ width: 'auto', padding: '12px 28px' }} onClick={() => setShowModal(true)}>
                      + Create your first canvas
                    </button>
                  )}
                </div>
              )}

              {!loading && filteredCanvases.length > 0 && (
                <div style={styles.grid}>
                  {filteredCanvases.map((canvas, i) => (
                    <div key={canvas.id} className="canvas-card" style={{ animationDelay: `${i * 0.05}s` }} onClick={() => navigate(`/canvas/${canvas.id}`)}>
                      <div style={styles.cardHeader}>
                        <span className="card-emoji" style={{ fontSize: '22px' }}>{getEmoji(canvas.id)}</span>
                        <button className="delete-btn" onClick={(e) => handleDelete(canvas.id, e)} title="Delete canvas">✕</button>
                      </div>
                      <h3 style={styles.cardTitle}>{canvas.title}</h3>
                      {canvas.subject && <p style={styles.cardSubject}>{canvas.subject}</p>}
                      <p style={styles.cardDate}>Updated {new Date(canvas.updatedAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'deleted' && (
            <>
              {deletedLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#7A7560', fontSize: '14px', marginTop: '20px' }}>
                  <div className="spinner" /> Loading deleted canvases...
                </div>
              )}

              {!deletedLoading && deletedCanvases.length === 0 && (
                <div style={styles.emptyState}>
                  <div style={{ fontSize: '40px', marginBottom: '14px' }}>🗂️</div>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#2C2A1E', margin: '0 0 6px' }}>Nothing deleted</p>
                  <p style={{ fontSize: '13px', color: '#7A7560', margin: 0 }}>Canvases you delete will show up here so you can always get them back</p>
                </div>
              )}

              {!deletedLoading && deletedCanvases.length > 0 && (
                <div style={styles.grid}>
                  {deletedCanvases.map((canvas, i) => (
                    <div key={canvas.id} className="canvas-card canvas-card-deleted" style={{ animationDelay: `${i * 0.05}s` }}>
                      <div style={styles.cardHeader}>
                        <span className="card-emoji" style={{ fontSize: '22px', opacity: 0.5 }}>{getEmoji(canvas.id)}</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="restore-btn" onClick={(e) => handleRestore(canvas.id, e)}>↺ Restore</button>
                          <button className="permanent-delete-btn" onClick={(e) => handlePermanentDelete(canvas.id, e)}>🗑 Delete</button>
                        </div>
                      </div>
                      <h3 style={{ ...styles.cardTitle, color: '#7A7560' }}>{canvas.title}</h3>
                      {canvas.subject && <p style={styles.cardSubject}>{canvas.subject}</p>}
                      <p style={styles.cardDate}>{canvas.deletedAt ? `Deleted ${new Date(canvas.deletedAt).toLocaleDateString()}` : 'Deleted'}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => !creating && setShowModal(false)}>
          <div style={{ ...styles.modal, animation: 'scaleIn 0.2s ease both' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>✨</div>
            <h2 style={styles.modalTitle}>Create new canvas</h2>
            <p style={{ fontSize: '13px', color: '#7A7560', margin: '0 0 18px' }}>Give it a name — you can add YouTube, notes, AI and PDFs once it's created.</p>
            <input className="modal-input" placeholder="Canvas title (e.g. Organic Chemistry)" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreate()} autoFocus />
            <input className="modal-input" placeholder="Subject (optional)" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreate()} />
            <div style={styles.modalButtons}>
              <button className="modal-cancel" onClick={() => setShowModal(false)} disabled={creating}>Cancel</button>
              <button className="modal-create" onClick={handleCreate} disabled={creating || !newTitle.trim()}>
                {creating && <div className="spinner" />}
                {creating ? 'Creating...' : 'Create canvas'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guest Limit Modal */}
      {showLimitModal && (
        <div style={styles.modalOverlay} onClick={() => setShowLimitModal(false)}>
          <div style={{ ...styles.modal, animation: 'scaleIn 0.2s ease both', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏰</div>
            <h2 style={styles.modalTitle}>Guest limit reached</h2>
            <p style={{ fontSize: '14px', color: '#7A7560', margin: '0 0 20px', lineHeight: 1.6 }}>
              You've reached the guest usage limit. Sign up or log in to continue using Graspify without restrictions.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexDirection: 'column' }}>
              <button className="btn-primary" onClick={() => navigate('/signup')} style={{ width: '100%' }}>
                Sign up or Login
              </button>
              <button className="modal-cancel" onClick={() => setShowLimitModal(false)} style={{ width: '100%' }}>
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guest Warning Banner */}
      {user?.name === 'Guest' && guestWarningShown && !showLimitModal && (
        <div style={{ 
          position: 'fixed', 
          top: '16px', 
          right: '16px', 
          background: '#FFFDF4', 
          border: '2px solid #F5C842', 
          borderRadius: '12px', 
          padding: '16px', 
          boxShadow: '0 4px 20px rgba(245, 200, 66, 0.3)',
          zIndex: 1000,
          maxWidth: '300px',
          animation: 'fadeInUp 0.3s ease both'
        }}>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>🎓 Guest Session</div>
          <div style={{ fontSize: '13px', color: '#7A7560', marginBottom: '12px' }}>
            <div>⏱️ Time left: {formatTime(getGuestRemainingTime())}</div>
            <div>📝 Actions left: {getGuestRemainingActions()}</div>
          </div>
          <button 
            onClick={() => navigate('/signup')} 
            style={{ 
              width: '100%', 
              padding: '8px 16px', 
              background: '#F5C842', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: '600', 
              color: '#2C2A1E', 
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Sign up to continue
          </button>
        </div>
      )}
    </div>
  )
}

const styles = {
  sidebar: { width: '240px', background: '#F5F0DC', borderRight: '1px solid #E8E0C8', display: 'flex', flexDirection: 'column', padding: '24px 16px', gap: '16px', position: 'relative', zIndex: 2 },
  logoArea: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' },
  logo: { width: '36px', height: '36px', background: '#F5C842', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#2C2A1E' },
  logoText: { fontSize: '18px', fontWeight: '700', color: '#2C2A1E' },
  userChip: { display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFDF4', border: '1px solid #E8E0C8', borderRadius: '12px', padding: '8px 10px' },
  userAvatar: { width: '24px', height: '24px', borderRadius: '50%', background: '#F5C842', color: '#2C2A1E', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  sidebarFooter: { marginTop: 'auto' },
  main: { flex: 1, padding: '40px 48px', position: 'relative', zIndex: 2, overflowY: 'auto' },
  heading: { fontSize: '30px', fontWeight: '800', color: '#2C2A1E', margin: 0, letterSpacing: '-0.5px' },
  tabRow: { display: 'flex', gap: '20px', borderBottom: '1.5px solid #E8E0C8', marginBottom: '8px' },
  tabCount: { background: '#E8E0C8', color: '#7A7560', fontSize: '11px', fontWeight: '700', padding: '1px 7px', borderRadius: '100px' },
  emptyState: { padding: '70px 20px', textAlign: 'center', background: '#F5F0DC', border: '1.5px dashed #D8D0B8', borderRadius: '20px', marginTop: '24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', marginTop: '28px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: '#2C2A1E', margin: 0 },
  cardSubject: { fontSize: '13px', color: '#7A7560', margin: '6px 0 0' },
  cardDate: { fontSize: '12px', color: '#B0A890', marginTop: '16px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(44, 42, 30, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { background: '#FFFDF4', borderRadius: '18px', padding: '28px', width: '400px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' },
  modalTitle: { fontSize: '19px', fontWeight: '700', color: '#2C2A1E', margin: 0 },
  modalButtons: { display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' },
}

export default Dashboard