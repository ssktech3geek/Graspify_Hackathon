import { useState, useRef } from 'react'

function NotesPanel({ content, onContentChange }) {
  const parsed = content ? JSON.parse(content) : { text: '' }
  const [text, setText] = useState(parsed.text || '')
  const debounceRef = useRef(null)

  const handleChange = (e) => {
    const value = e.target.value
    setText(value)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onContentChange(JSON.stringify({ text: value }))
    }, 800)
  }

  return (
    <textarea
      value={text}
      onChange={handleChange}
      placeholder="Type your notes here..."
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        outline: 'none',
        resize: 'none',
        padding: '16px',
        fontSize: '14px',
        fontFamily: "'Segoe UI', sans-serif",
        color: '#2C2A1E',
        boxSizing: 'border-box',
        background: 'transparent',
      }}
    />
  )
}

export default NotesPanel