const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const terserPlugin = require('terser-webpack-plugin')
const optimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const htmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin')

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'
// 用于配置别名
const bootstrap = path.resolve('node_modules/bootstrap/dist/css/bootstrap.css')

module.exports = ({ development, production }) => {
  const isDev = development === 'development'
  const isProduction = production === 'production'
  const getStyleLoaders = (cssOptions) => {
    const loaders = [
      isDev && require.resolve('style-loader'),
      isProduction && miniCssExtractPlugin.loader,
      {
        loader: require.resolve('css-loader'),
        options: cssOptions
      },
      'postcss-loader'
    ].filter(Boolean)
    return loaders
  }

  return {
    mode: isProduction ? 'production' : isDev ? 'development' : 'development',
    devtool: isProduction
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : isDev && 'cheap-module-spirce-map',

    // webpack5的持久缓存，提升编译速度
    cache: { type: 'filesystem' },
    entry: {
      main: './src/index.js'
    },
    optimization: {
      // 生产环境启用压缩
      minimize: isProduction,
      // terserPlugin parallel 多进程压缩es6
      // optimizeCssAssetsPlugin 压缩css
      minimizer: [new terserPlugin({ parallel: true }), new optimizeCssAssetsPlugin()],
      splitChunks: {
        chunks: 'all',
        minSize: 0,
        minChunks: 3 /**最小引入次数，被引入3次就抽离出来 */,
        enforceSizeThreshold: 50000 /** w5新增，强制打包阈值，当一个包体积到达50k，就强制抽离，无视其他配置 */
      },
      moduleIds: isProduction ? 'deterministic' : 'named',
      chunkIds: isProduction ? 'deterministic' : 'named'
    },
    resolve: {
      // 配置模块的查找范围
      modules: [path.resolve('node_modules')],
      //表示在import 文件时文件后缀名可以不写
      extensions: ['.js', '.jsx'],
      alias: {
        //表示设置路径别名这样在import的文件在src下的时候可以直接 @/component/...
        '@': path.join(__dirname, './src'),
        // 这里的bootstrap是上面定义的css文件
        bootstrap
      },
      // 关闭 node 核心模块的引入
      fallback: {
        crypto: false,
        buffer: false,
        stream: false
      }
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                presets: ['@babel/preset-react'],
                plugins: ['@babel/plugin-proposal-class-properties']
              }
            }
          ],
          include: path.resolve('src'),
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: getStyleLoaders({ importLoaders: 1 })
        }
      ]
    },
    devServer: {},
    plugins: [
      new htmlWebpackPlugin(
        Object.assign(
          {},
          { inject: true, template: './public/index.html' },
          isProduction
            ? {
                minify: {
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true
                }
              }
            : {}
        )
      ),
      new htmlWebpackExternalsPlugin({
        externals: [
          {
            module: 'lodash',
            entry: 'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.20/lodash.js',
            global: '_'
          }
        ]
      })
    ]
  }
}
