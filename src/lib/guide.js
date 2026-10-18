export const GUIDE_CONTEXT = {
  home: {
    eyebrow: 'You are in the overview',
    message: "Let's examine this opportunity together. Start with the claim, then follow the evidence trail.",
    actions: [
      { label: 'Start an investigation', target: 'investigate' },
      { label: 'How Nishtha works', target: 'works' },
      { label: 'Understand evidence coverage', target: 'safety' },
      { label: 'View saved cases', target: 'cases' },
      { label: 'Explore safety tips', target: 'safety' },
    ],
  },
  investigate: {
    eyebrow: 'Investigation workspace',
    message: 'Bring one opportunity into focus. We will keep observed facts separate from open questions.',
    actions: [
      { label: 'Why evidence matters', target: 'safety' },
      { label: 'What happens next', target: 'works' },
      { label: 'View saved cases', target: 'cases' },
    ],
  },
  report: {
    eyebrow: 'Report review',
    message: "Your report is ready. Let's review the unresolved questions before you decide what to do next.",
    actions: [
      { label: 'Read unresolved questions', target: 'report-questions' },
      { label: 'Understand this coverage score', target: 'report-signal' },
      { label: 'Open source references', target: 'sources' },
      { label: 'Start another investigation', target: 'investigate' },
    ],
  },
  cases: {
    eyebrow: 'Saved cases',
    message: 'Saved cases keep the trail together so you can return to a question without losing its context.',
    actions: [
      { label: 'Start an investigation', target: 'investigate' },
      { label: 'How Nishtha works', target: 'works' },
    ],
  },
  sources: {
    eyebrow: 'Source detail',
    message: 'Open each reference to see what was actually checked, what was not, and where uncertainty remains.',
    actions: [
      { label: 'Back to the report', target: 'report' },
      { label: 'Explore safety tips', target: 'safety' },
    ],
  },
}

export function getGuideContext(view = 'home') {
  return GUIDE_CONTEXT[view] ?? GUIDE_CONTEXT.home
}

export function getGuideActionTarget(target) {
  if (target === 'investigate') return { view: 'investigate', section: 'investigate' }
  if (target === 'cases') return { view: 'cases', section: 'cases' }
  if (target === 'report') return { view: 'report', section: 'report' }
  if (target === 'sources') return { view: 'sources', section: 'sources' }
  if (target === 'report-questions') return { view: 'report', section: 'report-questions' }
  if (target === 'report-signal') return { view: 'report', section: 'signal-breakdown' }
  return { view: 'home', section: target }
}
