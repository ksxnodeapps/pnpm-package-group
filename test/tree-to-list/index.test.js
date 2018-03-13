'use strict'
const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const jtry = require('just-try')
const convert = require('../../lib/tree-to-list')

describe('exported entity', () => {
  it('is a function', () => expect(typeof convert).toBe('function'))

  describe('when being called with input.yaml', () => {
    const readYamlFile = basename =>
      yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, basename), 'utf8'))

    const fn = x => jtry(
      () => convert(x),
      ({name, message}) => ({
        'err-name': name,
        'err-msg': message
      })
    )

    const received = readYamlFile('input.yaml')
      .map(({input, description}) => ({
        output: fn(input),
        description
      }))

    const expected = readYamlFile('output.yaml')

    it('gives result equal to output.yaml', () => {
      expect(received).toEqual(expected)
    })

    it('stays unchanged', () => {
      expect(received).toMatchSnapshot()
    })
  })
})
