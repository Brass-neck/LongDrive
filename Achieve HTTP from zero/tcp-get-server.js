const net = require('net')

/**
 * net.createServer([options][, connectionListener])
 * 创建一个 TCP 服务器。参数 connectionListener 自动给 'connection' 事件创建监听器。返回 'net.Socket'。
 */

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    // 解析请求
    let request = data.toString()
    let [requestLine, ...headerRows] = request.split('\r\n')
    let [method, url] = requestLine.split(' ')
    let headers = headerRows.slice(0, -2).reduce((memo, row) => {
      let [key, value] = row.split(': ')
      memo[key] = value
      return memo
    }, {})

    // 构建响应头
    let rows = []
    rows.push(`HTTP/1.1 200 OK`)
    rows.push(`Content-Type: text/palin`)
    rows.push(`Data: ${new Date().toGMTString()}`)
    rows.push(`Connection: keep-alive`)
    rows.push(`Transfer-Encoding: chunked`)

    // 假设返回了get
    let body = 'get'
    // 返回这个字符串的字节长度
    rows.push(`Content-Length: ${Buffer.byteLength(body)}`)

    // 构建响应体
    /**
     * 响应体
     *
     * 3
     * get
     * 0
     *
     * 0表示结束
     */
    rows.push(`\r\n${Buffer.byteLength(body.toString(16))}\r\n${body}\r\n0`)

    let response = rows.join('\r\n')
    socket.end(response)
  })
})

server.listen(8080)
