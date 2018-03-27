'use strict'
const objReducer = require('../object-utils').entriesReducer
const arrReducer = require('../array-utils').concatReducer

const GLOBAL_PATH = '((GLOBAL))'

const getStruct = (object, struct) =>
  '__struct' in object ? object.__struct : struct

const getPayload = object => Object
  .entries(object)
  .filter(([key]) => !/^_/.test(key))
  .reduce(objReducer, {})

const isBottom = object => Array.isArray(object)

const resElm = (path, data) => ({path, data})

const addPath = (path, addend) => path + addend + '/'

const convertGlobal = (payload, path, struct) =>
  convertNested(payload, path, struct)

const convertFlat = (payload, visiblePath, hiddenPath, struct) => Object
  .entries(payload)
  .map(([key, val]) => [addPath(hiddenPath, key), val])
  .map(([hiddenPath, val]) => convertSeparate(val, visiblePath, hiddenPath, struct))
  .reduce(arrReducer, [])

const convertNested = (payload, path, struct) => Object
  .entries(payload)
  .map(([key, val]) => [addPath(path, key), val])
  .map(([path, val]) => convertSeparate(val, path, path, struct))
  .reduce(arrReducer, [])

const convertSeparate = (object, visiblePath = '', hiddenPath = '', struct = 'nested') => {
  if (typeof object !== 'object' || !object) throw new TypeError('Invalid type of tree')
  if (isBottom(object)) return [resElm(struct === 'global' ? GLOBAL_PATH : visiblePath, object)]

  const payload = getPayload(object)

  switch (getStruct(object, struct)) {
    case 'global':
      return convertGlobal(payload, hiddenPath, 'global')
    case 'nested':
      return convertNested(payload, hiddenPath, 'nested')
    case 'flat':
      return convertFlat(payload, '__struct' in object ? hiddenPath : visiblePath, hiddenPath, 'flat')
    default:
      throw new Error('Invalid value of __struct')
  }
}

const convert = object => {
  const db = {
    [GLOBAL_PATH]: []
  }

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
    GLOBAL_PATH,
    getStruct,
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
