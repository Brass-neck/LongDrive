# http

### 发展历程

1. 1990 年，http 0.9 ，只有 get 请求，只支持纯文本

2. 1996 年，http 1.0 ，引入 http header；增加了响应状态码、POST、HEAD 等请求方法；传输的数据不局限于文本

3. 1999 年，http 1.1 ，正式标准，允许持久连接；允许数据分块；增加了缓存管理（304）；增加了 PUT、DELETE 新方法

   - 存在问题 1：1.1 的长连接（connection:keep-alive），虽然可以复用 tcp 通道，但必须是**一次请求应答之后才能复用**，不能在一个 tcp 通道中同时并发多个请求，即使并发多个，也是一个一个依次处理。造成 http 队头阻塞问题

   - 存在问题 2：请求头不可压缩，只可压缩请求体

   - 存在问题 3：请求头是明文字符串，体积大

4. 2015 年，http 2.0 ，使用 HPACK 算法 压缩头部；允许服务器主动向客户端推送数据；二进制协议代替 1.1 的明文字符串，性能更高；多路复用，一个 tcp 连接处理多个请求（解决了 http 队头阻塞，但是没有解决 tcp 的队头阻塞）

   - HTTP/2 引入二进制数据帧和流的概念，其中帧对数据进行顺序标识，这样浏览器收到数据之后，就可以按照序列对数据进行合并，而不会出现合并后数据错乱的情况。同样是因为有了序列，服务器就可以并行的传输数据

   - 每一个 TCP 连接中承载了多个双向流通的流，每一个流都有一个独一无二的标识和优先级，而流就是由二进制帧组成的。二进制帧的头部信息会标识自己属于哪一个流，所以这些帧是可以交错传输，然后在接收端通过帧头的信息组装成完整的数据。这样就解决了线头阻塞的问题，同时也提高了网络速度的利用率

5. 2018 年，http 3.0 ，基于 udp + QUIC 协议，所以就解决了 tcp 的队头阻塞，同时，由于 udp 是不可靠的，所以在上层加了一层 QUIC 协议

# 问题补充

1. 以 chrome 为例，每个域名同时最多允许 6 个 tcp 连接存在，解决方案：域名分片，但是域名不宜过多，域名过多，会导致 dns 解析过多

2. Etag 指纹使用 md5 摘要，通过结果无法反推原内容，但是如果文件过大，生成 md5 指纹非常耗性能。所以经常生成一个**弱指纹**，就是使用 `last-modified + 文件长度` 成为一个指纹
