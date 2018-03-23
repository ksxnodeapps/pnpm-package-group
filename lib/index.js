'use strict'
const path = require('path')
const {spawnSync} = require('child_process')
const process = require('process')
const {_: yamlPaths, ...argvOpts} = require('./arguments').argv
const {exit} = require('./exit-status-names')
const {fetchList} = require('./input')

const targetDirectory = path.resolve(process.cwd(), argvOpts.local)
const stdio = argvOpts.quietPnpm ? undefined : 'inherit'

fetchList(yamlPaths)
  .catch(error => exit.withMessage('schema', error.message))
  .then(main)

function main (list) {
  const pnpm = spawnSync('which', ['pnpm']).stdout.toString().trim()
  console.log({list, pnpm})
}
