import { useState } from 'react'

function getYoutubeId(url) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  return match ? match[1] : null
}

function YoutubePanel({ content, onContentChange }) {
  const parsed = content ? JSON.parse(content) : { url: '' }
  const [urlInput, setUrlInput] = useState(parsed.url || '')
  const videoId = getYoutubeId(parsed.url || '')

  const handleLoad = () => {
    onContentChange(JSON.stringify({ url: urlInput }))
  }

  if (!videoId) {
    return (
      <div style={{ padding: '20px' }}>
        <p style={{ fontSize: '13px', color: '#7A7560', marginBottom: '10px' }}>
          Paste a YouTube link
        </p>
        <input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1.5px solid #E8E0C8',
            borderRadius: '8px',
            fontSize: '13px',
            boxSizing: 'border-box',
            marginBottom: '10px',
          }}
        />
        <button
          onClick={handleLoad}
          style={{
            padding: '8px 16px',
            background: '#F5C842',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          Load Video
        </button>
      </div>
    )
  }

  return (
    <iframe
      width="100%"
      height="100%"
      src={`https://www.youtube.com/embed/${videoId}`}
      title="YouTube video"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      style={{ display: 'block' }}
    />
  )
}

export default YoutubePanel