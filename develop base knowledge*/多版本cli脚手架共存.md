管理 npm 源，我们使用 `nrm`
管理 node 多版本，我们使用 `nvm`

## 管理多版本 vue-cli 脚手架

### 步骤

1. 不要全局安装 cli 脚手架
2. 在不同的文件夹下，安装不同版本的 cli 脚手架
3. 给不同的文件夹配置不同的环境变量命令

### 实践

1. 新建一个文件夹 `VUE-CLI4`，在当前目录下安装最新的 cli 脚手架，并检查版本

```shell
cd VUE-CLI4

# 初始化包管理
npm init -y

# 安装脚手架
cnpm i @vue/cli

# 查看版本
./node_modules/.bin/vue -V
# @vue/cli 4.5.15
```

2. 配置环境变量

我只想对当前用户生效

```shell
$ touch ~/.bash_profile
$ vim ~/.bash_profile

export VUECLI5=/Users/zhangzhang/workAI/cli5/node_modules/.bin
export PATH=$PATH:$VUECLI5

# 保存退出

# 更新配置
source ~/.bash_profile

# 测试
vue -V
打印出 @vue/cli 4.5.15
```

3. 为了方便使用不同版本，修改 `vue -V` 的命令为 `vue5 -V`，修改 `node_modules/.bin` 下的 `vue` 文件名 为 `vue5`

```shell
cd node_modules/.bin
# 重命名为 vue4
mv vue vue4

# 测试
vue4 -V
```

4. 如果要多版本共存，重复上述步骤，建立多个文件夹，安装不同版本的 cli 脚手架
