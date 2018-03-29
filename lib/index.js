'use strict'
const path = require('path')
const {spawnSync} = require('child_process')
const fs = require('fs')
const process = require('process')
const ramda = require('ramda')
const {_: yamlPaths, ...argvOpts} = require('./arguments').argv
const {exit} = require('./exit-status-names')
const {fetchList} = require('./input')
const constants = require('./constants')
const createArgv = require('./command-template')
const stdio = argvOpts.quiet || argvOpts.quietPnpm ? undefined : 'inherit'
const stepInfo = argvOpts.quiet || argvOpts.quietStep ? () => {} : info

fetchList(yamlPaths)
  .catch(error => exit.withMessage('schema', error.message))
  .then(main)

function main (list) {
  const [
    [{data: globalPackages}],
    localList
  ] = ramda.partition(x => x.path === constants.globalPath, list)

  let globalExitStatus, localExitStatus
  stepInfo('BEGIN')

  if (globalPackages.length) {
    stepInfo('BEGIN GLOBAL')
    globalExitStatus = installGlobalPackages(globalPackages)
    stepInfo('END GLOBAL')
  } else {
    stepInfo('No global packages. Skipping.')
  }

  if (localList.length) {
    stepInfo('BEGIN LOCAL')
    localExitStatus = installLocalPackages(localList)
    stepInfo('END LOCAL')
  } else {
    stepInfo('No local packages. Skipping.')
  }

  const finalExitStatus = (globalExitStatus << 2) | (localExitStatus << 4)
  stepInfo('Status', {global: globalExitStatus, local: localExitStatus, final: finalExitStatus})
  stepInfo('END')
  return process.exit(finalExitStatus)
}

function installGlobalPackages (packages) {
  stepInfo('Installing global packages')
  stepInfo('Packages: ' + packages.join(', '))

  return spawnPnpm(
    createArgv(argvOpts.globalSyntax, packages)
  ).status
}

function installLocalPackages (list) {
  const {writeFileSync} = require('fs-force')
  const pkgjson = require('./package-json-template').json
  const targetDirectory = path.resolve(process.cwd(), argvOpts.local)
  let finalExitStatus = 0
  let total = 0
  let success = 0
  let failure = 0
  stepInfo('Installing local packages')

  for (const item of list) {
    const container = path.resolve(targetDirectory, item.path, argvOpts.packagesLocation)
    const pkgjsonfile = path.resolve(container, 'package.json')
    stepInfo('Location: ' + item.path)
    stepInfo('Packages: ' + item.data.join(', '))
    ++total

    if (!fs.existsSync(pkgjsonfile)) {
      try {
        writeFileSync(pkgjsonfile, pkgjson)
      } catch (error) {
        ++failure
        console.error(error)
        continue
      }
    }

    const cmdArgv = createArgv(argvOpts.localSyntax, item.data)
    const {status} = spawnPnpm(cmdArgv, {cwd: container})

    finalExitStatus += status
    if (status) {
      ++failure
    } else {
      ++success
    }
  }

  stepInfo('Steps', {total, success, failure})
  stepInfo('Status', {finalExitStatus})
  return finalExitStatus
}

function spawnPnpm (cmdArgv, options = {}) {
  const result = spawnSync(argvOpts.pnpm, cmdArgv, {stdio, shell: argvOpts.shell, ...options})
  const {status, signal, error} = result
  stepInfo('Step Result', {status, signal, error})
  return result
}

function info (...args) {
  console.info('[INFO]', ...args)
}
