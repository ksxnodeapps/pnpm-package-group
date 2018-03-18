'use strict'
const objReducer = require('../object-utils').entriesReducer
const arrReducer = require('../array-utils').concatReducer

const isFlat = (object, flat) =>
  '__flat' in object ? object.__flat : flat

const getPayload = object => Object
  .entries(object)
  .filter(([key]) => !/^_/.test(key))
  .reduce(objReducer, {})

const isBottom = object => Array.isArray(object)

const resElm = (path, data) => ({path, data})

const addPath = (path, addend) => path + addend + '/'

const convertFlat = (payload, path, flat) => Object
  .values(payload)
  .map(val => convertSeparate(val, path, flat))
  .reduce(arrReducer, [])

const convertNested = (payload, path, flat) => Object
  .entries(payload)
  .map(([key, val]) => [addPath(path, key), val])
  .map(([path, val]) => convertSeparate(val, path, flat))
  .reduce(arrReducer, [])

const convertSeparate = (object, path = '', flat = false) => {
  if (isBottom(object)) return [resElm(path, object)]

  const payload = getPayload(object)

  return isFlat(object, flat)
    ? convertFlat(payload, path, true)
    : convertNested(payload, path, false)
}

const convert = object => {
  const db = {}

  const add = (path, data) => {
    if (path in db) {
      db[path].push(...data)
    } else {
      db[path] = Array.from(data)
    }
  }

  convertSeparate(object)
    .forEach(({path, data}) => add(path, data))

  return Object
    .entries(db)
    .map(([path, data]) => resElm(path, data))
}

module.exports = Object.assign(convert, {
  convert,
  __internal: {
    isFlat,
    getPayload,
    isBottom,
    resElm,
    addPath,
    convertFlat,
    convertNested,
    convertSeparate,
    convert
  }
})