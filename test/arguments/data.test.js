'use strict'
const {resolve} = require('path')
const {readFileSync} = require('fs')

const getText = basename =>
  readFileSync(resolve(__dirname, '../../lib/arguments', basename), 'utf8')

const yaml = require('js-yaml').safeLoad(getText('data.yaml'))
const json = JSON.parse(getText('data.json'))

describe('data.yaml and data.json', () => {
  it('stays unchanged', () => {
    expect({yaml, json}).toMatchSnapshot()
  })

  it('should be equal', () => {
    expect(yaml).toEqual(json)
  })
})
