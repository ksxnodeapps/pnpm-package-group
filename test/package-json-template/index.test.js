'use strict'
const data = require('../../lib/package-json-template/data')
const main = require('../../lib/package-json-template')

describe('data', () => {
  it('should stay unchanged', () => {
    expect(data).toMatchSnapshot()
  })
})

describe('main module', () => {
  it('should stay unchanged', () => {
    expect(main).toMatchSnapshot()
  })

  it('has .object', () => {
    expect(main.object).toEqual(data)
  })

  it('has .json', () => {
    expect(JSON.parse(main.json)).toEqual(data)
  })
})
