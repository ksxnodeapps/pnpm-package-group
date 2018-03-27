'use strict'
const path = require('path')
const {spawnSync} = require('child_process')
const process = require('process')
const ramda = require('ramda')
const {_: yamlPaths, ...argvOpts} = require('./arguments').argv
const {exit} = require('./exit-status-names')
const {fetchList} = require('./input')
const constants = require('./constants')
const createArgv = require('./command-template')

const targetDirectory = path.resolve(process.cwd(), argvOpts.local)
const stdio = argvOpts.quietPnpm ? undefined : 'inherit'

fetchList(yamlPaths)
  .catch(error => exit.withMessage('schema', error.message))
  .then(main)

function main (list) {
  const [
    [{data: globalPackages}],
    localList
  ] = ramda.partition(x => x.path === constants.globalPath, list)

  let finalExitStatus = 0

  if (globalPackages.length) {
    finalExitStatus |= installGlobalPackages(globalPackages) << 2
  } else {
    info('No global packages. Skipping.')
  }

  if (localList.length) {
    finalExitStatus |= installLocalPackages(localList)
  } else {
    info('No local packages. Skipping.')
  }

  return process.exit(finalExitStatus)
}

function installGlobalPackages (packages) {
  return spawnPnpm(
    createArgv(argvOpts.globalSyntax, packages)
  ).status
}

function installLocalPackages (list) {
  console.log('LOCAL', list)
  return 0
}

function spawnPnpm (cmdArgv) {
  return spawnSync(argvOpts.pnpm, cmdArgv, {stdio, shell: argvOpts.shell})
}

function info (...args) {
  console.info('[INFO]', ...args)
}
