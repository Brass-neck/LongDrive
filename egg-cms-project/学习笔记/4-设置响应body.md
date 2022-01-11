服务器的响应内容放在 `body` 中返回，同时需要有配套的 `Content-Type` 告知客户端如何对数据进行解析

### 返回 JSON 字符串数据

作为一个 RESTful 的 API 接口 controller，我们通常会返回 Content-Type 为 `application/json` 格式的 body，内容是一个 JSON 字符串

```js
class DataController extends Controller {
  async data() {
    this.ctx.body = {
      name: 'egg',
      category: 'framework',
      language: 'Node.js'
    }
  }
}
```

<hr>

### 返回 html 页面

作为一个 html 页面的 controller，我们通常会返回 Content-Type 为 `text/html` 格式的 body，内容是 html 代码段

```js
class ShowController extends Controller {
  async show() {
    this.ctx.body = `<html><h1>Hello</h1></html>`
  }
}
```

<hr>

### 返回 流

由于 Node.js 的**流式特性**，我们还有很多场景需要通过 Stream 返回响应，例如返回一个大文件，代理服务器直接返回上游的内容，框架也支持直接将 body 设置成一个 Stream，并会同时处理好这个 Stream 上的错误事件

```js
class StreamController extends Controller {
  async proxy() {
    const { ctx } = this
    const res = await ctx.curl(url, {
      streaming: true
    })

    ctx.set(result.header)
    // res.res 是一个 stream
    ctx.body = res.res
  }
}
```

<hr>

### 模板渲染

通常来说，我们不会手写 HTML 页面，而是会通过模板引擎进行生成，通过接入的模板引擎，可以直接使用 `ctx.render(template)` 来渲染模板生成 html

```js
class HomeController extends Controller {
  async index() {
    const ctx = this.ctx
    await ctx.render('home.tpl', { name: 'egg' })
    // ctx.body = await ctx.renderString('hi, {{ name }}', { name: 'egg' });
  }
}
```

<hr>

### JSONP

有时我们需要给 非本域 的页面提供接口服务，又由于一些 历史原因 无法通过 CORS 实现，可以通过 JSONP 来进行响应

由于 JSONP 如果使用不当会导致非常多的安全问题，所以框架中提供了便捷的响应 JSONP 格式数据的方法，封装了 JSONP XSS 相关的安全防范，并支持进行 CSRF 校验和 referrer 校验

通过 `app.jsonp()` 提供的中间件来让一个 controller 支持响应 JSONP 格式的数据。在路由中，我们给需要支持 jsonp 的路由加上这个中间件：

```js
// app/router.js
module.exports = (app) => {
  const jsonp = app.jsonp()
  app.get('/api/user', jsonp, app.controller.user.get)
}
```
