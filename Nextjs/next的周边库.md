# Use MDX with Next.js

1. MDX 将 markdown 和 JSX 语法混合在一起并完美地融入基于 JSX 的项目当中
2. 超级超级快： MDX 没有运行时，所有的编译都发生在 构建阶段

```shell
npm install @next/mdx @mdx-js/loader @mdx-js/react
```

```js
// next.config.js
const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)$/,
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    // 使用 `remark-gfm` 作为 `@next/mdx` 的 `remarkPlugins`
    remarkPlugins: [],
    rehypePlugins: []
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  }
})

let options = {}

module.exports = withMDX(options)
```

在 `@next/mdx` 中，`remarkPlugins` 和 `rehypePlugins` 都是用于解析和转换 Markdown 的插件。

`remarkPlugins` 是用于解析 Markdown 的插件，它们会将 Markdown 转换为抽象语法树（AST），然后再将 AST 转换为 React 组件。例如，`remark-gfm` 就是一个 `remarkPlugin`，它可以解析 GitHub Flavored Markdown（GFM）的语法。

`rehypePlugins` 是用于转换 Markdown 渲染后的 HTML 的插件，它们会将 HTML 转换为抽象语法树（AST），然后再将 AST 转换为 React 组件。例如，`rehype-highlight` 就是一个 `rehypePlugin`，它可以将代码块渲染为带有语法高亮的 HTML。

在 `@next/mdx` 中，你可以使用 `remarkPlugins` 和 `rehypePlugins` 来自定义 Markdown 的解析和转换过程。例如，你可以使用 `remarkPlugins` 来支持 GFM 语法，使用 `rehypePlugins` 来添加语法高亮。例如：

```jsx
import { MDXProvider } from '@next/mdx'
import { remarkGfm } from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

const components = {
  // 定义你的组件
}

const MyComponent = ({ mdxSource }) => {
  return (
    <MDXProvider
      components={components}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
    >
      <MDXContent>{mdxSource}</MDXContent>
    </MDXProvider>
  )
}
```

在这个例子中，我们使用 `remark-gfm` 作为 `remarkPlugins`，这样就可以支持 GFM 语法了。同时，我们使用 `rehype-highlight` 作为 `rehypePlugins`，这样就可以添加语法高亮了。

# SEO 优化

Open Graph Protocol（开放图谱协议），简称 OG 协议或 OGP。它是 Facebook 在 2010 年 F8 开发者大会公布的一种网页元信息（Meta Information）标记协议，属于 Meta Tag （Meta 标签）的范畴，是一种为社交分享而生的 Meta 标签

```shell
npm install next-seo
```

```js
import Head from 'next/head'
import { SEO, OpenGraph } from 'next-seo'

const Home = () => {
  return (
    <div>
      <Head>
        <title>My Next.js App</title>
      </Head>
      <SEO
        title='My Next.js App'
        description="This is my Next.js app, it's awesome!"
        openGraph={{
          title: 'My Next.js App',
          description: "This is my Next.js app, it's awesome!",
          url: 'https://mynextjsapp.com',
          images: [
            {
              url: 'https://mynextjsapp.com/og-image.jpg',
              alt: 'My Next.js App'
            }
          ],
          site_name: 'My Next.js App'
        }}
      />
      <OpenGraph
        type='website'
        locale='en_IE'
        url='https://mynextjsapp.com'
        title='My Next.js App'
        description='This is my Next.js app'
        site_name='My Next.js App'
      />
      <p>Welcome to my Next.js app!</p>
    </div>
  )
}

export default Home
```
