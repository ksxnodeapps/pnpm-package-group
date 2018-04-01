'use strict'

const getObjectGetter = preservePropertyPath => {
  const getYamlProperty = require('../yaml-property')
  return preservePropertyPath ? getYamlProperty.preservePropertyPath : getYamlProperty
}

const fetchTree = async (yamlPaths, {preservePropertyPath = false}) => yamlPaths.length
  ? require('../object-utils').merge(...yamlPaths.map(getObjectGetter(preservePropertyPath)))
  : require('js-yaml').safeLoad(await require('get-stdin')())

const fetchList = async (yamlPaths, options) =>
  require('../tree-to-list')(await fetchTree(yamlPaths, options))

module.exports = {
  fetchTree,
  fetchList
}
