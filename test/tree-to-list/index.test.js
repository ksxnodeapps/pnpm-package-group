'use strict'
const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const convert = require('../../lib/tree-to-list')

describe('exported entity', () => {
  it('is a function', () => expect(typeof convert).toBe('function'))

  describe('when being called with input.yaml', () => {
    const readYamlFile = basename =>
      yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, basename), 'utf8'))

    const input = readYamlFile('input.yaml')
    const output = readYamlFile('output.yaml')

    it('gives result equal to output.yaml', () => {
      expect(convert(input)).toEqual(output)
    })

    it('should stay unchanged', () => {
      expect(convert(input)).toMatchSnapshot()
    })
  })
})
