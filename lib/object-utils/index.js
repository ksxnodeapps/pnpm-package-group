'use strict'
const deepmerge = require('deepmerge')

const entriesReducer = (obj, [key, val]) =>
  Object.assign(obj, {[key]: val})

const merge = (...args) =>
  args.reduce((a, b) => deepmerge(a, b), {})

module.exports = {
  entriesReducer,
  merge
}
