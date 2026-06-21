import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

function PdfPanel({ content, onContentChange }) {
  const parsed = content ? JSON.parse(content) : {}
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pdfData, setPdfData] = useState(parsed.data || null)

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64 = ev.target.result
      setPdfData(base64)
      onContentChange(JSON.stringify({ data: base64, name: file.name }))
    }
    reader.readAsDataURL(file)
  }

  if (!pdfData) {
    return (
      <div style={{ padding: '20px' }}>
        <p style={{ fontSize: '13px', color: '#7A7560', marginBottom: '10px' }}>
          Upload a PDF file
        </p>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          style={{ fontSize: '13px' }}
        />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 12px',
        borderBottom: '1px solid #E8E0C8',
        fontSize: '13px',
        color: '#2C2A1E',
      }}>
        <button
          onClick={() => setPageNumber(p => Math.max(1, p - 1))}
          disabled={pageNumber <= 1}
          style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #E8E0C8', cursor: 'pointer', background: 'transparent' }}
        >←</button>
        <span>Page {pageNumber} of {numPages || '?'}</span>
        <button
          onClick={() => setPageNumber(p => Math.min(numPages || p, p + 1))}
          disabled={pageNumber >= numPages}
          style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #E8E0C8', cursor: 'pointer', background: 'transparent' }}
        >→</button>
        <button
          onClick={() => { setPdfData(null); onContentChange(JSON.stringify({})) }}
          style={{ marginLeft: 'auto', padding: '4px 10px', borderRadius: '6px', border: '1px solid #E8E0C8', cursor: 'pointer', background: 'transparent', fontSize: '12px', color: '#7A7560' }}
        >Change PDF</button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', padding: '10px' }}>
        <Document
          file={pdfData}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages)
            setPageNumber(1)
          }}
          onLoadError={(err) => console.error('PDF error:', err)}
          loading={<p style={{ color: '#7A7560', fontSize: '13px' }}>Loading PDF...</p>}
          error={<p style={{ color: '#E53E3E', fontSize: '13px' }}>Failed to load PDF. Try a smaller file.</p>}
        >
          <Page
            pageNumber={pageNumber}
            width={360}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
    </div>
  )
}

export default PdfPanel