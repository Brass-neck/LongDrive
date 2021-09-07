## yarn workspace

yarn 作为包管理器，可以在 package.json 中定义 `workspaces` 字段，让 yarn 以 `monorepo` 的方式管理 packages

```json
// package.json
// 开启workspace模式
{
  "private": true,
  "workspaces": ["packages/*"]
}
```

相比 lerna，yarn 更突出的是对依赖的管理，包括 packages 相互依赖、packages 对第三方的依赖，yarn 会以 semver 约定来分析 dependency，安装依赖时更快、占用体积更小，如果子 project 之间相互依赖，通常需要手动 link，通过使用 workspace，​yarn install​ 会自动的解决安装和 link 问题，**但是欠缺「统一工作流」方面的实现**

由于 yarn workspace 和 lerna 有较多的功能重叠，这里重叠的部分优先使用 workspace 。发布管理使用 learn ，其它使用 workspace

## workspace 的作用

1. 帮助管理多个子 project 的 repo，可以在每个子 project 里使用独立的 package.json 管理依赖，同时不用分别进到每一个子 project 里去 yarn install/upgrade 安装/升级依赖，而是使用一条 yarn 命令去处理所有依赖，就像只有一个 package.json 一样

2. yarn 会根据依赖关系分析所有子 project 的共用依赖，保证所有的 project 公用的依赖只会被下载和安装一次
