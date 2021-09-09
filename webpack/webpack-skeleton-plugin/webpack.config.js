const path = require('path')
const HtmlWebapckPlugin = require('html-webpack-plugin')

// 引用自己写的插件
const { SkeletonPlugin } = require('./skeleton')

module.exports = {
  mode: 'development',
  /**
   *
   * devtool: false
   * 不生成source-map
   * 项目在浏览器F12中调试的时候不友好，无法看到清晰的源码
   *
   * --------------------------------------
   *
   * devtool: 'eval-source-map'
   * 会生成source-map 供浏览器展示
   * 不会生成独立的source-map文件，而是直接将信息写到打包的源文件bundle.js里
   *
   * 使用eval打包源文件模块，直接在源文件中写入干净完整的source-map
   * 不影响构建速度，但影响执行速度和安全，建议开发环境中使用，生产阶段不要使用
   *
   * --------------------------------------
   *
   * devtool: 'source-map'
   * 会生成source-map 供浏览器展示
   * 会生成独立的source-map文件bundle.js.map，新的bundle.js中会加一行特殊语法的注释
   * //# sourceMappingURL=bundle.js.map
   * 这行注释用于浏览器解析，并去加载这个source-map文件，完成源文件的映射工作
   *
   * 功能最完全，但会减慢打包速度
   *
   * --------------------------------------
   *
   * devtool: 'cheap-module-source-map'
   * 无法对应到具体的列
   *
   */
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  devServer: {
    // devserver服务器，以dist为静态文件根目录
    contentBase: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebapckPlugin({ template: './src/index.html' }),
    new SkeletonPlugin({
      staticDir: path.resolve(__dirname, 'dist'),
      // 启动一个静态文件服务器，去预览dist下的项目
      port: 8000,
      origin: 'http://localhost:8000',
      device: 'iPhone 6',
      defer: 1000,
      // 可以配置骨架屏元素的样式
      button: {
        color: '#EFEFEF'
      },
      image: {
        color: '#EFEFEF'
      },
      p: {
        color: '#EFEFEF'
      }
    })
  ]
}
