'use strict'
const object = require('./data')
const json = JSON.stringify(object, undefined, 2)
module.exports = {object, json}
