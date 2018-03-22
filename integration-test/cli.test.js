'use strict'
const path = require('path')
const fs = require('fs')
const {spawnSync} = require('child_process')
const {envMod} = require('../lib/path-env')
const executable = require.resolve('../index.js')

const trackSpawnSnap = (argv = [], options) => () => {
  const {status, stdout, stderr} = spawnSync(executable, argv, options)
  expect({status, stdout: String(stdout), stderr: String(stderr)}).toMatchSnapshot()
}

const env = envMod()
  .surround(path.resolve(__dirname, 'virtual-env/bin'))
  .get()

const filetext = name =>
  fs.readFileSync(path.resolve(__dirname, name), 'utf8')

describe('program', () => {
  it('--help', trackSpawnSnap(['--help']))
  it('being invoked with neither arguments nor stdin ', trackSpawnSnap())

  describe('being invoked with stdin', () => {
    const mkopt = file => ({
      input: filetext(file),
      env
    })

    const mkfn = file =>
      trackSpawnSnap([], mkopt(file))

    it('which contain valid syntax and schema', mkfn('input/valid.yaml'))
    it('which contain valid syntax but invalid schema', mkfn('input/invalid-schema.yaml'))
    it('which contain invalid syntax', mkfn('input/invalid-syntax.txt'))
  })
})
