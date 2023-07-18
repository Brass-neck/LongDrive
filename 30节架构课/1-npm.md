# 自定义 npm init

```shell
# 设置 npm init 命令查找的文件
npm config set init-module ~\.npm-init.js

# 创建 ~\.npm-init.js 文件
module.exports = {
  name: prompt('package name', basename || package.name),
  version: prompt('version', '0.0.0'),
  decription: prompt('description', ''),
  main: prompt('entry point', 'index.js'),
  repository: prompt('git repository', ''),
  keywords: prompt(function (s) { return s.split(/\s+/) }),
}
```

# 给项目配置 npm 源

通过 `preinstall` 的 npm 钩子，设置 npm 源

```js
// package.json
"scripts":{
  "preinstall": "node ./bin/preinstall.js"
}

// preinstall.js
require('child_process').exec('npm config get registry', function(error, stdout, stderr){
  if (stdout === '原始npm源'){
    // 如果是原始 npm 源，就需要设置成 企业的私有源
    exec('npm config set registry https://registry.npm.taobao.org')
  }
})
```

# 搭建 npm 企业私服

- 工具：nexus、verdaccio、cnpm
