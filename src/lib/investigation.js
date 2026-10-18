export const SAMPLE_CASES = [
  {
    id: 'fee-request',
    label: 'Fee request',
    tone: 'rust',
    title: 'Acme Skills Fellowship',
    text: 'Congratulations — your seat is reserved for the Acme Skills Fellowship. Pay a ₹2,400 registration fee before 14 May to unlock 100% placement support. Contact admissions@acmeskills.example for the next steps.',
  },
  {
    id: 'incomplete',
    label: 'Promising, incomplete',
    tone: 'olive',
    title: 'Northstar Design Residency',
    text: 'You are invited to apply for the Northstar Design Residency. Applications close on 30 June. The program is led by Mira Shah at northstar-residency.example. The invitation does not mention a refund policy or publish participant outcomes.',
  },
  {
    id: 'better-supported',
    label: 'More specific, still open',
    tone: 'olive',
    title: 'Cedar Open Data Grant',
    text: 'Cedar Open Data Grant — applications close 12 August. The grant is administered by Cedar Commons Foundation, registration ID CF-2048, at cedarcommons.example. No application fee. Questions can be sent to grants@cedarcommons.example. Outcomes and award decisions are published after review.',
  },
]

const CURRENCY_PATTERN = /(?:₹|rs\.?|inr|\$|€|£)\s?[\d,]+(?:\.\d+)?|\b\d[\d,]*(?:\.\d+)?\s?(?:rupees|rs|registration fee|application fee|processing fee)/i
const CLAIM_PATTERN = /\b(?:100%|guaranteed|guarantee|assured|assurance|zero risk|instant approval|best in class|limited seats)\b[^.!?]*/i
const DEADLINE_PATTERN = /(?:before|by|until|deadline|applications? close|apply within|closes on)[^.!?]*/i
const CONTACT_PATTERN = /(?:[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:https?:\/\/|www\.)\S+|registration\s*(?:id|no\.?)[^,.!?]*)/i
const ORGANIZATION_PATTERN = /(?:administered by|organised by|organized by|run by|registered|foundation|institute|university|company|inc\.?|ltd\.?)\b[^.!?]*/i
const REFUND_PATTERN = /refund|cancell?ation|money back/i

function quote(text, match, fallback = '') {
  if (!match) return fallback
  const value = typeof match === 'string' ? match : match[0]
  return value.trim().slice(0, 180)
}

function displayTitle(sourceText, preferredTitle) {
  if (preferredTitle) return preferredTitle
  const firstLine = sourceText.split(/\n|[.!?]/).map((part) => part.trim()).find(Boolean) || 'Opportunity review'
  return firstLine.length > 58 ? `${firstLine.slice(0, 55)}…` : firstLine
}

function evidenceItem({ id, type, tone, title, detail, quoteText, supports, limits }) {
  return {
    id,
    type,
    tone,
    title,
    detail,
    quote: quoteText || 'No exact excerpt was detected in the supplied text.',
    source: 'Supplied opportunity text',
    sourceLocation: 'Local input · no external source checked',
    supports,
    limits,
  }
}

