'use strict'
const subject = require('../../lib/array-utils')

describe('concatReducer', () => {
  it('works', () => {
    expect(
      [
        ['abc', 'def', 'ghi'],
        [123, 456],
        'abcdef'
      ].reduce(subject.concatReducer, [])
    ).toEqual([
      ...['abc', 'def', 'ghi'],
      ...[123, 456],
      ...'abcdef'
    ])
  })
})
