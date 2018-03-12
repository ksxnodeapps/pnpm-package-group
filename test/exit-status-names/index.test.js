'use strict'
const main = require('../../lib/exit-status-names')

describe('main module', () => {
  it('stays the same', () => {
    expect(main).toMatchSnapshot()
  })
})
