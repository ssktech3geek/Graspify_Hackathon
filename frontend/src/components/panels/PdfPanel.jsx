import { useState, useRef } from 'react'

function PdfPanel({ content, onContentChange, onTextExtracted }) {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [pdfName, setPdfName] = useState('')
  const [extractedText, setExtractedText] = useState('')
  const inputRef = useRef(null)

  const extractTextFromPdf = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      
      // Simple text extraction from PDF bytes
      const decoder = new TextDecoder('utf-8', { fatal: false })
      const rawText = decoder.decode(uint8Array)
      
      // Extract readable text between stream markers
      const textMatches = rawText.match(/BT[\s\S]*?ET/g) || []
      let extracted = textMatches
        .join(' ')
        .replace(/\(([^)]+)\)/g, '$1 ')
        .replace(/[^\x20-\x7E\n]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

      if (!extracted || extracted.length < 50) {
        extracted = `PDF file: ${file.name}. Text extraction limited — ask me general questions about the topic.`
      }

      setExtractedText(extracted)
      if (onTextExtracted) onTextExtracted(extracted)
      return extracted
    } catch (err) {
      console.error('Text extraction error:', err)
      return ''
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPdfUrl(url)
    setPdfName(file.name)
    const text = await extractTextFromPdf(file)
    onContentChange(JSON.stringify({ name: file.name, extractedText: text }))
  }

  if (!pdfUrl) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: '16px',
        padding: '24px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '48px' }}>📄</div>
        <p style={{ fontSize: '14px', color: '#7A7560', margin: 0 }}>
          Upload a PDF — AI can read and answer questions about it
        </p>
        <button
          onClick={() => inputRef.current.click()}
          style={{
            padding: '12px 24px',
            background: '#F5C842',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '14px',
            color: '#2C2A1E',
            cursor: 'pointer',
          }}
        >
          📂 Choose PDF
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        padding: '8px 12px',
        borderBottom: '1px solid #E8E0C8',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '12px', color: '#7A7560', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>
          {pdfName}
        </span>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {extractedText && (
            <span style={{ fontSize: '10px', color: '#7A7560', background: '#F5F0DC', padding: '2px 8px', borderRadius: '100px' }}>
              ✓ AI can read this
            </span>
          )}
          <button
            onClick={() => { setPdfUrl(null); setPdfName(''); setExtractedText('') }}
            style={{ fontSize: '12px', color: '#7A7560', background: 'transparent', border: '1px solid #E8E0C8', borderRadius: '6px', padding: '3px 10px', cursor: 'pointer' }}
          >
            Change
          </button>
        </div>
      </div>
      <embed
        src={pdfUrl}
        type="application/pdf"
        style={{ flex: 1, width: '100%', border: 'none' }}
      />
    </div>
  )
}

export default PdfPanel