'use strict'

const concatReducer = (prev, current) =>
  [...prev, ...current]

module.exports = {
  concatReducer
}
