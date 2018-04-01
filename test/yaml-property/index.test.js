'use strict'
const path = require('path')
const process = require('process')
const {getYamlProperty, fullInfo} = require('../../lib/yaml-property')
const data = require('./data')

describe('getYamlProperty', () => {
  it('should be a function', () => {
    expect(typeof getYamlProperty).toBe('function')
  })

  it('should has .getYamlProperty', () => {
    expect(getYamlProperty.getYamlProperty).toBe(getYamlProperty)
  })

  describe('should works', () => {
    describe('when not provide property path', () => {
      const testObject = file =>
        expect(getYamlProperty(file)).toEqual(data)

      it('but provide file by basename', () => {
        process.chdir(__dirname)
        testObject('data.yaml')
      })

      it('but provide file by relative path', () => {
        process.chdir(path.resolve(__dirname, '../..'))
        testObject('test/yaml-property/data.yaml')
      })

      it('but provide file by absolute path', () => {
        testObject(path.resolve(__dirname, 'data.yaml'))
      })
    })

    describe('when provide property path', () => {
      const testProp = (xpath, object, path) => {
        expect(fullInfo(xpath)).toEqual({object, path})
        expect(getYamlProperty(xpath)).toEqual(object)
      }

      it('after basename of file', () => {
        process.chdir(__dirname)
        testProp('data.yaml/object', data.object, ['object'])
        testProp('data.yaml/object/abc', data.object.abc, ['object', 'abc'])
        testProp('data.yaml/object/def', data.object.def, ['object', 'def'])
        testProp('data.yaml/array', data.array, ['array'])
        testProp('data.yaml/array/length', data.array.length, ['array', 'length'])
        testProp('data.yaml/array/0', data.array[0], ['array', '0'])
        testProp('data.yaml/array/1', data.array[1], ['array', '1'])
        testProp('data.yaml/string', data.string, ['string'])
        testProp('data.yaml/string/length', data.string.length, ['string', 'length'])
      })

      it('after relative path to file', () => {
        process.chdir(path.resolve(__dirname, '../..'))
        testProp('test/yaml-property/data.yaml/object', data.object, ['object'])
        testProp('test/yaml-property/data.yaml/object/abc', data.object.abc, ['object', 'abc'])
        testProp('test/yaml-property/data.yaml/object/def', data.object.def, ['object', 'def'])
        testProp('test/yaml-property/data.yaml/array', data.array, ['array'])
        testProp('test/yaml-property/data.yaml/array/length', data.array.length, ['array', 'length'])
        testProp('test/yaml-property/data.yaml/array/0', data.array[0], ['array', '0'])
        testProp('test/yaml-property/data.yaml/array/1', data.array[1], ['array', '1'])
        testProp('test/yaml-property/data.yaml/string', data.string, ['string'])
        testProp('test/yaml-property/data.yaml/string/length', data.string.length, ['string', 'length'])
      })

      it('after absolute path to file', () => {
        testProp(path.resolve(__dirname, 'data.yaml/object'), data.object, ['object'])
        testProp(path.resolve(__dirname, 'data.yaml/object/abc'), data.object.abc, ['object', 'abc'])
        testProp(path.resolve(__dirname, 'data.yaml/object/def'), data.object.def, ['object', 'def'])
        testProp(path.resolve(__dirname, 'data.yaml/array'), data.array, ['array'])
        testProp(path.resolve(__dirname, 'data.yaml/array/length'), data.array.length, ['array', 'length'])
        testProp(path.resolve(__dirname, 'data.yaml/array/0'), data.array[0], ['array', '0'])
        testProp(path.resolve(__dirname, 'data.yaml/array/1'), data.array[1], ['array', '1'])
        testProp(path.resolve(__dirname, 'data.yaml/string'), data.string, ['string'])
        testProp(path.resolve(__dirname, 'data.yaml/string/length'), data.string.length, ['string', 'length'])
      })
    })
  })

  describe('should throws an error', () => {
    const testError = (xpath, error) => () =>
      expect(() => getYamlProperty(xpath)).toThrow(error)

    it('when provided entity does not exist', testError('Does not exist', /ENOENT/))
    it('when provided entity is a directory', testError(__dirname, /directory/i))

    describe('when path is not a string', () => {
      const testErrSnap = xpath => () =>
        expect(() => getYamlProperty(xpath)).toThrowErrorMatchingSnapshot()

      it('but a null', testErrSnap(null))
      it('but an undefined', testErrSnap(undefined))
      it('but a number', testErrSnap(12.34))
      it('but an object', testErrSnap({abc: 123}))
      it('but a function', testErrSnap(() => 123))
    })
  })
})
