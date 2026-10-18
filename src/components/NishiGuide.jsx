import { useEffect, useRef, useState } from 'react'
import { getGuideActionTarget, getGuideContext } from '../lib/guide'

function NishiAvatar({ compact = false }) {
  return (
    <span className={`nishi-avatar ${compact ? 'nishi-avatar-compact' : ''}`} aria-hidden="true">
      <span className="nishi-flap" />
      <span className="nishi-eye nishi-eye-left" />
      <span className="nishi-eye nishi-eye-right" />
      <span className="nishi-mouth" />
      <span className="nishi-arm nishi-arm-left" />
      <span className="nishi-arm nishi-arm-right" />
    </span>
  )
}

export function NishiGuide({ view, onNavigate }) {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [introVisible, setIntroVisible] = useState(() => {
    try {
      return localStorage.getItem('nishi-intro-dismissed') !== 'true'
    } catch {
      return true
    }
  })
  const panelRef = useRef(null)
  const triggerRef = useRef(null)
  const context = getGuideContext(view)

  useEffect(() => {
    if (!open || minimized) return undefined
    const previous = document.activeElement
    panelRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (previous instanceof HTMLElement && previous !== document.body) previous.focus()
    }
  }, [open, minimized])

  const dismissIntro = () => {
    setIntroVisible(false)
    try {
      localStorage.setItem('nishi-intro-dismissed', 'true')
    } catch {
      // Convenience storage is optional.
    }
  }

  const handleAction = (target) => {
    const destination = getGuideActionTarget(target)
    setOpen(false)
    setMinimized(false)
    onNavigate(destination)
  }

  const resetGuide = () => {
    try {
      localStorage.removeItem('nishi-intro-dismissed')
    } catch {
      // Convenience storage is optional.
    }
    setIntroVisible(true)
  }

  return (
    <div className="nishi-dock">
      {introVisible && !open && !minimized && (
        <div className="nishi-intro" role="status">
          <button className="nishi-intro-dismiss" onClick={dismissIntro} aria-label="Dismiss Nishi introduction">×</button>
          <strong>Meet Nishi</strong>
          <span>Need a hand finding your way around?</span>
        </div>
      )}

      {open && !minimized && (
        <section id="nishi-panel" className="nishi-panel" role="dialog" aria-modal="false" aria-labelledby="nishi-panel-title" tabIndex="-1" ref={panelRef}>
          <div className="nishi-panel-topline">
            <span className="nishi-status"><span className="live-dot" /> guide online</span>
            <div className="nishi-panel-actions">
              <button className="icon-button" onClick={() => setMinimized(true)} aria-label="Minimize Nishi guide">−</button>
              <button className="icon-button" onClick={() => { setOpen(false); triggerRef.current?.focus() }} aria-label="Close Nishi guide">×</button>
            </div>
          </div>
          <div className="nishi-panel-heading">
            <NishiAvatar compact />
            <div>
              <span className="eyebrow">{context.eyebrow}</span>
              <h2 id="nishi-panel-title">Hi, I'm Nishi.</h2>
            </div>
          </div>
          <p className="nishi-message">{context.message}</p>
          <div className="nishi-actions">
            {context.actions.map((action) => (
              <button key={action.label} className="guide-action" onClick={() => handleAction(action.target)}>
                <span>{action.label}</span><span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
          <p className="nishi-boundary">Nishi helps you navigate evidence. Nishi never decides whether an opportunity is legitimate.</p>
          <button className="text-button reset-guide" onClick={resetGuide}>Reset first-visit tip</button>
        </section>
      )}

      {minimized && (
        <button className="nishi-minimized" onClick={() => setMinimized(false)} aria-label="Reopen minimized Nishi guide">
          <NishiAvatar compact /><span>Open guide</span>
        </button>
      )}

      <button
        ref={triggerRef}
        className={`nishi-trigger ${open ? 'is-open' : ''}`}
        onClick={() => { setOpen((value) => !value); setMinimized(false); dismissIntro() }}
        aria-expanded={open}
        aria-controls="nishi-panel"
        aria-label={open ? 'Close Nishi guide' : 'Open Nishi guide'}
      >
        <NishiAvatar />
        <span className="nishi-trigger-label">Ask Nishi</span>
      </button>
    </div>
  )
}
