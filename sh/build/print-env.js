'use strict'

const {
  SKIP_INTEGRATION_TEST = null,
  INTEGRATION_TEST_EXCEPT = null,
  INTEGRATION_TEST_ONLY = null
} = require('process').env

const {safeDump} = require('js-yaml')

console.info(safeDump({
  'Important Environment Variables': {
    'Integration Test': {
      SKIP_INTEGRATION_TEST,
      INTEGRATION_TEST_EXCEPT,
      INTEGRATION_TEST_ONLY
    }
  }
}))
