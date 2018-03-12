'use strict'
const main = require('../../lib/exit-status-names')

describe('main module', () => {
  it('should stay unchanged', () => {
    expect(main).toMatchSnapshot()
  })
})
