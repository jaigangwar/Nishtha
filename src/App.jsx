import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { NishiGuide } from './components/NishiGuide'
import { Reveal } from './components/Reveal'
import { analyzeOpportunity, analyzeSample, SAMPLE_CASES } from './lib/investigation'
import './styles.css'

const InvestigationScene = lazy(() => import('./components/InvestigationScene').then((module) => ({ default: module.InvestigationScene })))

const DEMO_REPORT = analyzeSample(SAMPLE_CASES[0])

const PROCESS_STEPS = [
  { number: '01', title: 'Bring the claim', text: 'Paste an invitation, listing, message, or offer into a private workspace.' },
  { number: '02', title: 'Separate the signals', text: 'Nishtha extracts what is actually said and keeps assumptions out of the evidence ledger.' },
  { number: '03', title: 'Trace the sources', text: 'Each reference is shown with its status: observed, source-aligned, inferred, or still unknown.' },
  { number: '04', title: 'Choose a next step', text: 'Leave with useful questions and a practical action report—not an artificial green light.' },
]

const SAFETY_LAYERS = [
  { label: 'Observed', code: 'O', color: 'olive', title: 'What is directly in front of us', text: 'A sentence, sender detail, date, or document element that appears in the material you provided.' },
  { label: 'Independently verified', code: 'V', color: 'olive', title: 'What a separate source supports', text: 'A claim corroborated by a source outside the original message, with its scope and limits visible.' },
  { label: 'Inferred', code: 'I', color: 'rust', title: 'What is a reasoned reading', text: 'A useful interpretation that may guide questions, but must not be mistaken for a fact.' },
  { label: 'Unknown', code: '?', color: 'rust', title: 'What still needs checking', text: 'An unresolved gap. Unknown is a valid status, not an invitation to fill the space with confidence.' },
]

