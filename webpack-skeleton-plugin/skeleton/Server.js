const express = require('express')
const http = require('http')

class Server {
  constructor(options) {
    this.options = options
  }

  async listen() {
    const app = (this.app = express())
    // 配置静态文件目录
    app.use(express.static(this.options.staticDir))

    this.httpServer = http.createServer(app)
    return new Promise((resolve) => {
      this.httpServer.listen(this.options.port, () => {
        console.log('服务器启动成功')
        resolve()
      })
    })
  }

  async close() {
    return new Promise((resolve) => {
      this.httpServer.close(this.options.port, () => {
        console.log('服务器关闭成功')
        resolve()
      })
    })
  }
}

module.exports = Server
