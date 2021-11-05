# 简介

一个 `react + hooks + antd` 技术栈的类后台管理系统

本项目使用 `json-server` 模拟后台数据，执行以下命令，起后台服务

```
yarn global add json-server

cd server

json-server --watch db.json --port 8080

```

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

<hr>

### forwardRef

- 引用传递（Ref forwading）是一种通过组件向子组件自动传递 **引用 ref** 的技术，说白了，就是可以让父组件获取到子组件中定义了 ref 属性的元素

- 用法：将函数子组件用`forwardRef`包起来，得到一个具有`ref参数`的高阶组件，父组件传递该参数的 ref 引用，子组件拿到参数绑定到自己的元素上

```jsx
import React, { useRef, useEffect, forwardRef } from 'react'

const Child = forwardRef((props, ref) => <Input type='text' ref={ref} />)

const Parent = () => {
  const container = useRef(null)

  useEffect(() => {
    // useRef获取到的容器中，current属性指向被引用的DOM元素
    container.current.focus()
  }, [])
  return <Child ref={container}></Child>
}
```

<hr>

### 路由问题

如果把路由写死到前端，即使左侧导航没有相关权限的目录，用户也可以在浏览器输入栏直接输入存在的路由进入页面，所以我们需要动态生成路由，而不是写死

1. 前端写一份 map 表，key=路由路径，value=页面要加载的组件
2. 异步获取后端路由列表，循环这个列表，加上**权限判断**，**动态**生成`Route`组件，配合刚才的 map 表，设置路由要加载的组件（一般需要 `exact` 模式）
3. 权限判断：① 权限列表中页面权限是否打开 ② 该登录用户的权限中是否包含

```jsx
// 在前端文件中写死所有路由，错误做法
<Switch>
  <Route path='/home' component={Home}></Route>
  // ...
</Switch>
```

<hr>

### React Context(上下文)

1. Context
   Context 通过组件树提供了一个传递数据的方法，从而避免了在**组件嵌套层级较深**的时候，手动一层一层的传递 props 属性

2. API

- 祖先组件创建上下文 `Context`并导出，给后代使用`Consumer`，自己使用`Provider`包裹后代组件
- 后代`import`导入祖先导出的`Context`中的`Consumer`进行使用

```jsx
// 在祖先组件创建一个上下文的容器(组件), defaultValue可以设置共享的默认数据
export const { Provider, Consumer } = React.createContext(defaultValue)
export default function Ancestor() {
  let name = '来自祖先的name'
  return (
    <Provider value={name}>
      <Son />
    </Provider>
  )
}

// Son组件引用Consumer消费
import { Consumer } from './Ancestor.js' //引入祖先的Consumer容器
function Son(props) {
  return (
    <Consumer>
      {(name) => {
        <p>子组件  获取父组件的值:{name}</p>
        <Grandson />
      }}
    </Consumer>
  )
}

// Grandson组件引用Consumer消费
import { Consumer } from './Ancestor.js' //引入祖先的Consumer容器
function Grandson(props) {
  return (
    <Consumer>
      {(name) => {
        <p>后代组件  获取祖先的值:{name}</p>
      }}
    </Consumer>
  )
}
```

3. useContext hook

- 使用 hook，后代不需要用`Consumer`包裹，可以直接取出祖先传递的值

```jsx
import React, { useContext } from 'react'

const App = () => {
  const AppContext = React.createContext(null)

  const A = () => {
    const { name } = useContext(AppContext)
    return <p>{name}</p>
  }

  return (
    <AppContext.Provider value={{ name: 'zz' }}>
      <A />
    </AppContext.Provider>
  )
}
```
