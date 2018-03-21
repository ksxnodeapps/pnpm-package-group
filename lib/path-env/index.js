'use strict'
const path = require('path')

const split = string => String(string).split(path.delimiter)

const join = array => Array.from(array).join(path.delimiter)

const pathString = (string = require('process').env.PATH) => {
  const array = split(string)

  return {
    string,
    array,
    append: (...addend) => pathArray(array.concat(addend)),
    prepend: (...addend) => pathArray(addend.concat(array)),
    surround: (...addend) => pathArray(addend.concat(array).concat(addend)),
    toString: () => string
  }
}

const pathArray = array => pathString(join(array))

const envMod = (env = require('process').env, name = 'PATH') => {
  const pathVar = name in env ? env[name] : ''
  const pathMod = pathString(pathVar)
  const alter = pathMod => envMod({...env, PATH: pathMod.toString()}, name)

  return {
    env,
    name,
    pathVar,
    pathMod,
    alter,
    append: (...addend) => alter(pathMod.append(...addend)),
    prepend: (...addend) => alter(pathMod.prepend(...addend)),
    surround: (...addend) => alter(pathMod.surround(...addend)),
    get: () => env
  }
}

module.exports = {
  split,
  join,
  pathString,
  pathArray,
  envMod
}
