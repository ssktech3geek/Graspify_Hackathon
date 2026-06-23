import { useState, useRef, useEffect } from 'react'

function AiPanel({ panels }) {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const buildContext = () => {
    const notesText = panels
      .filter(p => p.type === 'NOTES' && p.content)
      .map(p => {
        try {
          const parsed = JSON.parse(p.content)
          return parsed.text || ''
        } catch { return '' }
      })
      .filter(Boolean)
      .join('\n\n')

    const pdfText = panels
      .filter(p => p.type === 'PDF' && p.content)
      .map(p => {
        try {
          const parsed = JSON.parse(p.content)
          return parsed.extractedText || ''
        } catch { return '' }
      })
      .filter(Boolean)
      .join('\n\n')

    const parts = []
    if (notesText) parts.push(`NOTES:\n${notesText}`)
    if (pdfText) parts.push(`PDF CONTENT:\n${pdfText}`)
    return parts.join('\n\n')
  }

  const handleAsk = async () => {
    if (!question.trim() || loading) return
    const q = question.trim()
    setQuestion('')
    setMessages(prev => [...prev, { role: 'user', text: q }])
    setLoading(true)

    try {
      const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token
      const context = buildContext()

      const res = await fetch('http://localhost:8080/api/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question: q, context })
      })

      const data = await res.json()
      setMessages(prev => [...prev, { role: 'ai', text: data.answer || data.error || 'No response' }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Error: ' + err.message }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        .typing-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #7A7560; display: inline-block; margin: 0 2px;
          animation: typingBounce 1.2s ease-in-out infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      {/* Chat history */}
      <div style={styles.chatArea}>
        {messages.length === 0 && (
          <div style={styles.empty}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>✨</div>
            <p style={{ fontSize: '13px', color: '#7A7560', margin: 0, textAlign: 'center' }}>
              Ask anything — I can read your Notes panels for context
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            maxWidth: '85%',
            padding: '10px 14px',
            wordBreak: 'break-word',
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            background: msg.role === 'user' ? '#F5C842' : '#F5F0DC',
            color: '#2C2A1E',
            borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
          }}>
            {msg.role === 'ai' && (
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#7A7560', marginBottom: '4px', textTransform: 'uppercase' }}>
                AI
              </div>
            )}
            <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {msg.text}
            </p>
          </div>
        ))}

        {loading && (
          <div style={{
            maxWidth: '85%',
            padding: '10px 14px',
            alignSelf: 'flex-start',
            background: '#F5F0DC',
            borderRadius: '14px 14px 14px 4px',
          }}>
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div style={styles.inputArea}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleAsk()
            }
          }}
          placeholder="Ask anything... (Enter to send, Shift+Enter for new line)"
          style={styles.input}
          rows={2}
        />
        <button
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          style={{
            ...styles.sendBtn,
            opacity: loading || !question.trim() ? 0.5 : 1,
            cursor: loading || !question.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          ✨
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  chatArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '20px',
  },
  inputArea: {
    display: 'flex',
    gap: '8px',
    padding: '10px 12px',
    borderTop: '1px solid #E8E0C8',
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    padding: '10px 12px',
    border: '1.5px solid #E8E0C8',
    borderRadius: '10px',
    fontSize: '13px',
    fontFamily: "'Segoe UI', sans-serif",
    resize: 'none',
    outline: 'none',
    lineHeight: '1.5',
    boxSizing: 'border-box',
  },
  sendBtn: {
    width: '38px',
    height: '38px',
    background: '#F5C842',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

export default AiPanel