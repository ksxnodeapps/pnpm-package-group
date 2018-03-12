'use strict'
const {ProductIterable} = require('x-iterable')
const format = require('../../lib/command-template')

describe('exported entity', () => {
  const tmplSet = ProductIterable.pow(
    ['list', 'argv', 'arguments', 'pkgs', 'packages'],
    2
  )
    .to(Array)
    .map(([left, right]) => `begin {${left}} middle {${right}} end`)

  const listSet = [
    ['abc', 'def', 'ghi'],
    [123, 456, 789]
  ]

  const testMltpTmpl = fn => () => {
    const mksmpl = (tmpl, list) => ({
      input: {tmpl, list},
      output: fn(tmpl, list)
    })

    const allSmpls = []

    listSet.forEach(list => {
      const smpls = tmplSet.map(tmpl => mksmpl(tmpl, list))
      allSmpls.push(...smpls)
      const [first, ...rest] = smpls
      rest.forEach(smpl => expect(smpl.rslt).toEqual(first.rslt))
    })

    expect(allSmpls).toMatchSnapshot()
  }

  it('is a function', () => expect(typeof format).toBe('function'))
  it('has .createContext', testMltpTmpl((_, list) => format.createContext(list)))
  it('has .createString', testMltpTmpl(format.createString))
  it('has .createArgv', () => expect(format.createArgv).toBe(format))
  it('stays unchanged', testMltpTmpl(format))

  it('returns array', () => {
    new ProductIterable(tmplSet, listSet).forEach(([tmpl, list]) => {
      expect(format(tmpl, list)).toBeInstanceOf(Array)
    })
  })

  it('works (in general)', () => {
    expect(format(
      '<< {list} >>',
      ['abc', 'def', 'ghi']
    )).toEqual(
      ['<<', 'abc', 'def', 'ghi', '>>']
    )
  })
})
