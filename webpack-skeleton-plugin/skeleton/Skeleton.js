const { readFileSync } = require('fs')
const { resolve } = require('path')
const puppeteer = require('puppeteer')

const { sleep } = require('./utils.js')

class Skeleton {
  constructor(options) {
    this.options = options
  }
  async initialize() {
    // headless:true 无头浏览器：就是不打开浏览器
    this.browser = await puppeteer.launch({ headless: false })
  }

  async newPage() {
    const { device } = this.options
    let page = await this.browser.newPage()
    // 抓取iphone6的骨架屏，使puppeteer模拟iphone6打开
    await page.emulate(puppeteer.devices[device])
    return page
  }

  async makeSkeleton(page) {
    const { defer = 1000 } = this.options
    // 先读取脚本内容
    let scriptContent = await readFileSync(resolve(__dirname, 'skeletonScript.js'), 'utf8')
    // 通过addScriptTag向页面中插入脚本
    await page.addScriptTag({ content: scriptContent })
    // 等插入的脚本执行完
    await sleep(defer)

    // 在puppeteer的页面中执行方法，无法拿到这个node环境中的变量，需要传进去
    await page.evaluate((options) => {
      window.Skeleton.genSkeleton(options)
    }, this.options)
  }

  async genHTML(url) {
    let page = await this.newPage()
    let response = await page.goto(url, { waitUntil: 'networkidle2' })
    if (response && !response.ok()) {
      throw new Error(`${response.status} on ${url}`)
    }
    // 替换成骨架屏html
    await this.makeSkeleton(page)
    const { html, styles } = await page.evaluate((obj) => {
      return window.Skeleton.genHtmlAndStyle()
    })
    let result = `
    <style>${styles.join('\n')}</style>
    ${html}
    `
    return result
  }

  async destory() {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }
}

module.exports = Skeleton
