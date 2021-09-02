**~~死记硬背篇~~**

![headImg](https://img-blog.csdnimg.cn/20190110153341989.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODE4NDc0MQ==,size_16,color_FFFFFF,t_70)

### webpack5 新特性

1. 持久化缓存（重要）

   - webpack 会缓存生成的 webpack 模块和 chunk，来改善构建速度
   - 缓存在 w5 中默认开启，缓存默认是在内存里，但可以通过 <font face="楷体" size = 3 color = red > cache </font> 字段设置
   - webpack 追踪了每个模块的依赖，并创建了文件系统快照。此快照会与真实文件系统进行比较，当检测到差异时，将会触发对应模块的重新构建，如果没有变化，就使用缓存
   - 首次 npm run build 后形成缓存，后续 build 会很快

2. 资源模块

   - 允许使用资源文件（字体、图标等）而无需配置额外的 loader（之前需要配置 file-loader、url-loader、raw-loader 等）

3. moduleIds & chunkIds 优化

   - module：每个文件是一个 module
   - chunk：打包最终生成的代码块，一个文件对应一个 chunk
   - chunk 代码块名称的生成规则 deterministic，根据文件的路径和文件名生成 hash 值，有助于长期缓存，取代之前根据 natural 生成的 1.js、2.js
   - 开发环境默认是 named；生产环境默认是 deterministic

   <br>

   | Key           | Value                          | Eg         |
   | ------------- | ------------------------------ | ---------- |
   | natural       | 按引用顺序的数字               | 1.js，2.js |
   | deterministic | 根据模块名称生成的简短 hash 值 | 803.js     |
   | named         | 包含文件路径的名称             | src_A.js   |
   | :--------:    | -------------:                 |

<br>

4. 新版 tree shaking（重要）

5. nodeJs 的 polyfill 脚本被移除

   - 如果使用内置的 nodejs 模块，webpack4 默认会引入 polyfill，webpack5 不会，需要手动配置 resolve 属性
   - webpack 作者是写后端的，一开始把 node 的 polyfill 都包含进来了，后来发现 webpack 多数被用于打包前端项目，用不到 node polyfill，所以剔除

6. 联邦模块（重要）

7. URIs

   - experiments
   - w5 支持在请求中处理协议
   - 支持 data 支持 base64 或原始编码，**MimeType** 可以在 **module.rule** 中被映射到加载器和模块类型

   <br>

   ```javacript
   import data from 'data:text/javascript, export default 'titile''

   console.log(title)
   ```

8. 启动命令变化
   - webpack-dev-server 改为 webpack serve

### 安装依赖

```
npm i webpack webpack-cli webpack-dev-server html-webpack-plugin babel-loader @babel/core @babel/preset-env @babel/preset-react style-loader css-loader -D

npm i react react-dom --save
```
