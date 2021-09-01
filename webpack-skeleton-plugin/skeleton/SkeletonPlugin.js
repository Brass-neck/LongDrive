const PLUGIN_NAME = 'SkeletonPlugin'
const { resolve } = require('path')
const { readFileSync, writeFileSync } = require('fs')

const Server = require('./Server.js')
const Skeleton = require('./Skeleton.js')

class SkeletonPlugin {
  constructor(options) {
    // params: staticDir port origin
    this.options = options
  }
  // compiler代表webpack的编译对象
  apply(compiler) {
    // compiler身上有很多钩子
    // 可以通过tap来注册钩子函数的监听函数
    // 当这个钩子触发的时候，会调用我们注册的监听函数

    // done钩子，代表打包完成，dist目录下生成了文件
    compiler.hooks.done.tap(PLUGIN_NAME, async () => {
      //启动一个http服务器，预览dist网页
      await this.startServer()

      // 生成骨架屏内容
      this.skeleton = new Skeleton(this.options)
      await this.skeleton.initialize() // 启动一个无头浏览器
      const skeletonHTML = await this.skeleton.genHTML(this.options.origin) // 生成骨架屏html css

      // 读出dist/index的内容，把<!-- shell -->替换成骨架屏内容
      const originPath = resolve(this.options.staticDir, 'index.html')
      const originContent = await readFileSync(originPath, 'utf8')
      const finalContent = originContent.replace('<!-- shell -->', skeletonHTML)
      const finalPath = resolve(this.options.staticDir, 'skeleton.html')
      await writeFileSync(finalPath, skeletonHTML)

      // await this.skeleton.destory() // 销毁无头浏览器

      // 完成后，关闭服务
      // await this.server.close()
    })
  }

  async startServer() {
    this.server = new Server(this.options)
    await this.server.listen()
  }
}

module.exports = SkeletonPlugin
