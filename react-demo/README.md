# 简介

一个 react + hooks + antd 技术栈的类后台管理系统

# Key Points Record

### CSS Modules

CSS Modules 简称局部样式，可以保证局部样式不污染全局样式，同时组件也会引入全局样式

使用方法：

1. 局部样式文件以 `.module.css`结尾，比如 app.module.css
2. 全局样式文件不要以 `.module.css`结尾
3. 引入样式

```javascript
// 引入全局样式
import 'xxx/common.css'

// 引入局部样式
import styles from './xxx.module.css'

return (
  <div className={styles.wrapper}>
    // 如果className带中划线，用['className']代替
    <button className={`btn ${styles['my-btn']}`}>save</button>
  </div>
)
```

<hr>

### src/setupProxy.js

通过`http-proxy-middleware`插件配置代理，解决跨域问题

<hr>

### json-server 模拟接口

```json
# 全局安装
npm i json-server -g

# 创建 db.json 文件
{
  "posts": [
    { "id": 1, "title": "json-server", "author": "typicode" }
  ],
  "comments": [
    { "id": 1, "body": "some comment", "postId": 1 }
  ],
  "profile": { "name": "typicode" }
}

postId: 1 表示该 comment 是与 id=1的post关联的，删除了id=1的post数据，comment里postId=1的数据也会删除


# 开启服务
json-server --watch db.json --port 8888

# 使用接口
GET    /posts
GET    /posts/1
GET    /posts?id=1&title=json-server

POST   /posts

### put更新，修改title，会导致丢失 author
PUT    /posts/1
axios.patch('/posts/1', {
  title: 'new title'
})

### patch补丁更新，只会修改title，不会导致丢失 author
PATCH  /posts/1
axios.patch('/posts/1', {
  title: 'new title'
})

DELETE /posts/1

# 关联查询

### _embed=字段名
axios.get('/posts?_embed=comments')

### _expand=字段名
axios.get('/comments?_expand=post')
```

<hr>

### 受控组件/非受控组件

一个优秀的组件，应该是既支持受控，也支持非受控

比如下面取自`antd`的`Menu`组件，其中，定义带有`default`前缀的属性就是非受控组件，这个属性只会在初始化时起作用一次，后续**不会**随着传入的值的变化而变化（非受控）；不带`default`前缀的属性，**会**随着传入的值变化而变化（受控）

```jsx
<Menu
  defaultSelectedKeys={selectedKey}
  selectedKeys={currentselectedKey}
  defaultOpenKeys={openKey}
  openKeys={currentOpenKey}
></Menu>
```

<hr>

### 权限控制

侧边栏显示的菜单有两个决定因素：

1. 后端数据根据`权限列表`返回（权限列表 - 配置开关、删除权限，会影响菜单显示）
2. 当前登录用户的`所属角色`拥有的权限（角色列表 - 角色是一系列权限的集合 - 不同角色拥有不同权限会影响菜单显示 - 用户列表中配置角色）