function getStoredCases() {
  try {
    const stored = localStorage.getItem('nishtha-cases')
    const parsed = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveStoredCases(cases) {
  try {
    localStorage.setItem('nishtha-cases', JSON.stringify(cases))
    return true
  } catch {
    return false
  }
}

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  try {
    const saved = localStorage.getItem('nishtha-theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Theme preference is optional.
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function AppHeader({ currentView, theme, onToggleTheme, onNavigate }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (event, section) => {
    event.preventDefault()
    setMenuOpen(false)
    onNavigate({ view: section === 'cases' ? 'cases' : 'home', section })
  }

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${currentView === 'home' ? 'is-landing' : ''} ${menuOpen ? 'menu-open' : ''}`}>
      <div className="header-inner">
        <button className="wordmark" onClick={() => { setMenuOpen(false); onNavigate({ view: 'home', section: 'top' }) }} aria-label="Nishtha home">
          <span className="wordmark-mark">N</span><span>Nishtha</span>
        </button>
        <button className={`menu-toggle ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label="Toggle navigation"><span /><span /></button>
        <nav className={`site-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          <a className={currentView === 'home' ? 'is-active' : ''} href="#product" onClick={(event) => go(event, 'product')}>Product</a>
          <a href="#works" onClick={(event) => go(event, 'works')}>How it works</a>
          <a href="#safety" onClick={(event) => go(event, 'safety')}>Safety</a>
          <a href="#about" onClick={(event) => go(event, 'about')}>About</a>
          <a href="#cases" onClick={(event) => go(event, 'cases')}>Cases</a>
          <button className="theme-toggle" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}><span className="theme-icon">{theme === 'dark' ? '☼' : '◐'}</span><span>{theme === 'dark' ? 'Light' : 'Dark'}</span></button>
          <button className="header-cta" onClick={() => { setMenuOpen(false); onNavigate({ view: 'investigate', section: 'investigate' }) }}>Start investigation <span>↗</span></button>
        </nav>
      </div>
    </header>
  )
}

function LandingPage({ onNavigate, reducedMotion }) {
  const [activeSafety, setActiveSafety] = useState(0)

  return (
    <main className="landing-page">
      <section className="hero hero-theatre section-shell" id="product">
        <div className="hero-copy">
          <Reveal><p className="eyebrow hero-eyebrow"><span className="eyebrow-rule" /> Case file 01 / evidence-first research</p></Reveal>
          <Reveal delay={80}><h1>Before you trust it,<br /><em>trace the claim.</em></h1></Reveal>
          <Reveal delay={160}><p className="hero-description">Investigate the fine print. Follow the source trail. Make your next move with the next question in view.</p></Reveal>
          <Reveal delay={220} className="hero-actions">
            <button className="button button-primary" onClick={() => onNavigate({ view: 'investigate', section: 'investigate' })}>Investigate an opportunity <span>↗</span></button>
            <button className="button button-quiet" onClick={() => onNavigate({ view: 'home', section: 'works' })}>Explore how it works <span>↓</span></button>
          </Reveal>
          <Reveal delay={280} className="hero-proof">
            <span><i className="proof-mark">✓</i> Clear evidence states</span>
            <span><i className="proof-mark">⌁</i> Honest uncertainty</span>
          </Reveal>
          <Reveal delay={340} className="hero-utility"><span>LOCAL PROTOTYPE / NO EXTERNAL API</span><span>SCENE LIVE / 08.4 SEC LOOP</span></Reveal>
        </div>
        <Reveal delay={130} className="hero-visual-wrap">
          <Suspense fallback={<div className="scene-loading" aria-label="Loading interactive evidence desk"><span className="loading-ring" /><span>Preparing the evidence desk…</span></div>}><InvestigationScene reducedMotion={reducedMotion} /></Suspense>
          <div className="hero-visual-note note-top"><span>LIVE CASE 01</span><strong>Examine the trail</strong></div>
          <div className="hero-visual-note note-bottom"><span>NISHI / COMPANION</span><strong>Keep asking better questions.</strong></div>
          <div className="hero-signal-bar"><span><i className="signal-pulse" /> SIGNAL PATH ACTIVE</span><span>OBSERVE → TRACE → ASK</span></div>
        </Reveal>
        <div className="hero-scroll-cue"><span className="scroll-line" /> scroll to investigate</div>
      </section>

      <section className="intro-section section-shell" id="about">
        <Reveal className="section-intro">
          <p className="eyebrow">A quieter kind of due diligence</p>
          <h2>Good opportunities can<br /><em>stand up to a question.</em></h2>
        </Reveal>
        <Reveal delay={100} className="intro-body">
          <p>Nishtha is a research workspace for the moment before you commit. It gives the fine print room to speak—without turning a missing source into a dramatic verdict.</p>
          <a className="inline-link" href="#safety" onClick={(event) => { event.preventDefault(); onNavigate({ view: 'home', section: 'safety' }) }}>Read our evidence philosophy <span>↗</span></a>
        </Reveal>
      </section>

      <section className="ledger-section section-shell">
        <Reveal className="section-label-row"><p className="eyebrow">A sample investigation / 02 min read</p><span className="mono-label">FICTIONAL DATA · LOCAL DEMO</span></Reveal>
        <div className="ledger-layout">
          <Reveal className="ledger-aside" delay={80}>
            <span className="ledger-number">01</span>
            <h3>Start with what you can point to.</h3>
            <p>Not every signal is a conclusion. The first useful move is to make the claim visible, specific, and ready to examine.</p>
            <button className="text-button" onClick={() => onNavigate({ view: 'investigate', section: 'investigate' })}>Try the workspace <span>↗</span></button>
          </Reveal>
          <Reveal className="evidence-sheet" delay={160}>
            <div className="sheet-header"><span>INVITATION / RECEIVED 14 MAY</span><span className="sheet-pin">●</span></div>
            <div className="sheet-content">
              <p className="sheet-kicker">Acme Skills Fellowship</p>
              <h3>“Congratulations—your seat is reserved.”</h3>
              <div className="sheet-row"><span className="status-dot status-olive" /> <strong>Observed</strong><span>The message includes a deadline and a fee request.</span></div>
              <div className="sheet-row"><span className="status-dot status-rust" /> <strong>Unverified</strong><span>Placement support is claimed, not independently sourced.</span></div>
              <div className="sheet-footer"><span>nishtha / evidence ledger</span><span>→ 03 open questions</span></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="process-section section-shell" id="works">
        <Reveal className="section-heading split-heading"><div><p className="eyebrow">From claim to clarity</p><h2>An investigation<br /><em>has a rhythm.</em></h2></div><p>Four measured steps turn a promising message into a question you can actually answer.</p></Reveal>
        <div className="process-track">
          {PROCESS_STEPS.map((step, index) => (
            <Reveal as="article" className={`process-step ${index === 1 ? 'process-step-featured' : ''}`} delay={index * 80} key={step.number}>
              <div className="process-marker"><span>{step.number}</span><i /></div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="safety-section safety-climax section-shell" id="safety">
        <Reveal className="safety-copy"><p className="eyebrow">Safety is a structure, not a badge</p><h2>Keep the known,<br /><em>known.</em></h2><p>Every useful report shows its boundaries. Tap a layer to see how Nishtha keeps observations, verification, inference, and uncertainty from collapsing into one neat—and misleading—answer.</p></Reveal>
        <Reveal delay={120} className="safety-layers">
          <div className="layer-tabs" role="tablist" aria-label="Evidence states">
            {SAFETY_LAYERS.map((layer, index) => <button key={layer.label} className={activeSafety === index ? 'is-active' : ''} onClick={() => setActiveSafety(index)} role="tab" aria-selected={activeSafety === index}><span className={`layer-code layer-${layer.color}`}>{layer.code}</span>{layer.label}</button>)}
          </div>
          <div className="layer-detail" role="tabpanel">
            <div className={`layer-illustration layer-${SAFETY_LAYERS[activeSafety].color}`}><span>{SAFETY_LAYERS[activeSafety].code}</span></div>
            <div><p className="mono-label">EVIDENCE STATE / {String(activeSafety + 1).padStart(2, '0')}</p><h3>{SAFETY_LAYERS[activeSafety].title}</h3><p>{SAFETY_LAYERS[activeSafety].text}</p></div>
          </div>
          <div className="annotation-line"><span>“The unknown is allowed to stay open.”</span><span>— Nishtha principle 04</span></div>
        </Reveal>
      </section>

      <section className="closing-section section-shell" id="investigate">
        <Reveal className="closing-card"><div><p className="eyebrow">Your next move can be careful.</p><h2>Bring a question.<br /><em>Leave with a trail.</em></h2></div><button className="button button-light" onClick={() => onNavigate({ view: 'investigate', section: 'investigate' })}>Start an investigation <span>↗</span></button></Reveal>
      </section>
      <footer className="site-footer section-shell"><div className="footer-brand"><span className="wordmark-mark">N</span><span>Nishtha</span></div><p>Evidence before trust.</p><div className="footer-meta"><span>© 2025 Nishtha</span><span>Made for more considered next steps.</span></div></footer>
    </main>
  )
}

function InvestigationView({ report, onReport, onOpenReport, onSaveCase, caseSaved, onNavigate }) {
  const [sourceText, setSourceText] = useState(SAMPLE_CASES[0].text)
  const [selectedSample, setSelectedSample] = useState(SAMPLE_CASES[0].id)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [processingStep, setProcessingStep] = useState(0)
  const timersRef = useRef([])

  useEffect(() => () => timersRef.current.forEach(window.clearTimeout), [])

  const chooseSample = (sample) => {
    timersRef.current.forEach(window.clearTimeout)
    setSelectedSample(sample.id)
    setSourceText(sample.text)
    setStatus('idle')
    setError('')
  }

  const runInvestigation = (event) => {
    event.preventDefault()
    if (!sourceText.trim()) {
      setError('Add an opportunity name or claim to begin.')
      return
    }
    timersRef.current.forEach(window.clearTimeout)
    setError('')
    setStatus('processing')
    setProcessingStep(0)
    timersRef.current = [
      window.setTimeout(() => setProcessingStep(1), 360),
      window.setTimeout(() => setProcessingStep(2), 720),
      window.setTimeout(() => {
        const sample = SAMPLE_CASES.find((item) => item.id === selectedSample)
        const nextReport = sample && sample.text === sourceText ? analyzeSample(sample) : analyzeOpportunity(sourceText)
        onReport(nextReport)
        setStatus('ready')
      }, 1120),
    ]
  }

  return (
    <main className="workspace-page section-shell" id="investigate">
      <div className="workspace-topbar"><button className="back-link" onClick={() => onNavigate({ view: 'home', section: 'product' })}>← Back to overview</button><span className="mono-label">PRIVATE WORKSPACE / LOCAL HEURISTIC</span></div>
      <div className="workspace-heading"><div><p className="eyebrow">Investigation workspace</p><h1>Make the question<br /><em>specific.</em></h1></div><p>Paste the opportunity as it arrived. Nishtha quotes your material, surfaces visible signals, and keeps unknowns open.</p></div>
      <div className="investigation-grid">
        <form className="investigation-form" onSubmit={runInvestigation}>
          <label htmlFor="opportunity">What are you considering?</label>
          <p className="field-help">A local heuristic scan. No external websites or APIs are checked.</p>
          <div className="sample-strip" aria-label="Fictional sample investigations">
            <div className="sample-strip-label"><span className="mono-label">TRY A FICTIONAL SAMPLE</span><span className="sample-help">See how the trail changes</span></div>
            <div className="sample-options">{SAMPLE_CASES.map((sample) => <button type="button" key={sample.id} className={`sample-option ${selectedSample === sample.id ? 'is-selected' : ''}`} onClick={() => chooseSample(sample)}><span className={`sample-dot sample-dot-${sample.tone}`} />{sample.label}</button>)}</div>
          </div>
          <textarea id="opportunity" value={sourceText} onChange={(event) => { setSourceText(event.target.value); setSelectedSample('custom'); setStatus('idle') }} rows="7" placeholder="Paste a name or the text of an opportunity…" aria-describedby="opportunity-help opportunity-error" />
          <div className="form-foot"><span id="opportunity-help" className="mono-label">SOURCE TEXT STAYS ON THIS DEVICE</span><button className="button button-primary" type="submit" disabled={status === 'processing'}>{status === 'processing' ? 'Examining…' : 'Run evidence scan'} <span>↗</span></button></div>
          {error && <p id="opportunity-error" className="form-error" role="alert">{error}</p>}
        </form>
        <div className="processing-panel" aria-live="polite">
          {status === 'idle' && <><span className="panel-index">01</span><h2>Begin with the<br /><em>source material.</em></h2><p>{report ? 'This is a fresh investigation. The previous report is kept separate until you run this scan.' : 'Even a short description gives us somewhere honest to start. Choose a sample or bring your own opportunity text.'}</p><div className="panel-note">No automated legitimacy decision is made.</div></>}
          {status === 'processing' && <><span className="panel-index">02</span><h2>Following the<br /><em>evidence trail.</em></h2><div className="scan-list">{['Reading the supplied claim', 'Separating signals from assumptions', 'Preparing open questions'].map((step, index) => <div className={processingStep >= index ? 'is-done' : ''} key={step}><span>{processingStep > index ? '✓' : processingStep === index ? '·' : '○'}</span>{step}</div>)}</div><div className="scan-line"><i style={{ width: `${Math.min(100, (processingStep + 1) * 33)}%` }} /></div></>}
          {status === 'ready' && report && <><span className="panel-index">03</span><div className="ready-heading"><span className="ready-badge">LOCAL REPORT READY</span><span className="score-small">{report.score}/100</span></div><h2>{report.opportunity}</h2><p>{report.summary}</p><div className="ready-signal-row">{report.sourceSignals.hasFee && <span>fee signal</span>}{report.sourceSignals.hasClaim && <span>strong claim</span>}{report.sourceSignals.hasContact && <span>traceable detail</span>}<span>{report.questions.length} open questions</span></div><div className="ready-actions"><button className="button button-primary" onClick={onOpenReport}>Open report <span>↗</span></button><button className="button button-outline" onClick={onSaveCase}>{caseSaved ? 'Saved to cases' : 'Save this case'}</button></div></>}
        </div>
      </div>
      <div className="workspace-principles"><span><b>01</b> Claims are not proof.</span><span><b>02</b> Unknown is not failure.</span><span><b>03</b> You remain the decision-maker.</span></div>
    </main>
  )
}

function ReportView({ report, onSaveCase, onUpdateReport, caseSaved, onNavigate }) {
  const current = report || DEMO_REPORT
  const [expanded, setExpanded] = useState(0)
  const [copied, setCopied] = useState(false)
  const questions = current.questions.map((question, index) => typeof question === 'string' ? { id: `question-${index}`, text: question, priority: 'open' } : question)
  const breakdown = current.breakdown || DEMO_REPORT.breakdown
  const questionStatus = current.questionStatus || {}
  const completedCount = questions.filter((question) => questionStatus[question.id]).length
  const toggleQuestion = (id) => onUpdateReport({ ...current, questionStatus: { ...questionStatus, [id]: !questionStatus[id] } })
  const copySummary = async () => {
    const summary = `${current.opportunity}\n\n${current.summary}\n\nOpen questions:\n${questions.map((question, index) => `${index + 1}. ${question.text}`).join('\n')}\n\nNishtha: local heuristic scan; no external source checked.`
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }
  return (
    <main className="report-page section-shell" id="report">
      <div className="workspace-topbar"><button className="back-link" onClick={() => onNavigate({ view: 'investigate', section: 'investigate' })}>← Back to workspace</button><span className="mono-label">REPORT / {current.opportunity.toUpperCase()}</span></div>
      <div className="report-heading"><div><p className="eyebrow">Evidence report <span className="report-local-badge">local heuristic</span></p><h1>{current.opportunity}<br /><em>needs more evidence.</em></h1></div><div className="report-score"><span>Evidence coverage</span><strong>{current.score}</strong><small>/100</small><i>not a legitimacy verdict</i></div></div>
      <div className="report-summary"><span className="summary-label">READ THIS FIRST</span><p>{current.summary}</p><div className="summary-actions"><button className="button button-outline" onClick={copySummary}>{copied ? 'Copied' : 'Copy summary'}</button><button className="button button-outline" onClick={onSaveCase}>{caseSaved ? 'Saved to cases' : 'Save case'}</button></div></div>
      <section className="signal-breakdown" aria-labelledby="signal-breakdown-heading"><div className="breakdown-heading"><div><p className="eyebrow">How this signal is formed</p><h2 id="signal-breakdown-heading">A number with<br /><em>visible edges.</em></h2></div><p>Coverage measures how much useful, specific material is present in the supplied text. It is not a safety score, a fraud detector, or an external verification result.</p></div><div className="breakdown-grid">{breakdown.map((item) => <div className="breakdown-item" key={item.id}><div className="breakdown-item-top"><span>{item.label}</span><strong>{item.value}</strong></div><div className="breakdown-bar"><i style={{ width: `${item.value}%` }} /></div><p>{item.note}</p></div>)}</div></section>
      <section className="report-section" aria-labelledby="evidence-ledger-heading"><div className="report-section-heading"><div><p className="eyebrow">01 / Evidence ledger</p><h2 id="evidence-ledger-heading">What the trail<br /><em>can support.</em></h2></div><p>Open an entry to see the original excerpt, its evidence state, and the boundary between what the material supports and what it cannot prove.</p></div><div className="evidence-list">{current.evidence.map((item, index) => <article className={`evidence-entry ${expanded === index ? 'is-expanded' : ''}`} key={item.id || item.title}><button onClick={() => setExpanded(expanded === index ? -1 : index)} aria-expanded={expanded === index}><span className="entry-id">E-{String(index + 1).padStart(2, '0')}</span><span className={`entry-type entry-${item.tone}`}>{item.type}</span><strong>{item.title}</strong><span className="entry-toggle">{expanded === index ? '−' : '+'}</span></button>{expanded === index && <div className="entry-detail"><div className="quote-block"><span className="quote-mark">“</span><p>{item.quote}</p><span className="mono-label">{item.sourceLocation || item.source}</span></div><div className="entry-boundaries"><div><span>CAN SUPPORT</span><strong>{item.supports}</strong></div><div><span>CANNOT SUPPORT</span><strong>{item.limits}</strong></div></div><p className="entry-explanation">{item.detail}</p><button className="inline-link" onClick={() => onNavigate({ view: 'sources', section: 'sources' })}>Open provenance view <span>↗</span></button></div>}</article>)}</div></section>
      <section className="questions-section" id="report-questions"><div><p className="eyebrow">02 / Next-action plan</p><h2>Questions to ask<br /><em>before acting.</em></h2><div className="question-progress"><span>{completedCount} of {questions.length} addressed</span><div><i style={{ width: `${questions.length ? completedCount / questions.length * 100 : 0}%` }} /></div></div><p className="question-note">Checking a question means you addressed it—not that the opportunity is verified.</p></div><ol>{questions.map((question, index) => <li className={questionStatus[question.id] ? 'is-complete' : ''} key={question.id}><label><input type="checkbox" checked={Boolean(questionStatus[question.id])} onChange={() => toggleQuestion(question.id)} /><span className="checkmark">✓</span></label><span>{String(index + 1).padStart(2, '0')}</span><p>{question.text}</p><em>{question.priority === 'next' ? 'next best check' : 'open question'}</em></li>)}</ol></section>
      <div className="report-disclaimer"><span className="disclaimer-icon">!</span><p><strong>A careful report does not make the decision for you.</strong> It names what was observed, what remains unverified, and what a useful next check could be.</p><button className="button button-primary" onClick={() => onNavigate({ view: 'investigate', section: 'investigate' })}>Investigate another <span>↗</span></button></div>
    </main>
  )
}

function CasesView({ cases, onSelect, onNavigate }) {
  return (
    <main className="cases-page section-shell" id="cases"><div className="workspace-topbar"><button className="back-link" onClick={() => onNavigate({ view: 'home', section: 'product' })}>← Back to overview</button><span className="mono-label">ARCHIVE / {cases.length} CASES</span></div><div className="workspace-heading"><div><p className="eyebrow">Saved cases</p><h1>Keep the trail<br /><em>within reach.</em></h1></div><p>Saved locally on this device. Return to a question with its context intact.</p></div>{cases.length === 0 ? <div className="empty-state"><span className="empty-mark">N</span><h2>No saved cases yet.</h2><p>When an investigation is ready, save it here to return to the evidence and unresolved questions.</p><button className="button button-primary" onClick={() => onNavigate({ view: 'investigate', section: 'investigate' })}>Start an investigation <span>↗</span></button></div> : <div className="case-list">{cases.map((item) => <button className="case-row" key={item.id} onClick={() => onSelect(item)}><span className="case-date">{item.createdAt}</span><strong>{item.opportunity}</strong><span className="case-status">{item.confidence}</span><span>↗</span></button>)}</div>}</main>
  )
}

function SourcesView({ report, onNavigate }) {
  const current = report || DEMO_REPORT
  return <main className="sources-page section-shell" id="sources"><div className="workspace-topbar"><button className="back-link" onClick={() => onNavigate({ view: 'report', section: 'report' })}>← Back to report</button><span className="mono-label">PROVENANCE / {current.evidence.length} REFERENCES</span></div><div className="workspace-heading"><div><p className="eyebrow">Source detail</p><h1>Show your<br /><em>work.</em></h1></div><p>Every reference is a small contract with the reader: this is what was checked, and this is what it cannot prove.</p></div><div className="source-stack">{current.evidence.map((item, index) => <article className="source-card" key={item.id || item.title}><div className="source-card-index">E-{String(index + 1).padStart(2, '0')}</div><div><span className={`entry-type entry-${item.tone}`}>{item.type}</span><h2>{item.source}</h2><div className="source-quote">“{item.quote}”</div><p>{item.detail}</p><div className="source-boundary"><span>CAN SUPPORT</span><strong>{item.supports}</strong></div><div className="source-boundary source-boundary-muted"><span>CANNOT SUPPORT</span><strong>{item.limits}</strong></div><span className="mono-label">{item.sourceLocation || 'Local input · no external source checked'}</span></div></article>)}</div></main>
}

function getLocationState() {
  if (typeof window === 'undefined') return { view: 'home', section: 'product' }
  const section = window.location.hash.replace(/^#/, '') || 'product'
  const routedViews = ['investigate', 'report', 'cases', 'sources']
  return { view: routedViews.includes(section) ? section : section === 'report-questions' || section === 'signal-breakdown' ? 'report' : 'home', section }
}

function App() {
  const initialLocation = getLocationState()
  const [view, setView] = useState(initialLocation.view)
  const [theme, setTheme] = useState(getInitialTheme)
  const [report, setReport] = useState(null)
  const [cases, setCases] = useState(getStoredCases)
  const [caseSaved, setCaseSaved] = useState(false)
  const [saveNotice, setSaveNotice] = useState('')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [pendingSection, setPendingSection] = useState(initialLocation.section)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  useEffect(() => {
    const titles = { home: 'Nishtha — Evidence before trust', investigate: 'Investigate — Nishtha', report: 'Evidence report — Nishtha', cases: 'Saved cases — Nishtha', sources: 'Source detail — Nishtha' }
    document.title = titles[view] || titles.home
  }, [view])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('nishtha-theme', theme)
    } catch {
      // Theme preference is optional.
    }
  }, [theme])

  useEffect(() => {
    if (!pendingSection) return undefined
    const timer = window.setTimeout(() => {
      const target = document.getElementById(pendingSection)
      if (target) target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
      else window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
      setPendingSection(null)
    }, 0)
    return () => window.clearTimeout(timer)
  }, [view, pendingSection, reducedMotion])

  useEffect(() => {
    const onPopState = () => {
      const next = getLocationState()
      setView(next.view)
      setPendingSection(next.section)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (destination) => {
    const nextView = destination.view || 'home'
    const nextSection = destination.section || nextView
    if (destination.view === 'investigate' && destination.reset !== false) {
      setReport(null)
      setCaseSaved(false)
      setSaveNotice('')
    }
    setView(nextView)
    setPendingSection(nextSection)
    const nextHash = `#${nextSection}`
    if (window.location.hash !== nextHash) window.history.pushState({ view: nextView, section: nextSection }, '', nextHash)
  }

  const saveCase = () => {
    const current = report || DEMO_REPORT
    const saved = { ...current, id: `${current.opportunity}-${Date.now()}`, createdAt: new Date().toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) }
    const next = [saved, ...cases.filter((item) => item.opportunity !== current.opportunity)].slice(0, 12)
    setCases(next)
    const persisted = saveStoredCases(next)
    setCaseSaved(true)
    setSaveNotice(persisted ? 'Saved on this device' : 'Saved for this session only')
  }

  const selectedView = useMemo(() => {
    if (view === 'investigate') return <InvestigationView report={report} onReport={(next) => { setReport(next); setCaseSaved(false); setSaveNotice('') }} onOpenReport={() => navigate({ view: 'report', section: 'report' })} onSaveCase={saveCase} caseSaved={caseSaved} onNavigate={navigate} />
    if (view === 'report') return <ReportView report={report} onUpdateReport={setReport} onSaveCase={saveCase} caseSaved={caseSaved} onNavigate={navigate} />
    if (view === 'cases') return <CasesView cases={cases} onSelect={(item) => { setReport(item); setCaseSaved(true); setSaveNotice('Saved on this device'); navigate({ view: 'report', section: 'report', reset: false }) }} onNavigate={navigate} />
    if (view === 'sources') return <SourcesView report={report} onNavigate={navigate} />
    return <LandingPage onNavigate={navigate} reducedMotion={reducedMotion} />
  }, [view, report, cases, caseSaved, reducedMotion])

  return <div className={`app-shell app-view-${view} theme-${theme}`}><AppHeader currentView={view} theme={theme} onToggleTheme={() => setTheme((value) => value === 'dark' ? 'light' : 'dark')} onNavigate={navigate} />{selectedView}{saveNotice && <div className="save-toast" role="status">{saveNotice}</div>}<NishiGuide view={view} onNavigate={navigate} /></div>
}

export default App
