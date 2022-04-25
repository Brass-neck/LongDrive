const loaderUtils = require('loader-utils')

module.exports = function (source, map, meta) {
  // 获取在 webpack.config.js 中 use rule 的 传参
  const options = loaderUtils.getOptions(this)
  console.log('options', options)

  let reg = /\/\/(\s?)todo/g
  reg.test(source) ? this.emitWarning(this.resourcePath + '没做完') : ''
  return source

  // source = source.replace(reg, '没做完')
  // this.callback(null, source, map)
  // return source

  // console.log('resource', this.resource) // 文件路径带 query
  // console.log('query', this.query) // 对应配置中的 options {a: 1}
  // console.log('resourcePath', this.resourcePath) // 文件路径
  // this.emitFile('main.json', JSON.stringify({ hello: 'world' })) // dist目录下生成一个 json 文件
  // this.emitWarning('这个 loader 啥都不干') // 会触发一个警告⚠️
  // this.emitError('这个 loader 啥都不干')// 会导致本次编译过程失败
  // return source
}
