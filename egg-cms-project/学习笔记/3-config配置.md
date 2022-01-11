# config/config.default.js 中的一些配置

### 上传文件的格式

为了保证文件上传的安全，框架限制了支持的的文件格式，框架默认支持白名单如下：

```js
// images
'.jpg', '.jpeg', // image/jpeg
'.png', // image/png, image/x-png
'.gif', // image/gif
'.bmp', // image/bmp
'.wbmp', // image/vnd.wap.wbmp
'.webp',
'.tif',
'.psd',
// text
'.svg',
'.js', '.jsx',
'.json',
'.css', '.less',
'.html', '.htm',
'.xml',
// tar
'.zip',
'.gz', '.tgz', '.gzip',
// video
'.mp3',
'.mp4',
'.avi',
```

可以通过修改`config/config.default.js`配置白名单

```js
// 往白名单中增加项条目
module.exports = {
  multipart: {
    fileExtensions: ['.apk'] // 增加对 apk 扩展名的文件支持
  }
}

// 覆盖整个白名单
module.exports = {
  multipart: {
    whitelist: ['.png'] // 覆盖整个白名单，只允许上传 '.png' 格式
  }
}
```

<hr>

### cookie

```js
module.exports = {
  cookies: {
    // httpOnly: true | false,
    // sameSite: 'none|lax|strict',
  }
}
```

代码中通过 `ctx.cookies.get('count')` 获取 cookie

<hr>

### session

```js
module.exports = {
  key: 'EGG_SESS', // 承载 Session 的 Cookie 键值对名字
  maxAge: 86400000 // Session 的最大有效时间
}
```

代码中通过 `ctx.session 对象` 获取 session 信息，比如`ctx.session.userId 、ctx.session.visited`

<hr>

### 参数校验

```js
exports.validate = {
  enable: true,
  package: 'egg-validate'
}
```

通过 `ctx.validate(rule, [body])` 直接对参数进行校验

当校验异常时，会直接抛出一个异常，异常的状态码为 422，errors 字段包含了详细的验证不通过信息。如果想要自己处理检查的异常，可以通过 `try catch` 来自行捕获。

```js
class PostController extends Controller {
  async create() {
    const { ctx } = this
    try {
      ctx.validate({
        title: { type: 'string' },
        content: { type: 'string' }
      })
    } catch (e) {
      ctx.logger.warn(e.errors)
      ctx.body = { success: false }
      return
    }
  }
}
```

<hr>

### JSONP

默认框架识别 请求 url 中 query 的 `_callback` 为 是否返回 JSONP 格式数据的依据，可以修改

```js
module.jsonp = {
  callback: 'cb', // 识别 query 中的 `cb` 参数，用户请求 /api/posts/1?cb=fn 则触发 jsonp
  limit: 100, // 函数名最长为 100 个字符
  csrf: true, // 开启 csrf 校验。如果发起 JSONP 的请求方所在的页面和我们的服务在同一个主域名之下的话，可以读取到 Cookie 中的 CSRF token
  whiteList: /^https?:\/\/test.com\// //如果在同一个主域之下，可以通过开启 CSRF 的方式来校验 JSONP 请求的来源，而如果想对其他域名的网页提供 JSONP 服务，我们可以通过配置 referrer 白名单的方式来限制 JSONP 的请求方在可控范围之内。
}
```

我们同样可以在 `app.jsonp()` 创建中间件时覆盖默认的配置，以达到不同路由使用不同配置的目的：

```js
module.exports = (app) => {
  const { router, controller, jsonp } = app
  app.get('/api/user', jsonp,({callback: 'cb'}) controller.user.get)
  app.get('/api/role', jsonp,({callback: 'callback'}) controller.role.get)
}
```
