import test from 'node:test'
import assert from 'node:assert/strict'
import { getGuideActionTarget, getGuideContext } from '../src/lib/guide.js'

test('guide provides useful context for every application surface', () => {
  for (const view of ['home', 'investigate', 'report', 'cases', 'sources']) {
    const context = getGuideContext(view)
    assert.ok(context.message)
    assert.ok(context.actions.length > 0)
  }
})

test('guide actions resolve to real views or landing sections', () => {
  assert.deepEqual(getGuideActionTarget('investigate'), { view: 'investigate', section: 'investigate' })
  assert.deepEqual(getGuideActionTarget('report-questions'), { view: 'report', section: 'report-questions' })
  assert.deepEqual(getGuideActionTarget('report-signal'), { view: 'report', section: 'signal-breakdown' })
  assert.deepEqual(getGuideActionTarget('safety'), { view: 'home', section: 'safety' })
})
