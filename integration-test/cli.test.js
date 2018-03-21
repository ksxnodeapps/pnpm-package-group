'use strict'
const execa = require('execa')
const executable = require.resolve('../index.js')

const trackSpawnSnap = (argv = [], options) => () => {
  const {code: status, stdout, stderr} = execa.sync(executable, argv, options)
  expect({status, stdout, stderr}).toMatchSnapshot()
}

describe('program', () => {
  it('being invoked without arguments', trackSpawnSnap())
  it('--help', trackSpawnSnap(['--help']))
})
