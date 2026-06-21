import { useState, useCallback } from 'react'

function PanelContainer({ panel, onUpdate, onDelete, children, title }) {
  const [position, setPosition] = useState({ 
    x: panel.positionX || 20, 
    y: panel.positionY || 20 
  })
  const [size, setSize] = useState({ 
    width: panel.width || 420, 
    height: panel.height || 320 
  })

  const handleDragStart = useCallback((e) => {
    e.preventDefault()
    const startX = e.clientX - position.x
    const startY = e.clientY - position.y

    const onMouseMove = (moveEvent) => {
      const newX = moveEvent.clientX - startX
      const newY = moveEvent.clientY - startY
      setPosition({ x: newX, y: newY })
    }

    const onMouseUp = (upEvent) => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      const newX = upEvent.clientX - startX
      const newY = upEvent.clientY - startY
      onUpdate(panel.id, { positionX: newX, positionY: newY })
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [position, panel.id, onUpdate])

  const handleResizeStart = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = size.width
    const startHeight = size.height

    const onMouseMove = (moveEvent) => {
      const newWidth = Math.max(280, startWidth + moveEvent.clientX - startX)
      const newHeight = Math.max(200, startHeight + moveEvent.clientY - startY)
      setSize({ width: newWidth, height: newHeight })
    }

    const onMouseUp = (upEvent) => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      const newWidth = Math.max(280, startWidth + upEvent.clientX - startX)
      const newHeight = Math.max(200, startHeight + upEvent.clientY - startY)
      onUpdate(panel.id, { width: newWidth, height: newHeight })
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [size, panel.id, onUpdate])

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        background: '#FFFFFF',
        border: '1px solid #E8E0C8',
        borderRadius: '14px',
        boxShadow: '0 2px 12px rgba(44, 42, 30, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Header / drag handle */}
      <div
        onMouseDown={handleDragStart}
        style={{
          padding: '10px 14px',
          background: '#F5F0DC',
          borderBottom: '1px solid #E8E0C8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'move',
          fontSize: '13px',
          fontWeight: '600',
          color: '#2C2A1E',
          flexShrink: 0,
        }}
      >
        <span>{title}</span>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => onDelete(panel.id)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#7A7560',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        {children}
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={handleResizeStart}
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '20px',
          height: '20px',
          cursor: 'nwse-resize',
          background: 'linear-gradient(135deg, transparent 50%, #E8E0C8 50%)',
          borderBottomRightRadius: '14px',
        }}
      />
    </div>
  )
}

export default PanelContainer