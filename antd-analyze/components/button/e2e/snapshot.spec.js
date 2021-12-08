// 用于服务端渲染的API
import ReactDOMServer from 'react-dom/server'

import Button from '..'

// 快照插件
import { configureToMatchImageSnapshot } from 'jest-image-snapshot'

// 给 expect 扩展 toMatchSnapshot 方法
const toMatchSnapshot = configureToMatchImageSnapshot({
  customerSnapshotsDir: `${process.cwd()}/snapshots`,
  customerDiffDir: `${process.cwd()}/diffSnapshots`
})
expect.extend({ toMatchSnapshot })

describe('测试Button快照', () => {
  it('快照是否正确', async () => {
    await jestPuppeteer.resetPage()
    // file文件协议
    await page.goto(`file://${process.cwd()}/tests/index.html`)

    // 把button组件渲染成字符串
    const buttonHTML = ReactDOMServer.renderToString(<Button>按钮</Button>)

    await page.evaluate((str) => {
      // 这里面可以拿到文档对象
      // 把 button 字符串 放到 root 里
      document.querySelector('#root').innerHTML = str
    }, buttonHTML)

    // 获取一个快照
    const screenShot = await page.screenshot()

    // 使用扩展的方法，对比 新快照 和 老快照
    expect(screenShot).toMatchSnapshot()
  })
})
