const { Configuration } = require('webpack')

/**
 * @type {Configuration}
 */
const config = {
  mode: 'none', // 可以看到未压缩源码
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    library: 'wujie',
    libraryTarget: 'umd',
    libraryExport: 'default',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        // use: ['babel-loader', 'ts-loader'] // 从右到左执行,先用ts-loader转换成js,再用babel-loader转换成es5
        use: 'swc-loader'
      }
    ]
  }
}

module.exports = config
