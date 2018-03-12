'use strict'
const main = require('../../lib/exit-status-names')

describe('main module', () => {
  it('should stays unchanged', () => {
    expect(main).toMatchSnapshot()
  })
})
