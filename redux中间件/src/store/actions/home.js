/**
 * 使用了 redux，逻辑就放在 actions 中
 *
 * 这里是 Home 组件的 actions 逻辑
 *
 */

// connected-react-router 库 连接 redux仓库 和 路由
import { push } from 'connected-react-router'

export default {
  goto(path) {
    return push(path)
  }
}
