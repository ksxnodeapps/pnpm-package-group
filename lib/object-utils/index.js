'use strict'

const entriesReducer = (obj, [key, val]) =>
  Object.assign(obj, {[key]: val})

module.exports = {
  entriesReducer
}
