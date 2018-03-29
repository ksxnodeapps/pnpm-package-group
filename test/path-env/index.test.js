'use strict'
const path = require('path')
const subject = require('../../lib.dev/path-env')

const data = (() => {
  const array = ['abc', 'def', 'ghi']
  const string = array.join(path.delimiter)
  return {array, string}
})()

const matchKeys = (received, expected) => {
  expect(Object.keys(received)).toEqual(Object.keys(expected))
}

describe('split function', () => {
  const {array, string} = data

  it('works', () => {
    expect(subject.split(string)).toEqual(array)
  })

  it('stays unchanged', () => {
    expect(subject.split(string)).toMatchSnapshot()
  })
})

describe('join function', () => {
  const {array, string} = data

  it('works', () => {
    expect(subject.join(array)).toBe(string)
  })
})

describe('pathString', () => {
  const {array, string} = data
  const addend = Array.from('abcdef')
  const result = subject.pathString(string)

  it('has enough properties', () => {
    expect(Object.keys(result)).toMatchSnapshot()
  })

  it('has .string', () => {
    expect(result.string).toBe(string)
  })

  it('has .array', () => {
    expect(result.array).toEqual(array)
  })

  describe('has .append()', () => {
    const appended = result.append(...addend)
    const expectedArray = [...array, ...addend]

    it('that has enough properties', () => {
      matchKeys(appended, result)
    })

    it('that contains correct .string', () => {
      expect(appended.string).toBe(subject.join(expectedArray))
    })

    it('that contains correct .array', () => {
      expect(appended.array).toEqual(expectedArray)
    })
  })

  describe('has .prepend()', () => {
    const prepended = result.prepend(...addend)
    const expectedArray = [...addend, ...array]

    it('that has enough properties', () => {
      matchKeys(prepended, result)
    })

    it('that contains correct .string', () => {
      expect(prepended.string).toBe(subject.join(expectedArray))
    })

    it('that contains correct .array', () => {
      expect(prepended.array).toEqual(expectedArray)
    })
  })

  describe('has .surround()', () => {
    const surrounded = result.surround(...addend)
    const expectedArray = [...addend, ...array, ...addend]

    it('that has enough properties', () => {
      matchKeys(surrounded, result)
    })

    it('that contains correct .string', () => {
      expect(surrounded.string).toBe(subject.join(expectedArray))
    })

    it('that contains correct .array', () => {
      expect(surrounded.array).toEqual(expectedArray)
    })
  })

  it('has .toString()', () => {
    expect(result.toString()).toBe(result.string)
  })
})

describe('pathArray', () => {
  const {array, string} = data
  const resArr = subject.pathArray(array)
  const resStr = subject.pathString(string)

  it('that matches pathString', () => {
    matchKeys(resArr, resStr)
    expect(resArr.string).toBe(resStr.string)
    expect(resArr.array).toEqual(resStr.array)
  })
})

describe('envMod', () => {
  const {string} = data
  const baseEnv = {hello: 'world', foo: 'bar'}
  const oldEnv = {...baseEnv, PATH: string}
  const result = subject.envMod(oldEnv)

  it('has enough properties', () => {
    expect(Object.keys(result)).toMatchSnapshot()
  })

  it('has .env', () => {
    expect(result.env).toEqual(oldEnv)
  })

  it('has .name', () => {
    expect(result.name).toBe('PATH')
  })

  it('has .pathVar', () => {
    expect(result.pathVar).toBe(string)
  })

  describe('has .pathMod', () => {
    const {pathMod} = result
    const comparator = subject.pathString(string)

    it('that matches pathString', () => {
      matchKeys(pathMod, comparator)
      expect(pathMod.string).toBe(comparator.string)
      expect(pathMod.array).toEqual(comparator.array)
    })
  })
})
