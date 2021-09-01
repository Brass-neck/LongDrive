// 增加一个全局变量Skeleton
window.Skeleton = (function () {
  const $$ = document.querySelectorAll.bind(document)

  const REMOVE_TAGS = ['title', 'meta', 'script', 'style', 'head']

  // 类名前缀
  const CLASS_NAME_PREFIX = 'skeleton-'

  // 添加样式 ，通过缓存提升性能
  const styleCache = new Map()
  function addStyle(selector, rule) {
    if (!styleCache.has(selector)) {
      styleCache.set(selector, rule)
    }
  }

  function pHandler(item, options = {}) {
    const className = CLASS_NAME_PREFIX + 'p'
    const rule = `{
      color: transparent !important;
      background: ${options.color};
      box-shadow: none !important;
      border: none !important;
      animation: gradientBG 2s ease infinite
    }`
    item.classList.add(className)
    addStyle(`.${className}`, rule)
  }

  function buttonHandler(item, options = {}) {
    const className = CLASS_NAME_PREFIX + 'button'
    const rule = `{
      color: transparent !important;
      background: ${options.color};
      border: none !important;
      box-shadow: none !important;
      animation: gradientBG 2s ease infinite
    }`
    // dom.classList 是 DOMTokenList，有add、remove、toggle、replace等方法
    item.classList.add(className)
    // 添加样式
    addStyle(`.${className}`, rule)
  }

  function imgHandler(item, options = {}) {
    const className = CLASS_NAME_PREFIX + 'image'
    const rule = `{
      background: ${options.color} !important;
    }`
    item.classList.add(className)
    addStyle(`.${className}`, rule)

    const { width, height } = item.getBoundingClientRect()
    const attrs = {
      width,
      height,
      src: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fphoto.16pic.com%2F00%2F20%2F02%2F16pic_2002642_b.jpg&refer=http%3A%2F%2Fphoto.16pic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1632994847&t=60a24cefbb4e6042069bece1907324c4'
    }
    Object.keys(attrs).forEach((key) => item.setAttribute(key, attrs[key]))
  }

  // 转换原始元素为骨架屏原元素
  function genSkeleton(options) {
    // 遍历整个dom树，根据元素类型进行转换
    let rootElement = document.documentElement
    ;(function traverse(options) {
      let { button, image, p } = options
      const buttons = [] // 所有的按钮
      const images = [] // 所有的图片
      const ps = [] // 所有p

      ;(function preTraverse(element) {
        if (element.children && element.children.length) {
          Array.from(element.children).forEach((child) => preTraverse(child))
        } else {
          if (element.tagName == 'BUTTON') {
            buttons.push(element)
          } else if (element.tagName == 'IMG') {
            images.push(element)
          } else if (element.tagName == 'P') {
            ps.push(element)
          }
        }
      })(rootElement)
      buttons.forEach((item) => buttonHandler(item, button))
      images.forEach((item) => imgHandler(item, image))
      ps.forEach((item) => pHandler(item, p))
    })(options)

    // 把生成的style和rule放到页面中
    addStyle(
      '@keyframes gradientBG',
      `{ 0% { background: #EFEFEF; } 50% { background: #ccc; } 100% { background: #EFEFEF; }}`
    )

    let rules = ''
    for (const [selector, rule] of styleCache) {
      rules += `${selector} ${rule} \n`
    }
    const styleElement = document.createElement('style')
    styleElement.innerHTML = rules
    document.head.appendChild(styleElement)
  }

  // 获得骨架屏DOM元素html字符串和样式style
  function genHtmlAndStyle() {
    const styles = Array.from($$('style')).map((style) => style.innerHTML || style.innerText)
    Array.from($$(REMOVE_TAGS.join(','))).forEach((element) =>
      element.parentNode.removeChild(element)
    )
    // const html = document.getElementById('root').innerHTML
    const html = document.documentElement.innerHTML

    return { styles, html }
  }

  return {
    genSkeleton,
    genHtmlAndStyle
  }
})()
