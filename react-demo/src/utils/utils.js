/**
 *
 * @param {Array} data - 要转换的源数据
 * @param {string} key - 根据key来分组数据，可以通过 . 串行取值
 * @returns
 */
export const groupBy = (data, key) => {
  let len = data.length
  if (len === 0) return {}

  let res = {}
  if (typeof key === 'string') {
    let path = key.split('.'),
      pathLen = path.length

    for (let i = 0; i < len; i++) {
      let resKey = data[i]
      for (let j = 0; j < pathLen; j++) {
        resKey = resKey[path[j]]
      }
      if (res[resKey] == undefined) res[resKey] = []
      res[resKey].push(data[i])
    }
  } else {
    console.error('groupBy工具函数第二个参数必须为 string 类型')
  }
  return res
}
