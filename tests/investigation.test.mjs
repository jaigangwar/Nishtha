import test from 'node:test'
import assert from 'node:assert/strict'
import { analyzeOpportunity, SAMPLE_CASES } from '../src/lib/investigation.js'

test('local scan quotes supplied signals instead of returning a fixed report', () => {
  const report = analyzeOpportunity('Please pay ₹1,500 before Friday for guaranteed placement. Contact hello@example.com.')
  assert.equal(report.sourceSignals.hasFee, true)
  assert.equal(report.sourceSignals.hasClaim, true)
  assert.ok(report.evidence.some((item) => item.quote.includes('₹1,500')))
  assert.ok(report.questions.length >= 2)
  assert.ok(report.evidence.every((item) => item.source === 'Supplied opportunity text'))
})

test('different opportunity text produces different visible evidence', () => {
  const feeReport = analyzeOpportunity(SAMPLE_CASES[0].text)
  const grantReport = analyzeOpportunity(SAMPLE_CASES[2].text)
  assert.notEqual(feeReport.opportunity, grantReport.opportunity)
  assert.equal(feeReport.sourceSignals.hasFee, true)
  assert.equal(grantReport.sourceSignals.hasFee, false)
  assert.notEqual(feeReport.score, grantReport.score)
})

test('no detected signals remains honest about uncertainty', () => {
  const report = analyzeOpportunity('A community workshop is planned for next month.')
  assert.match(report.evidence[0].detail, /absence of a signal is not evidence of safety/i)
  assert.equal(report.sourceSignals.hasContact, false)
  assert.ok(report.questions.length > 0)
})
