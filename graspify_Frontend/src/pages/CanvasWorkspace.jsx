import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import usePanelStore from '../store/panelStore'
import PanelContainer from '../components/panels/PanelContainer'
import YoutubePanel from '../components/panels/YoutubePanel'
import NotesPanel from '../components/panels/NotesPanel'
import AiPanel from '../components/panels/AiPanel'
import PdfPanel from '../components/panels/PdfPanel'
import { useAutoSave } from '../hooks/useAutoSave'

function CanvasWorkspace() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { panels, fetchPanels, addPanel, updatePanel, deletePanel, clearPanels } = usePanelStore()

  const [highlightPopup, setHighlightPopup] = useState(null)
  const [highlightedText, setHighlightedText] = useState('')
  const [highlightAnswer, setHighlightAnswer] = useState('')
  const [showHighlightAnswer, setShowHighlightAnswer] = useState(false)
  const [showRecovery, setShowRecovery] = useState(false)
  const [backup, setBackup] = useState(null)
  const [canvasTitle, setCanvasTitle] = useState('Canvas')
  const [editingTitle, setEditingTitle] = useState(false)

  const { saveStatus, getBackup, clearBackup } = useAutoSave(id, panels)

  useEffect(() => {
    fetchPanels(id)

    const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token
    fetch(`http://localhost:8080/api/canvases/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { if (data.title) setCanvasTitle(data.title) })
      .catch(() => {})

    const existingBackup = getBackup()
    if (existingBackup && existingBackup.panels?.length > 0) {
      setBackup(existingBackup)
      setShowRecovery(true)
    }
    return () => clearPanels()
  }, [id])

  const handleMouseUp = useCallback((e) => {
    const selection = window.getSelection()
    const text = selection?.toString().trim()
    if (text && text.length > 3) {
      setHighlightedText(text)
      setHighlightPopup({ x: e.clientX, y: e.clientY })
    } else {
      setHighlightPopup(null)
    }
  }, [])

  const handleAskAboutHighlight = async () => {
    const text = highlightedText
    setHighlightPopup(null)
    setShowHighlightAnswer(true)
    setHighlightAnswer('Thinking...')

    try {
      const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token
      const res = await fetch('http://localhost:8080/api/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question: `Explain this: "${text}"`, context: '' })
      })
      const data = await res.json()
      setHighlightAnswer(data.answer || 'No response')
    } catch (err) {
      setHighlightAnswer('Error: ' + err.message)
    }
  }

  const handleTitleSave = async () => {
    setEditingTitle(false)
    const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token
    await fetch(`http://localhost:8080/api/canvases/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title: canvasTitle })
    })
  }

  const getPanelTitle = (type) => {
    switch (type) {
      case 'YOUTUBE': return '▶ YouTube'
      case 'NOTES': return '📝 Notes'
      case 'AI': return '✨ AI Assistant'
      case 'PDF': return '📄 PDF'
      default: return type
    }
  }

  const handleAddYoutube = () => addPanel(id, 'YOUTUBE', { url: '' })
  const handleAddNotes = () => addPanel(id, 'NOTES', { text: '' })
  const handleAddAi = () => addPanel(id, 'AI', {})
  const handleAddPdf = () => addPanel(id, 'PDF', {})
  const handleContentChange = (panelId, content) => updatePanel(panelId, { content })

  return (
    <div style={styles.container} onMouseUp={handleMouseUp}>
      <div style={styles.toolbar}>

        {/* Left — back + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          {editingTitle ? (
            <input
              autoFocus
              value={canvasTitle}
              onChange={(e) => setCanvasTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#2C2A1E',
                border: 'none',
                borderBottom: '2px solid #F5C842',
                background: 'transparent',
                outline: 'none',
                width: '200px',
              }}
            />
          ) : (
            <span
              onClick={() => setEditingTitle(true)}
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#2C2A1E',
                cursor: 'pointer',
                borderBottom: '2px solid transparent',
              }}
              title="Click to rename"
            >
              {canvasTitle} ✏️
            </span>
          )}
        </div>

        {/* Center — panel buttons */}
        <div style={styles.toolbarActions}>
          <button style={styles.addBtn} onClick={handleAddYoutube}>+ YouTube</button>
          <button style={styles.addBtn} onClick={handleAddNotes}>+ Notes</button>
          <button style={styles.addBtn} onClick={handleAddAi}>+ AI</button>
          <button style={styles.addBtn} onClick={handleAddPdf}>+ PDF</button>
        </div>

        {/* Right — save status */}
        <div style={{
          fontSize: '12px',
          color: saveStatus === 'saved' ? '#7A7560' : saveStatus === 'saving' ? '#F5C842' : 'red',
          fontWeight: '500',
        }}>
          {saveStatus === 'saving' ? '⏳ Saving...' : saveStatus === 'saved' ? '✓ Saved' : '⚠ Save error'}
        </div>
      </div>

      {/* Crash recovery banner */}
      {showRecovery && backup && (
        <div style={{
          background: '#FFF3CD',
          borderBottom: '1px solid #F5C842',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '13px',
          color: '#2C2A1E',
        }}>
          <span>⚠️ Unsaved changes found from {new Date(backup.savedAt).toLocaleTimeString()} — restore them?</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => { clearBackup(); setShowRecovery(false) }}
              style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #E8E0C8', background: 'transparent', cursor: 'pointer', fontSize: '13px' }}
            >
              Dismiss
            </button>
            <button
              onClick={() => { setShowRecovery(false); clearBackup() }}
              style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#F5C842', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
            >
              Restore
            </button>
          </div>
        </div>
      )}

      {/* Canvas with grid background */}
      <div style={styles.canvas}>
        <div style={styles.grid}>
          {panels.map((panel) => (
            <PanelContainer
              key={panel.id}
              panel={panel}
              onUpdate={updatePanel}
              onDelete={deletePanel}
              title={getPanelTitle(panel.type)}
            >
              {panel.type === 'YOUTUBE' && (
                <YoutubePanel
                  content={panel.content}
                  onContentChange={(c) => handleContentChange(panel.id, c)}
                />
              )}
              {panel.type === 'NOTES' && (
                <NotesPanel
                  content={panel.content}
                  onContentChange={(c) => handleContentChange(panel.id, c)}
                />
              )}
              {panel.type === 'AI' && (
                <AiPanel panels={panels} />
              )}
              {panel.type === 'PDF' && (
                <PdfPanel
                  content={panel.content}
                  onContentChange={(c) => handleContentChange(panel.id, c)}
                />
              )}
            </PanelContainer>
          ))}

          {panels.length === 0 && (
            <div style={styles.emptyState}>
              <p style={{ fontSize: '32px', marginBottom: '12px' }}>🎨</p>
              <p style={{ color: '#7A7560', fontSize: '15px', fontWeight: '500' }}>
                Your canvas is empty
              </p>
              <p style={{ color: '#B0A890', fontSize: '13px', marginTop: '6px' }}>
                Add a YouTube, Notes, AI or PDF panel to get started
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Highlight popup */}
      {highlightPopup && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleAskAboutHighlight}
          style={{
            position: 'fixed',
            top: highlightPopup.y - 50,
            left: highlightPopup.x - 60,
            background: '#2C2A1E',
            color: '#FFFDF4',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            zIndex: 9999,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          ✨ Ask AI
        </div>
      )}

      {/* Highlight answer modal */}
      {showHighlightAnswer && (
        <div
          onClick={() => setShowHighlightAnswer(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(44,42,30,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9998,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFDF4',
              borderRadius: '16px',
              padding: '28px',
              width: '480px',
              maxHeight: '60vh',
              overflowY: 'auto',
            }}
          >
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#7A7560', marginBottom: '8px', textTransform: 'uppercase' }}>
              AI Explanation
            </p>
            <p style={{ fontSize: '13px', color: '#2C2A1E', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
              {highlightAnswer}
            </p>
            <button
              onClick={() => setShowHighlightAnswer(false)}
              style={{
                marginTop: '16px',
                padding: '8px 18px',
                background: '#F5C842',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#FFFDF4',
    fontFamily: "'Segoe UI', sans-serif",
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 24px',
    background: '#F5F0DC',
    borderBottom: '1px solid #E8E0C8',
  },
  backBtn: {
    background: 'transparent',
    border: '1.5px solid #E8E0C8',
    borderRadius: '10px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#2C2A1E',
  },
  toolbarActions: {
    display: 'flex',
    gap: '10px',
  },
  addBtn: {
    background: '#F5C842',
    border: 'none',
    borderRadius: '10px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2C2A1E',
  },
  canvas: {
    width: '100%',
    height: 'calc(100vh - 65px)',
    overflow: 'auto',
  },
  grid: {
    position: 'relative',
    width: '100%',
    minHeight: '100%',
    backgroundImage: `radial-gradient(circle, #D8D0B8 1px, transparent 1px)`,
    backgroundSize: '28px 28px',
  },
  emptyState: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
}

export default CanvasWorkspace