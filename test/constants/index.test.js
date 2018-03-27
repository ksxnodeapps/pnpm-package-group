'use strict'

describe('subject', () => {
  it('stays unchanged', () => {
    expect(
      require('../../lib/constants')
    ).toMatchSnapshot()
  })
})
