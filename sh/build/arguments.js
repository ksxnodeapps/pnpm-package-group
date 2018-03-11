'use strict'
const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const dir = path.resolve(__dirname, '../../lib/arguments')
const input = fs.readFileSync(path.resolve(dir, 'data.yaml'), 'utf8')
const output = JSON.stringify(yaml.safeLoad(input))
fs.writeFileSync(path.resolve(dir, 'data.json'), output)
