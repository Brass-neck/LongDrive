# npm ci 命令

- npm ci 要求必须存在`package-lock.json`或者`npm-shrinkwrap.json`
- 如果 `package-lock.json` 和 `package.json` 冲突，执行 npm ci 会直接报错，而不会更新 lock 文件
- npm ci 永远不会改变 `package-lock.json` 和 `package.json`
- 使用 `package-lock.json` 会**优化依赖安装时间**，因为该文件里存储了每个包的 具体版本和下载链接，不需要再去远程仓库查询，减少大量网络请求

# lockfile

### 为什么单一的 package.json 不能确定唯一的依赖树，而需要将 lockfile 传到仓库中？

- 因为不同版本的 npm 安装依赖的策略和算法不同，**所以需要统一开发者的 npm、node 版本，使用 volta**
- npm install 有可能会根据 `semver-range version` 更新依赖

### volta 使用

- 所有成员全局安装 `npm i -g volta`
- `volta install node@11.0.0`
- `volta install node@latest`
- 在项目中固定 node 版本 `volta pin node@11.0.0`
- 将 volta 配置在 package.json 中，每次在项目目录下使用 node 时，volta 会自动切换版本
  - 通过 volta 安装的包都会被 volta 自动切换版本

```json
// package.json
"volta": {
  "node": "11.0.0",
  "npm": "5.0.0"
}
```

### 要不要提交 lockfile 到仓库？

- 如果开发一个团队应用，建议提交
- 如果开发一个给外部使用的库，可以复用主项目已经加载过的包，减少依赖重复和体积
  - 如果开发的库依赖了一个 精确版本号的模块，建议声明 **peerDependency 同版本依赖**
  - 建议做法：lock 文件提交到 git 仓库，但是 npm publish 发布库的时候，需要 ignore lock file

### 什么时候用 peerDependency ？

- 开发一个插件，插件不能脱离宿主环境单独存在时（比如开发 koa 的插件，就需要声明 peerDependency 中依赖 koa）
- 开发的插件，依赖固定的宿主版本
- peerDependency 可以指定当前包所依赖的其他包的**最低版本范围**，这可以确保使用当前包的应用程序或其他包中已安装的包版本与当前包所依赖的包版本兼容

### 什么时候用 bundledDependency ？

当需要使用 `npm pack` 打包时，声明在 bundledDependency 中的依赖会被打包到 `.tgz` 文件中，前提是，声明在 bundledDependency 中的依赖**必须在** Dependency 中 或 devDependency 中声明过

- 当一个依赖包需要通过外网、很难下载下来、很容易下载出错的时候，可以考虑声明在 bundle 里，通过 pack 的方式安装（例如：node-sass）

### 给项目设置特定的包管理器

```js
"preinstall": "npx only-allow pnpm"
```
