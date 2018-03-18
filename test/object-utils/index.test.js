'use strict'
const subject = require('../../lib/object-utils')

describe('entriesReducer', () => {
  it('works', () => {
    expect(
      [
        ['abc', 123],
        ['def', 456],
        ['ghi', 789]
      ].reduce(
        subject.entriesReducer,
        {}
      )
    ).toEqual({
      abc: 123,
      def: 456,
      ghi: 789
    })
  })
})
