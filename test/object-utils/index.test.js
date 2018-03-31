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

describe('filterEntries function', () => {
  const object = {
    abc: 'abc',
    def: 'abc',
    ABC: 'DEF',
    DEF: 'DEF'
  }

  const filter = ([key, val]) => key === val

  it('works', () => {
    expect(
      subject.filterEntries(object, filter)
    ).toEqual({
      abc: 'abc',
      DEF: 'DEF'
    })
  })

  it('stay unchaned', () => {
    expect(
      subject.filterEntries(object, filter)
    ).toMatchSnapshot()
  })

  it('provides original object as second argument', () => {
    subject.filterEntries(
      object,
      (_, secondArgument) =>
        expect(secondArgument).toBe(object)
    )
  })
})
