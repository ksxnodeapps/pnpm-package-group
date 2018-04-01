'use strict'
const path = require('path')
const fs = require('fs')
const process = require('process')
const {spawnSync} = require('child_process')
const fsForce = require('fs-force')
const {envMod} = require('../lib.dev/path-env')
const objUtils = require('../lib/object-utils')
const executable = require.resolve('../index.js')

const env = (() => {
  const orgEnv = envMod()
    .surround(path.resolve(__dirname, 'virtual-env/bin'))
    .get()

  // Eliminate PNPM_PKG_GROUP environment variables
  const env = objUtils.filterEntries(
    orgEnv,
    ([key]) =>
      !/^PNPM_PKG_GROUP/.test(key)
  )

  return env
})()

const mayTest = (() => {
  const {
    INTEGRATION_TEST_EXCEPT = '',
    INTEGRATION_TEST_ONLY = ''
  } = env

  const ignoredTestCases = INTEGRATION_TEST_EXCEPT.split(/\s+/).filter(Boolean)
  const exclusiveTestCases = INTEGRATION_TEST_ONLY.split(/\s+/).filter(Boolean)

  const isIgnored = ignoredTestCases.length
    ? classes => classes.some(x => ignoredTestCases.includes(x))
    : () => false

  const isExclusive = exclusiveTestCases.length
    ? classes => classes.some(x => exclusiveTestCases.includes(x))
    : () => true

  const mayTest = (desc = '', fn = () => {}, classes = []) => {
    if (isIgnored(classes)) return test.skip(desc, fn)
    if (!isExclusive(classes)) return test.skip(desc, fn)
    return test(desc, fn)
  }

  return mayTest
})()

const trackSpawnSnap = (argv = [], options = {}) => () => {
  const fmtstr = string =>
    string ? `\n\n${string}\n` : '(EMPTY STRING)'

  const {status, error, signal, stdout, stderr} = spawnSync(
    executable,
    argv,
    {
      encoding: 'utf8',
      env,
      ...options
    }
  )

  expect({
    argv,
    status,
    error,
    signal,
    stdout: fmtstr(stdout),
    stderr: fmtstr(stderr)
  }).toMatchSnapshot()
}

const realpath = name =>
  path.resolve(__dirname, name)

const filetext = name =>
  fs.readFileSync(realpath(name), 'utf8')

describe('program', () => {
  const workingDirectory = path.resolve(__dirname, 'virtual-env/working-directory')
  fsForce.deleteSync(workingDirectory)
  fsForce.mkdirSync(workingDirectory)
  process.chdir(workingDirectory)

  if (env.SKIP_INTEGRATION_TEST === 'true') {
    test.only('Skipped', () => {})
  }

  mayTest(
    '--help',
    trackSpawnSnap(['--help']),
    ['help', 'basic']
  )

  mayTest(
    'being invoked with neither arguments nor stdin ',
    trackSpawnSnap(),
    ['no-input', 'basic', 'invalid']
  )

  describe('being invoked with stdin', () => {
    const mkopt = file => ({
      input: filetext(file)
    })

    const mkfn = file =>
      trackSpawnSnap([], mkopt(file))

    mayTest(
      'which contain valid syntax and schema',
      mkfn('input/valid.yaml'),
      ['stdin', 'valid', 'basic']
    )

    mayTest(
      'which contain valid syntax but invalid schema',
      mkfn('input/invalid-schema.yaml'),
      ['stdin', 'invalid', 'schema', 'basic']
    )

    mayTest(
      'which contain invalid syntax',
      mkfn('input/invalid-syntax.txt'),
      ['stdin', 'invalid', 'syntax', 'basic']
    )
  })

  describe('being invoked with paths', () => {
    const fn = (xpath = [], classes = []) => describe(xpath.join(' '), () => {
      const runTest = (desc = '', fn = () => {}, extraClasses = []) =>
        mayTest(desc, fn, [...classes, ...extraClasses])

      runTest(
        'without options',
        trackSpawnSnap(xpath),
        ['no-options', 'basic']
      )

      runTest(
        '--pnpm=alt-pnpm',
        trackSpawnSnap(['--pnpm=alt-pnpm', ...xpath]),
        ['alt-pnpm', 'specified-alt-pnpm']
      )

      runTest(
        '--local=explicitly-specified-target',
        trackSpawnSnap(['--local=explicitly-specified-target', ...xpath]),
        ['local', 'specified-local']
      )

      runTest(
        '--packages-location=top/middle/bottom --local=explicitly-specified-pkgloc',
        trackSpawnSnap([
          '--packages-location=top/middle/bottom',
          '--local=explicitly-specified-pkgloc'
        ]),
        ['pkgloc', 'specified-pkgloc']
      )

      runTest(
        '--latest',
        trackSpawnSnap(['--latest'], ...xpath),
        ['latest', 'enable-latest']
      )

      runTest(
        '--quiet',
        trackSpawnSnap(['--quiet'], ...xpath),
        ['quiet', 'enable-quiet']
      )

      runTest(
        '--quiet-pnpm',
        trackSpawnSnap(['--quiet-pnpm'], ...xpath),
        ['quiet-pnpm', 'enable-quiet-pnpm']
      )

      runTest(
        '--quiet-step',
        trackSpawnSnap(['--quiet-step'], ...xpath),
        ['quiet-step', 'enable-quiet-step']
      )
    })

    fn(['../../input/valid.yaml'], ['one-file', 'valid'])
    fn(['../../input/invalid-schema.yaml'], ['one-file', 'invalid', 'schema'])
    fn(['../../input/invalid-syntax.txt'], ['one-file', 'invalid', 'syntax'])

    fn(['../../input/valid.yaml', '../../input/invalid-schema.yaml'], ['mix', 'invalid'])
    fn(['../../input/valid.yaml', '../../input/invalid-syntax.txt'], ['mix', 'invalid'])
    fn(['../../input/invalid-schema.yaml', '../../input/invalid-syntax.txt'], ['mix', 'invalid'])
    fn(['../../input/valid.yaml', '../../input/invalid-schema.yaml', '../../input/invalid-syntax.txt'], ['mix', 'invalid'])

    fn(['../../input/valid.yaml/Nested'], ['selective', 'valid'])
    fn(['../../input/valid.yaml/Flat'], ['selective', 'valid'])
    fn(['../../input/valid.yaml/Global'], ['selective', 'valid'])
    fn(['../../input/valid.yaml/DividedFlat'], ['selective', 'valid'])
    fn(['../../input/valid.yaml/SelectiveNested'], ['selective', 'valid'])

    fn(['../../input/valid.yaml/Nested/c'], ['selective', 'valid'])
    fn(['../../input/valid.yaml/Flat/i/l'], ['selective', 'valid'])
    fn(['../../input/valid.yaml/Global/i/l/p'], ['selective', 'valid'])
  })
})
