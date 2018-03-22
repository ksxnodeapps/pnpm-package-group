'use strict'
const {spawnSync} = require('child_process')
const executable = require.resolve('../index.js')

const trackSpawnSnap = (argv = [], options) => () => {
  const {status, stdout, stderr} = spawnSync(executable, argv, options)
  expect({status, stdout: String(stdout), stderr: String(stderr)}).toMatchSnapshot()
}

describe('program', () => {
  it('being invoked without arguments', trackSpawnSnap())
  it('--help', trackSpawnSnap(['--help']))
})
