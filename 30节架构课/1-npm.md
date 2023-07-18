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

### 使用 nexus

1. 在 linux 通过镜像安装和启动 nexus

```shell
# search 找到 star 最多的
docker search nexus

# 拉取镜像
docker pull sonatype/nexus3

# 创建并运行容器
docker run -d -p 8081:8081 --name nexus sonatype/nexus3

# 如果端口和防火墙已经设置，便可以通过如下命令进行测试
curl http://127.0.0.1:8081
```

2. 仓库类型

- hosted

  - 定位：本地私有 npm 仓库
  - 创建过程：create repository -> npm(hosted) -> 起名
  - 支持 pull & push

- proxy

  - 定位：远程仓库代理
  - 创建过程：create repository -> npm(proxy) -> 输入名称和代理网址（https://registry.npmjs.org）
  - 只支持 pull

- group

  - 定位：可将 hosted 和 proxy 结合
  - 创建过程：create repository -> npm(group) -> 将 npmjs.org 代理 和 npm-hosted 本地仓库 仓库添加到成员中 -> 可以调整仓库成员顺序，排第一位的是默认的，一般默认从 hosted 取，没有就到 proxy 中取

# LDAP

通过 LDAP 协议，用户可以进行身份认证、目录搜索以及目录数据的增删改等操作。LDAP 在身份验证、用户管理和企业资源管理等方面有着广泛的应用
