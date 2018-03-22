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

describe('merge function', () => {
  it('works', () => {
    const args = Array.from('abcdef').map(x => ({arr: [x]}))
    expect(subject.merge(...args)).toEqual({arr: Array.from('abcdef')})
  })

  it('stays unchanged', () => {
    expect(subject.merge(
      ...Array
        .from('abcdef')
        .map(x => ({arr: [x], [x]: x.toUpperCase()}))
    )).toMatchSnapshot()
  })
})
