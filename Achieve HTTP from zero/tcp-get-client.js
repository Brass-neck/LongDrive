/**
 *
 * 学习获取专业权威的一手知识
 * 学习阅读RFC标准文档
 *
 */

const http = require('http') // 这是应用层协议，依赖net模块实现的

// xml的使用
let xhr = new XMLHttpRequest()
xhr.open('get', 'http://localhost:8080/get')
xhr.onreadystatechange = function () {
  if (xhr.readystate == 4 && xhr.status == 200) {
  }
}
xhr.setRequestHeader('自定义头', 'hello')
xhr.send()

/****** 实现XMLHttpRequest *******/

/**
 * 步骤总结：
 * 1、基于node的内置net模块实现
 * 2、定义状态码
 * 3、class XMLHttpRequest constructor中初始化readyState状态、headers对象
 * 4、open(method, url)方法中拼接response响应头和响应体
    获取到host、port、path后，通过net.createConnection创建连接；
    在成功回调中，监听服务端发来的消息；
    on('data', (data) => {data.split('\r\n')分割并拼接,得到status、statusText、
    response、responseHeaders等})；
    如果有的话，调用onload方法
  *
  * 5、setRequestHeader方法
  * 6、send(params)方法中拼接request请求头
 */

const net = require('net') // 传输层协议
const Url = require('url')

const ReadyState = {
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4
}

class XMLHttpRequest {
  constructor() {
    this.readyState = ReadyState.UNSENT
    this.headers = {
      Connection: 'keep-alive'
    }
  }

  open(method = 'GET', url) {
    this.method = method
    this.url = url
    // 127.0.0.1 , 8080, path=/get
    let { hostname, port, path } = Url.parse(url)
    this.headers['Host'] = `${hostname}:${port}`
    // 创建一个到端口 port 和 主机 host的 TCP 连接。 host 默认为 'localhost'
    const socket = (this.socket = net.createConnection(
      {
        hostname,
        port
      },
      () => {
        socket.on('data', (data) => {
          data = data.toString()

          // 处理响应
          /**
           *  HTTP/1.1 200 OK \r\n
              Content-Type: text/plain \r\n
              Date: Sat, 15 Aug 2021 \r\n
              Connection: keep-alive \r\n
              Transfer-Encoding: chunked \r\n
              \r\n(下面是响应体)
              3
              get
              0
           */

          // 分割 响应头和响应体
          let [response, bodyRows] = data.split('\r\n\r\n')
          let [statusLine, ...headerRows] = response.split('\r\n')

          // HTTP/1.1 200 OK  取得 status和statusText，第一个HTTP/1.1不要
          let [, status, statusText] = statusLine.split(' ')
          this.status = status
          this.statusText = statusText

          // 分解headerRows，组装成responseHeaders
          this.responseHeaders = headerRows.reduce((memo, row) => {
            let [key, val] = row.split(': ')
            memo[key] = val
            return memo
          }, {})

          // 状态更新
          this.readyState = ReadyState.HEADERS_RECEIVED
          this.onreadystatechange && this.onreadystatechange()

          // 处理响应体
          let [, body] = bodyRows.split('\r\n')
          // 状态更新
          this.readyState = ReadyState.LOADING
          this.onreadystatechange && this.onreadystatechange()
          this.response = this.responseText = body

          // 状态更新
          this.readyState = ReadyState.DONE
          this.onreadystatechange && this.onreadystatechange()

          this.onload && this.onload()
        })
      }
    ))

    // 状态更新
    this.readyState = ReadyState.OPENED
    this.onreadystatechange && this.onreadystatechange()
  }

  setRequestHeader(header, value) {
    this.headers[header] = value
  }

  // 拼接请求头
  /**
    	GET /get HTTP/1.1
     	Host: 127.0.0.1:8080
      Connection: keep-alive
      自定义头: hello
    */
  send(params) {
    let rows = []
    rows.push(`${this.method} ${this.url} HTTP/1.1`)
    rows.push(...Object.keys(this.headers).map((key) => `${key}: ${this.headers[key]}`))
    let request = rows.join('/r/n') + '\r\n\r\n'
    this.socket.write(request)
  }
}
