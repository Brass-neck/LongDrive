const path = require('path')

module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),

    // filename是  入口代码块  文件名的生成规则
    filename: '[name].js' // 默认值就是[name].js，name取的就是entry中chunk代码块的名字

    // chunkFilename是  非入口代码块  文件名的生成规则
    // 比如 动态加载的chunk、commonSplit分割的chunk、第三方chunk等等
    // 取的规则是根据 optimization.moduleIds和optimization.chunkIds
    // chunkFilename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: path.resolve(__dirname, 'src/loaders/todo-loader'),
            // 这里可以传参，在 loader 中可以使用 loaderUtils.getOptions 获取
            options: { a: 1 }
          }
        ]
      }
    ]
  },
  externals: {
    lodash: 'commonjs2 lodash'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist')
  }
}
