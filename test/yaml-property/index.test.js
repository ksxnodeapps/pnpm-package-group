'use strict'
const path = require('path')
const process = require('process')
const getYamlProperty = require('../../lib/yaml-property')
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
      const testProp = (xpath, comp) =>
        expect(getYamlProperty(xpath)).toEqual(comp)

      it('after basename of file', () => {
        process.chdir(__dirname)
        testProp('data.yaml/object', data.object)
        testProp('data.yaml/object/abc', data.object.abc)
        testProp('data.yaml/object/def', data.object.def)
        testProp('data.yaml/array', data.array)
        testProp('data.yaml/array/length', data.array.length)
        testProp('data.yaml/array/0', data.array[0])
        testProp('data.yaml/array/1', data.array[1])
        testProp('data.yaml/string', data.string)
        testProp('data.yaml/string/length', data.string.length)
      })

      it('after relative path to file', () => {
        process.chdir(path.resolve(__dirname, '../..'))
        testProp('test/yaml-property/data.yaml/object', data.object)
        testProp('test/yaml-property/data.yaml/object/abc', data.object.abc)
        testProp('test/yaml-property/data.yaml/object/def', data.object.def)
        testProp('test/yaml-property/data.yaml/array', data.array)
        testProp('test/yaml-property/data.yaml/array/length', data.array.length)
        testProp('test/yaml-property/data.yaml/array/0', data.array[0])
        testProp('test/yaml-property/data.yaml/array/1', data.array[1])
        testProp('test/yaml-property/data.yaml/string', data.string)
        testProp('test/yaml-property/data.yaml/string/length', data.string.length)
      })

      it('after absolute path to file', () => {
        testProp(path.resolve(__dirname, 'data.yaml/object'), data.object)
        testProp(path.resolve(__dirname, 'data.yaml/object/abc'), data.object.abc)
        testProp(path.resolve(__dirname, 'data.yaml/object/def'), data.object.def)
        testProp(path.resolve(__dirname, 'data.yaml/array'), data.array)
        testProp(path.resolve(__dirname, 'data.yaml/array/length'), data.array.length)
        testProp(path.resolve(__dirname, 'data.yaml/array/0'), data.array[0])
        testProp(path.resolve(__dirname, 'data.yaml/array/1'), data.array[1])
        testProp(path.resolve(__dirname, 'data.yaml/string'), data.string)
        testProp(path.resolve(__dirname, 'data.yaml/string/length'), data.string.length)
      })
    })
  })
})
