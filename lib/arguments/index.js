'use strict'
const {usage, example, options, env} = require('./data')

module.exports = (function create (yargs, current, ...next) {
  return current
    ? create(yargs.example(current.cmd, current.desc), ...next)
    : yargs
})(
  require('yargs').usage(usage).options(options).env(env),
  ...example
).help()
