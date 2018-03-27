'use strict'
const path = require('path')
const fs = require('fs')
const process = require('process')
const {spawnSync} = require('child_process')
const {envMod} = require('../lib/path-env')
const executable = require.resolve('../index.js')

const env = envMod()
  .surround(path.resolve(__dirname, 'virtual-env/bin'))
  .get()

const trackSpawnSnap = (argv = [], options = {}) => () => {
  const {status, stdout, stderr} = spawnSync(executable, argv, {encoding: 'utf8', env, ...options})
  expect({status, stdout, stderr}).toMatchSnapshot()
}

const realpath = name =>
  path.resolve(__dirname, name)

const filetext = name =>
  fs.readFileSync(realpath(name), 'utf8')

describe('program', () => {
  process.chdir(__dirname)
  it('--help', trackSpawnSnap(['--help']))
  it('being invoked with neither arguments nor stdin ', trackSpawnSnap())

  describe('being invoked with stdin', () => {
    const mkopt = file => ({
      input: filetext(file)
    })

    const mkfn = file =>
      trackSpawnSnap([], mkopt(file))

    it('which contain valid syntax and schema', mkfn('input/valid.yaml'))
    it('which contain valid syntax but invalid schema', mkfn('input/invalid-schema.yaml'))
    it('which contain invalid syntax', mkfn('input/invalid-syntax.txt'))
  })

  describe('being invoked with paths', () => {
    const fn = (...xpath) => describe(xpath.join(' '), () => {
      it('without options', trackSpawnSnap(xpath))

      it(
        '--local=virtual-env/target',
        trackSpawnSnap(['--local=virtual-env/target', ...xpath])
      )
    })

    fn('input/valid.yaml')
    fn('input/invalid-schema.yaml')
    fn('input/invalid-syntax.txt')

    fn('input/valid.yaml', 'input/invalid-schema.yaml')
    fn('input/valid.yaml', 'input/invalid-syntax.txt')
    fn('input/invalid-schema.yaml', 'input/invalid-syntax.txt')
    fn('input/valid.yaml', 'input/invalid-schema.yaml', 'input/invalid-syntax.txt')

    fn('input/valid.yaml/Nested')
    fn('input/valid.yaml/Flat')
    fn('input/valid.yaml/Global')
    fn('input/valid.yaml/DividedFlat')
    fn('input/valid.yaml/SelectiveNested')

    fn('input/valid.yaml/Nested/c')
    fn('input/valid.yaml/Flat/i/l')
    fn('input/valid.yaml/Global/i/l/p')
  })
})
