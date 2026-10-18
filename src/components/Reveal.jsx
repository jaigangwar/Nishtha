import { useEffect, useRef, useState } from 'react'

export function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const [visible, setVisible] = useState(false)
  const nodeRef = useRef(null)
  const Component = as

  useEffect(() => {
    const node = nodeRef.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -32px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Component
      ref={nodeRef}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </Component>
  )
}
