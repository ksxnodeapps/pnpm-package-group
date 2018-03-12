'use strict'
const format = require('string-template')

const createContext = (list) => ({
  list,
  argv: list,
  arguments: list,
  pkgs: list,
  packages: list
})

const createString = (tmpl, list) =>
  format(tmpl, createContext(list.join(' ')))

const createArgv = (tmpl, list) =>
  createString(tmpl, list).split(/\s+/)

module.exports = Object.assign(createArgv, {
  createContext,
  createString,
  createArgv
})
