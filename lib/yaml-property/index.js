'use strict'
const path = require('path')
const fs = require('fs')
const process = require('process')
const yaml = require('js-yaml')
const objUtils = require('../object-utils')

const fromObject = (object, [base, ...next], path = []) =>
  base == null ? {object, path} : fromObject(object[base], next, [...path, base])

const fromFileSystem = (dir, base, ...next) => {
  const name = dir + path.sep + base
  const stats = fs.statSync(name)

  if (stats.isFile()) {
    const text = fs.readFileSync(name, 'utf8')
    const object = yaml.safeLoad(text)
    return fromObject(object, next)
  }

  if (stats.isDirectory()) {
    if (!next.length) throw new Error('Cannot get object from a directory')
    return fromFileSystem(name, ...next)
  }

  throw new Error(`Path ${JSON.stringify(name)} is neither file nor directory`)
}

const fullInfo = xpath => {
  if (typeof xpath !== 'string') throw new TypeError('Path is not a string')
  return fromFileSystem(...path.resolve(process.cwd(), xpath).split(/\/|\\/))
}

const getYamlProperty = xpath => fullInfo(xpath).object

const preservePropertyPath = xpath => {
  const {object, path} = fullInfo(xpath)
  return objUtils.nestedObject(object, path)
}

module.exports = Object.assign(getYamlProperty, {
  getYamlProperty,
  fullInfo,
  preservePropertyPath,
  __internal: {
    fromObject,
    fromFileSystem
  }
})
