const gulp = require('gulp')
const path = require('path')
const rimraf = require('rimraf')

// 把 2个流 合并为 1个流
const merge2 = require('merge2')

// 把 ts 编译 为 js
const ts = require('gulp-typescript')

// 把 es6 编译 为 es5
const babel = require('gulp-babel')

// 配置文件
const tsConfig = require('./tsconfig.json')
const babelConfig = require('./babel.config.js')

// 要编译的目录
// glob文件匹配模式，!开头的表示排除
const source = [
  'components/**/*.{js,ts,jsx,tsx}',
  '!components/**/*.stories.{js,ts,jsx,tsx}',
  '!components/**/e2e/*',
  '!components/**/unit/*'
]

// 准备路径
const base = path.join(process.cwd(), 'components')

function getProjectPath(filePath) {
  return path.join(process.cwd(), filePath)
}

const libDir = getProjectPath('lib') // 放置 es5
const esDir = getProjectPath('es') // 放置 es6

/**
 *
 * 执行编译逻辑
 * @param {*} module 是否转为 es5
 */
function compile(module = true) {
  const targetDir = module ? libDir : esDir

  // 1. 先删除老目录
  rimraf.sync(targetDir)

  // 2. gulp按照文件匹配模式，把文件匹配出来
  let source = gulp.src(source, { base })

  // 3. ts 转为 js，会得到两个流，js流 和 声明文件dts流
  const { jsStream, dtsStream } = source.pipe(ts(tsConfig))

  // 4. dts声明文件写到目录
  dtsStream.pipe(gulp.dest(targetDir))

  // 5. 转为 es5
  if (module) {
    jsStream = jsStream.pipe(babel(babelConfig))
  }

  jsStream.pipe(gulp.dest(targetDir))

  // 6. 合并流
  return merge2([jsStream, dtsStream])
}

// 定义gulp任务
gulp.task('compile-with-es', (done) => {
  console.log('compile to es')
  // 监听 流 的 finish
  compile(false).on('finish', done)
})

gulp.task('compile-with-lib', (done) => {
  console.log('compile to lib')
  // 监听 流 的 finish
  compile().on('finish', done)
})

// 并行 gulp 任务
gulp.task('compile', gulp.parallel('compile-with-es', 'compile-with-lib'))
