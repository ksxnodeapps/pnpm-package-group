'use strict'
const deepmerge = require('deepmerge')

const entriesReducer = (obj, [key, val]) =>
  Object.assign(obj, {[key]: val})

const merge = (...args) =>
  args.reduce((a, b) => deepmerge(a, b), {})

const nestedObject = (value, path) => {
  if (path.length === 0) return value
  const [first, ...rest] = path
  return {[first]: nestedObject(value, rest)}
}

const filterEntries = (object, filter) => Object
  .entries(object)
  .filter(pair => filter(pair, object))
  .reduce(entriesReducer, {})

module.exports = {
  entriesReducer,
  merge,
  nestedObject,
  filterEntries
}
