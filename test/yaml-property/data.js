module.exports = require('js-yaml').safeLoad(
  require('fs').readFileSync(
    require('path').resolve(__dirname, 'data.yaml'),
    'utf8'
  )
)
