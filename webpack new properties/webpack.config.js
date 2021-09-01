const path = require('path')
const HtmlWebapckPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: false,
  /**
   * w5 新特性 cache 持久化缓存
   *
   * type: 默认memory，内存中；可配置filesystem，形成硬盘中的文件
   * cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/webpack') 这是默认路径
   *
   * 注意：
   * cnpm安装的依赖，配置filesystem会卡死，打包不出来
   * 原因：
   * w5 约定包名必须以 @ 开头
   * cnpm下载的包名为 _@ 开头
   * 产生冲突
   *
   */
  cache: {
    type: 'filesystem'
  },

  // 开启实时增量编译
  // watch: true,

  /**
   * entry 语法糖
   * 实际上是 entry: { main: './src/index.js' }
   * main就是这个chunk代码块的名称
   */
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),

    // filename是  入口代码块  文件名的生成规则
    filename: '[name].js', // 默认值就是[name].js，name取的就是entry中chunk代码块的名字

    // chunkFilename是  非入口代码块  文件名的生成规则
    // 比如 动态加载的chunk、commonSplit分割的chunk、第三方chunk等等
    // 取的规则是根据 optimization.moduleIds和optimization.chunkIds
    chunkFilename: '[name].js'
  },

  /**
   * natural	按引用顺序的数字id  例如 1 2 3 4 5
   * deterministic	根据模块名称生成的简短hash值，只要引用的文件名不变，就不变
   * named  包含文件路径的名称 例如 src_A
   *
   * deterministic有助于生成长期缓存
   */
  optimization: {
    // 模块名称的生成规则
    moduleIds: 'natural',

    // 代码块名称的生成规则
    chunkIds: 'natural'
  },

  /**
   * 手动配置polyfill
   */
  resolve: {
    fallback: {
      stream: require.resolve('stream-browserify/')
    }
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
      },
      /**
       * 资源模块
       * 内置处理各种格式的资源文件，无需额外的loader
       *
       */
      {
        test: /\.png$/,
        type: 'asset/resource' // 对标之前的file-loader
      },
      {
        test: /\.ico$/,
        type: 'asset/inline' // 对标之前的url-loader，limit比较小的，转为base64字符串
      },
      {
        test: /\.txt$/,
        type: 'asset/source' // 对标之前的raw-loader，以utf8格式加载文件原始内容
      },
      {
        test: /\.jpg$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024
          }
        }
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist')
  },
  plugins: [new HtmlWebapckPlugin({ template: './src/index.html' })]
}
