# API 路由

- `pages/api` 目录下的任何文件都会映射到 `/api/*`，而不是 page
- 这些文件 只会 增加 **服务端文件包** 的体积，而 不会 增加客户端文件包的大小
- 需要导出一个 默认函数（即 请求处理器）

```js
export default function handler(req, res) {
  if (req.method === 'POST') {
    // Process a POST request
    res.status(200).json({ name: 'John Doe' })
  } else {
    // Handle any other HTTP method
  }
}
```

- API 路由不能与 `next export` 一起使用，因为`next export` 生成的静态 HTML 文件**只包含客户端代码**，而不包含服务器端代码，而 API 路由需要在服务器端运行

## 通过接口实现 ISR 增量静态化功能

```javascript
// pages/api/posts/[id].js

import { getPostData, setPostData } from '../lib/posts'

export default async function handler(req, res) {
  const { id } = req.query

  // 从缓存中获取数据
  const cachedData = await getPostData(id)

  // 如果缓存中有数据，且请求头中包含 If-None-Match，说明客户端已经有了最新的数据，可以直接返回 304 Not Modified 响应
  if (cachedData && req.headers['if-none-match'] === cachedData.etag) {
    return res.status(304).end()
  }

  // 如果缓存中没有数据，或者请求头中不包含 If-None-Match，说明需要重新获取数据
  const postData = await fetch('xxxx/' + id)
  setPostData(`post-${id}`, postData)
}
```
