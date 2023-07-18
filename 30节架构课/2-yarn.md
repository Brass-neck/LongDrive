# 一些 yarn 的特殊命令

### node_modules 内容生成过程

依赖的**安装顺序**，会影响 node_modules 中生成的内容

1. 比如，A 依赖 B1,C 依赖 B2，当 A 比 C 先安装
2. 那么扁平化结构的第一层为：A，B1，C，而不是 A，B2，C
3. 整体结构为：A，B1，C（在 C 的 node_modules 下存在 B2）
4. 当 C 比 A 先安装，整体结构为：C，B2，A（在 A 的 node_modules 下存在 B1）
5. 每次 yarn 安装时，yarn 会自己做优化，对一些出现次数较多的共同包，进行 hoist 提升

### yarn import

将现有的依赖项导入到 Yarn 的 `yarn.lock` 文件中

1. 当下载一个项目，只包含`package.json` 文件，就需要用`yarn import`命令，这将扫描 `package.json` 文件中的依赖项，并将它们添加到 `yarn.lock` 文件中

2. 如果下载一个项目只有`yarn.lock`，没有`package.json`，这时候执行 `npm install`，可能会导致安装不同版本依赖，因为 `npm install` 不会使用 `yarn.lock` 文件

### yarn why

```shell
yarn why @babel/core
# 检查为什么会安装 @babel/core
### This module exists because it's specified in "devDependencies".

# 详细列出依赖了 @babel/core 的其他包
- Hoisted from "@react-native#eslint-config#@babel#core"
- Hoisted from "metro-react-native-babel-preset#@babel#core"
- Hoisted from "babel-jest#@jest#transform#@babel#core"
- Hoisted from "@react-native#metro-config#metro-react-native-babel-transformer#@babel#core"
- Hoisted from "jest#@jest#core#jest-config#@babel#core"
```

### yarn pack

用于将一个项目打包成 tarball 文件，文件将命名为 `your-project-name-version.tgz`，当需要部署到服务器的时候，直接将 tgz 文件传输到服务器，然后使用 `yarn install` 命令从 tarball 文件中安装项目，而不必从网络上下载依赖项
