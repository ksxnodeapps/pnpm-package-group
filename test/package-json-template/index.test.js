'use strict'
const data = require('../../lib/package-json-template/data')
const main = require('../../lib/package-json-template')

describe('data', () => {
  it('stays unchanged', () => {
    expect(data).toMatchSnapshot()
  })
})

describe('main module', () => {
  it('stays unchanged', () => {
    expect(main).toMatchSnapshot()
  })

  it('has .object', () => {
    expect(main.object).toEqual(data)
  })

  it('has .json', () => {
    expect(JSON.parse(main.json)).toEqual(data)
  })
})
