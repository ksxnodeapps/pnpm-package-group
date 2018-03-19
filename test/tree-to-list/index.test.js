'use strict'
const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const jtry = require('just-try')
const objUtils = require('../../lib/object-utils')
const convert = require('../../lib/tree-to-list')
const data = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, 'data.yaml'), 'utf8'))

describe('exported entity', () => {
  it('is a function', () => expect(typeof convert).toBe('function'))

  describe('when being called', () => {
    const fn = x => jtry(
      () => convert(x),
      ({name, message}) => ({
        'err-name': name,
        'err-msg': message
      })
    )

    describe('works as expected', () => {
      Object.entries(data).forEach(
        ([title, {description, input, output}]) => {
          it(`${title.toUpperCase()}: ${description}`, () => {
            expect(fn(input)).toEqual(output)
          })
        }
      )
    })

    it('stays unchanged', () => {
      expect(Object
        .entries(data)
        .map(([title, {description, input}]) => [
          title,
          {
            description,
            input,
            output: fn(input)
          }
        ])
        .reduce(objUtils.entriesReducer, {})
      ).toMatchSnapshot()
    })
  })
})
