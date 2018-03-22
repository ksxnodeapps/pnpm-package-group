'use strict'

const fetchTree = async yamlPaths => yamlPaths.length
  ? require('../object-utils').merge(...yamlPaths.map(require('../yaml-property')))
  : require('js-yaml').safeLoad(await require('get-stdin')())

const fetchList = async yamlPaths =>
  require('../tree-to-list')(await fetchTree(yamlPaths))

module.exports = {
  fetchTree,
  fetchList
}
