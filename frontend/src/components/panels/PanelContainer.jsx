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
  const [isResizing, setIsResizing] = useState(false)
  const [minimized, setMinimized] = useState(false)

  const handleDragStart = useCallback((e) => {
    e.preventDefault()
    const startX = e.clientX - position.x
    const startY = e.clientY - position.y

    const onMouseMove = (moveEvent) => {
      setPosition({ x: moveEvent.clientX - startX, y: moveEvent.clientY - startY })
    }

    const onMouseUp = (upEvent) => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      onUpdate(panel.id, {
        positionX: upEvent.clientX - startX,
        positionY: upEvent.clientY - startY
      })
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [position, panel.id, onUpdate])

  const handleResizeStart = useCallback((e, direction) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)

    const startX = e.clientX
    const startY = e.clientY
    const startWidth = size.width
    const startHeight = size.height
    const startPosX = position.x
    const startPosY = position.y

    const calc = (moveEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY

      let newWidth = startWidth
      let newHeight = startHeight
      let newX = startPosX
      let newY = startPosY

      if (direction.includes('e')) newWidth = Math.max(280, startWidth + dx)
      if (direction.includes('s')) newHeight = Math.max(200, startHeight + dy)
      if (direction.includes('w')) {
        newWidth = Math.max(280, startWidth - dx)
        newX = startPosX + (startWidth - newWidth)
      }
      if (direction.includes('n')) {
        newHeight = Math.max(200, startHeight - dy)
        newY = startPosY + (startHeight - newHeight)
      }

      return { newWidth, newHeight, newX, newY }
    }

    const onMouseMove = (moveEvent) => {
      const { newWidth, newHeight, newX, newY } = calc(moveEvent)
      setSize({ width: newWidth, height: newHeight })
      setPosition({ x: newX, y: newY })
    }

    const onMouseUp = (upEvent) => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      setIsResizing(false)
      const { newWidth, newHeight, newX, newY } = calc(upEvent)
      onUpdate(panel.id, {
        width: newWidth,
        height: newHeight,
        positionX: newX,
        positionY: newY
      })
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [size, position, panel.id, onUpdate])

  const H = 8
  const C = 16

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: size.width,
        height: minimized ? 'auto' : size.height,
      }}
    >
      {/* Panel box */}
      <div
        style={{
          position: minimized ? 'relative' : 'absolute',
          inset: minimized ? 'unset' : 0,
          width: '100%',
          background: '#FFFFFF',
          border: '1px solid #E8E0C8',
          borderRadius: '14px',
          boxShadow: '0 2px 12px rgba(44, 42, 30, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          userSelect: 'none',
          height: minimized ? 'auto' : '100%',
        }}
      >
        {/* Header */}
        <div
          onMouseDown={handleDragStart}
          style={{
            padding: '10px 14px',
            background: '#F5F0DC',
            borderBottom: minimized ? 'none' : '1px solid #E8E0C8',
            borderRadius: minimized ? '14px' : '14px 14px 0 0',
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
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setMinimized(m => !m)}
              title={minimized ? 'Expand' : 'Minimize'}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#7A7560',
                cursor: 'pointer',
                fontSize: '12px',
                lineHeight: 1,
                padding: '2px 4px',
              }}
            >
              {minimized ? '▲' : '▼'}
            </button>
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
        </div>

        {/* Content — hidden when minimized */}
        {!minimized && (
          <div style={{
            flex: 1,
            overflow: 'auto',
            position: 'relative',
            pointerEvents: isResizing ? 'none' : 'auto',
          }}>
            {children}
          </div>
        )}
      </div>

      {/* Resize handles — only when not minimized */}
      {!minimized && (
        <>
          <div onMouseDown={(e) => handleResizeStart(e, 'n')}
            style={{ position:'absolute', top:-H/2, left:C, right:C, height:H, cursor:'n-resize', zIndex:10000 }} />
          <div onMouseDown={(e) => handleResizeStart(e, 's')}
            style={{ position:'absolute', bottom:-H/2, left:C, right:C, height:H, cursor:'s-resize', zIndex:10000 }} />
          <div onMouseDown={(e) => handleResizeStart(e, 'e')}
            style={{ position:'absolute', right:-H/2, top:C, bottom:C, width:H, cursor:'e-resize', zIndex:10000 }} />
          <div onMouseDown={(e) => handleResizeStart(e, 'w')}
            style={{ position:'absolute', left:-H/2, top:C, bottom:C, width:H, cursor:'w-resize', zIndex:10000 }} />
          <div onMouseDown={(e) => handleResizeStart(e, 'nw')}
            style={{ position:'absolute', top:-H/2, left:-H/2, width:C, height:C, cursor:'nw-resize', zIndex:10001 }} />
          <div onMouseDown={(e) => handleResizeStart(e, 'ne')}
            style={{ position:'absolute', top:-H/2, right:-H/2, width:C, height:C, cursor:'ne-resize', zIndex:10001 }} />
          <div onMouseDown={(e) => handleResizeStart(e, 'sw')}
            style={{ position:'absolute', bottom:-H/2, left:-H/2, width:C, height:C, cursor:'sw-resize', zIndex:10001 }} />
          <div onMouseDown={(e) => handleResizeStart(e, 'se')}
            style={{ position:'absolute', bottom:-H/2, right:-H/2, width:C, height:C, cursor:'se-resize', zIndex:10001 }} />
        </>
      )}
    </div>
  )
}

export default PanelContainer