export function analyzeOpportunity(sourceText, preferredTitle = '') {
  const text = String(sourceText || '').trim()
  const lower = text.toLowerCase()
  const feeMatch = text.match(CURRENCY_PATTERN)
  const claimMatch = text.match(CLAIM_PATTERN)
  const deadlineMatch = text.match(DEADLINE_PATTERN)
  const contactMatch = text.match(CONTACT_PATTERN)
  const organizationMatch = text.match(ORGANIZATION_PATTERN)
  const hasRefund = REFUND_PATTERN.test(text)
  const evidence = []

  if (feeMatch) {
    evidence.push(evidenceItem({
      id: 'fee', type: 'Observed', tone: 'olive',
      title: `The supplied text mentions ${quote(text, feeMatch)}.`,
      detail: 'This is directly visible in the material you supplied. A fee is a signal to ask for terms; it is not, by itself, proof of intent.',
      quoteText: quote(text, feeMatch),
      supports: 'A payment request appears in the supplied material.',
      limits: 'It cannot establish whether the organization is legitimate or whether the fee is refundable.',
    }))
  }

  if (claimMatch) {
    evidence.push(evidenceItem({
      id: 'claim', type: 'Unverified claim', tone: 'rust',
      title: `The text uses a strong promise: “${quote(text, claimMatch)}”.`,
      detail: 'The phrase is preserved as a claim because no independent outcome data or accountable source was checked in this local scan.',
      quoteText: quote(text, claimMatch),
      supports: 'The opportunity makes a strong outcome or urgency claim.',
      limits: 'It cannot support the promised result without a separate, specific source.',
    }))
  }

  if (deadlineMatch) {
    evidence.push(evidenceItem({
      id: 'deadline', type: 'Observed', tone: 'olive',
      title: `A timing signal appears: “${quote(text, deadlineMatch)}”.`,
      detail: 'A deadline can be ordinary logistics. It becomes more important when combined with pressure to pay or act before reading the terms.',
      quoteText: quote(text, deadlineMatch),
      supports: 'The supplied text gives a date or time constraint.',
      limits: 'It cannot prove that the deadline is genuine or that urgency is appropriate.',
    }))
  }

  if (contactMatch) {
    evidence.push(evidenceItem({
      id: 'trace', type: 'Source-aligned', tone: 'olive',
      title: `The text includes a traceable detail: “${quote(text, contactMatch)}”.`,
      detail: 'A contact, domain, or registration detail gives you a place to ask the next question. It is not independent verification.',
      quoteText: quote(text, contactMatch),
      supports: 'The material contains a contact or organization detail to follow up on.',
      limits: 'It cannot establish ownership, accountability, or a match with an external source.',
    }))
  }

  if (organizationMatch && !contactMatch) {
    evidence.push(evidenceItem({
      id: 'organization', type: 'Observed', tone: 'olive',
      title: `The text names an organization detail: “${quote(text, organizationMatch)}”.`,
      detail: 'Naming an organization is useful context, but the local scan does not look it up or confirm that the sender represents it.',
      quoteText: quote(text, organizationMatch),
      supports: 'The supplied text names a responsible group or organization.',
      limits: 'It cannot confirm the group exists or is connected to the message.',
    }))
  }

  if (!evidence.length) {
    evidence.push(evidenceItem({
      id: 'context', type: 'Observed', tone: 'olive',
      title: 'The supplied text does not contain a strong detectable signal yet.',
      detail: 'The local scan found no fee, deadline, contact, or promise pattern. A human review is still needed; absence of a signal is not evidence of safety.',
      quoteText: text.slice(0, 180),
      supports: 'Only the material you supplied can be described here.',
      limits: 'No external verification or legitimacy decision was performed.',
    }))
  }

  const questions = []
  if (feeMatch && !hasRefund) questions.push({ id: 'refund', priority: 'next', text: 'Can the organization explain the fee and provide a written refund policy?' })
  if (claimMatch) questions.push({ id: 'outcomes', priority: 'next', text: 'What independent source supports the promised outcome, and how recent is it?' })
  if (!contactMatch) questions.push({ id: 'contact', priority: 'next', text: 'Who is the accountable contact, and can they verify the opportunity outside this message?' })
  if (!organizationMatch) questions.push({ id: 'organization', priority: 'open', text: 'What organization is responsible, and where is its official program information?' })
  if (deadlineMatch) questions.push({ id: 'time', priority: 'open', text: 'Can you review the terms without acting under the stated time pressure?' })
  if (!questions.length) questions.push({ id: 'source', priority: 'next', text: 'What independent source can support the central claim before you act?' })

  const breakdown = [
    { id: 'payment', label: 'Payment pressure', value: feeMatch ? 28 : 82, note: feeMatch ? 'A payment request is visible; terms remain open.' : 'No fee language detected in the supplied text.' },
    { id: 'traceability', label: 'Traceability', value: contactMatch || organizationMatch ? 68 : 24, note: contactMatch || organizationMatch ? 'A contact or organization detail gives you a follow-up path.' : 'The material does not name a clear accountable source.' },
    { id: 'claim', label: 'Claim specificity', value: claimMatch ? 36 : 62, note: claimMatch ? 'A strong promise needs outcome evidence.' : 'No high-pressure promise pattern detected.' },
    { id: 'corroboration', label: 'Independent corroboration', value: 0, note: 'No external source was checked in this local prototype.' },
    { id: 'open', label: 'Open questions', value: Math.max(18, 100 - questions.length * 17), note: `${questions.length} question${questions.length === 1 ? '' : 's'} remain before a careful next step.` },
  ]
  const score = Math.round(breakdown.reduce((sum, item) => sum + item.value, 0) / breakdown.length)
  const title = displayTitle(text, preferredTitle)
  const needsMore = questions.length >= 2 || Boolean(claimMatch || feeMatch)

  return {
    opportunity: title,
    sourceText: text,
    createdAt: 'Local heuristic scan · no external source checked',
    summary: needsMore
      ? `The supplied material contains ${evidence.length} visible signal${evidence.length === 1 ? '' : 's'}, but ${questions.length} question${questions.length === 1 ? '' : 's'} still need a source or a direct answer.`
      : 'The supplied material is specific enough to create a follow-up trail, but it still has not been independently verified.',
    confidence: needsMore ? 'Needs more evidence' : 'A trail exists · keep checking',
    score,
    breakdown,
    evidence,
    questions,
    questionStatus: {},
    sample: false,
    scanNote: 'Local heuristic scan · this is not fraud detection and no external source was checked.',
    sourceSignals: { hasFee: Boolean(feeMatch), hasClaim: Boolean(claimMatch), hasDeadline: Boolean(deadlineMatch), hasContact: Boolean(contactMatch), hasRefund, hasOrganization: Boolean(organizationMatch), wordCount: lower.split(/\s+/).filter(Boolean).length },
  }
}

export function analyzeSample(sample) {
  return { ...analyzeOpportunity(sample.text, sample.title), sample: true, sampleId: sample.id, sampleLabel: sample.label }
}
