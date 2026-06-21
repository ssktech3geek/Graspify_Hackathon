import { useState } from 'react'

function AiPanel({ panels }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const buildContext = () => {
    return panels
      .filter(p => p.type === 'NOTES' && p.content)
      .map(p => {
        try {
          const parsed = JSON.parse(p.content)
          return parsed.text || ''
        } catch {
          return ''
        }
      })
      .filter(Boolean)
      .join('\n\n')
  }

  const handleAsk = async () => {
    if (!question.trim()) return
    setLoading(true)
    setAnswer('')

    try {
      const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token
      const context = buildContext()

      const res = await fetch('http://localhost:8080/api/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question, context })
      })

      const data = await res.json()
      setAnswer(data.answer || data.error || 'No response')
    } catch (err) {
      setAnswer('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <p style={styles.hint}>
        Ask anything — I can read your Notes panels for context.
      </p>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="e.g. Summarize my notes, explain this concept..."
        style={styles.input}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleAsk()
          }
        }}
      />

      <button
        onClick={handleAsk}
        disabled={loading}
        style={{
          ...styles.btn,
          opacity: loading ? 0.6 : 1,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Thinking...' : 'Ask AI ✨'}
      </button>

      {answer && (
        <div style={styles.answer}>
          <p style={styles.answerLabel}>Answer:</p>
          <p style={styles.answerText}>{answer}</p>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    height: '100%',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
  hint: {
    fontSize: '12px',
    color: '#7A7560',
    margin: 0,
  },
  input: {
    width: '100%',
    height: '80px',
    padding: '10px 12px',
    border: '1.5px solid #E8E0C8',
    borderRadius: '8px',
    fontSize: '13px',
    fontFamily: "'Segoe UI', sans-serif",
    resize: 'none',
    boxSizing: 'border-box',
    outline: 'none',
  },
  btn: {
    padding: '10px 16px',
    background: '#F5C842',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '13px',
    color: '#2C2A1E',
    alignSelf: 'flex-start',
  },
  answer: {
    background: '#F5F0DC',
    borderRadius: '10px',
    padding: '12px',
  },
  answerLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#7A7560',
    margin: '0 0 6px',
    textTransform: 'uppercase',
  },
  answerText: {
    fontSize: '13px',
    color: '#2C2A1E',
    margin: 0,
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
  },
}

export default AiPanel