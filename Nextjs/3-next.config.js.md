# next.config.js 配置细节

- webpack 函数会被**执行两次**，一次是在服务器端，一次是在客户端
- 通过 `isServer` 属性可以区分 客户端 和 服务器端
- `withCss`、`withLess` 让 next 应用支持使用 css 和 less

```js
// 导入 phrase
const {
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER,
  PHASE_DEVELOPMENT_SERVER,
  PHASE_EXPORT
} = require('next/constants')

const withCss = require('@zeit/next-css')
const withLess = require('@zeit/next-less')

// 帮助管理多插件配置的库
const { withPlugins, optional } = require('next-compose-plugins')

let options = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Important: return the modified config
    return config
  }
}

// 让线上项目的 f12 中的 class 类名不再是乱码
// local 是 css 文件中的类名
options.cssLoaderOptions = {
  localIdentName: '[local]___[hash:base64:5]'
}

options = withCss(options)
options = withLess(options)

options = withPlugins(
  [
    // add a plugin with specific configuration
    [
      sass,
      {
        cssModules: true,
        cssLoaderOptions: {
          localIdentName: '[local]___[hash:base64:5]'
        },
        [PHASE_PRODUCTION_BUILD + PHASE_EXPORT]: {
          cssLoaderOptions: {
            localIdentName: '[hash:base64:8]'
          }
        }
      }
    ],

    // add a plugin without a configuration
    images,

    // another plugin with a configuration (applied in all phases except development server)
    [
      typescript,
      {
        typescriptLoaderOptions: {
          transpileOnly: false
        }
      },
      ['!', PHASE_DEVELOPMENT_SERVER]
    ],

    // load and apply a plugin only during development server phase
    [optional(() => require('@some-internal/dev-log')), [PHASE_DEVELOPMENT_SERVER]]
  ],
  options
)

module.exports = options
```

# phase 解析

在 Next.js 中，`phase` 是指页面渲染的不同阶段。Next.js 的渲染过程分为三个阶段：`pre-rendering`、`server-side rendering` 和 `client-side rendering`。每个阶段都有不同的特点和用途

1. `pre-rendering` 阶段：在构建时生成静态 HTML 文件，用于提高页面的加载速度和 SEO。

2. `server-side rendering` 阶段：在服务器上动态生成 HTML，用于提供更好的用户体验和更高的可访问性。

3. `client-side rendering` 阶段：在客户端上使用 JavaScript 动态生成 HTML，用于提供更好的交互性和动态性。

在每个阶段，Next.js 都会执行不同的任务和操作，以确保页面能够正确地渲染和呈现。例如，在 `pre-rendering` 阶段，Next.js 会生成静态 HTML 文件，并将这些文件保存在磁盘上，以便在后续的请求中快速加载。

在 `server-side rendering` 阶段，Next.js 会在服务器上动态生成 HTML，并将其发送给客户端。

在 `client-side rendering` 阶段，Next.js 会在客户端上使用 JavaScript 动态生成 HTML，并将其插入到页面中。

`phase` 是一个 Next.js 内部的概念，用于表示当前页面渲染的阶段。在页面组件中，可以使用 `getInitialProps` 方法来获取当前页面渲染的阶段。例如：

```javascript
import React from 'react'

function MyPage({ phase }) {
  return (
    <div>
      <h1>Hello, Next.js!</h1>
      <p>Current phase: {phase}</p>
    </div>
  )
}

MyPage.getInitialProps = async ({ req }) => {
  const phase = req ? 'server' : 'client'
  return { phase }
}

export default MyPage
```

在 `getInitialProps` 方法中，可以通过检查 `req` 参数是否存在来确定当前页面渲染的阶段。如果 `req` 存在，则表示当前页面正在进行 `server-side rendering` 阶段，否则表示当前页面正在进行 `client-side rendering` 阶段。
