# 一、部署到 nodejs 服务器

1. next build，生成的内容默认在 `.next` 文件夹里

2. next start 启动一个 node 服务，指定服务的端口号

   - 可以使用 `pm2` 启动 node 服务
   - 也可以 `npm run build` 之后直接 `nohup npm run start`

3. （可选）使用 nginx 向外暴露服务

```yaml
# 监听普通http请求，重写至https
server {
  listen 80;
  server_name aaa.site, www.aaa.site;
  rewrite ^(.*)$ https://$host$1 permanent;
}

# https 代理到 next 服务
server {
  listen 443 ssl;
  server_name aaa.site, www.aaa.site;

  # 配置证书
  ssl_certificate ...;
  ssl_certificate_key ...;

  # 代理到Next的服务，默认3000端口，也可以在start的时候指定
  location / {
    proxy_pass    http://127.0.0.1:3000/;
  }
}
```

3. （可选）使用 docker 部署

```yaml
# `node:alpine` 是一个 Docker 镜像，它基于 Alpine Linux 发行版，并且预装了 Node.js 运行时环境。由于它是基于 Alpine Linux 的，因此它的大小非常小，非常适合用于容器化应用程序或者嵌入式设备

# Alpine Linux 是一个非常轻量级、安全性增强、易于使用的 Linux 发行版

FROM node:alpine AS deps  # 将这个镜像命名为 deps阶段，后续指令可以使用 deps 引用该基础镜像

RUN apk add --no-cache libc6-compat # 安装 Alpine Linux 环境需要的依赖库 libc6  # --no-cache 不要缓存安装包

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile  # 按照 lock 文件安装依赖

# Rebuild the source code only when needed
FROM node:alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["yarn", "start"]
```

### 上述 dockerfile 中的一些总结

1. `AS` 关键字用于为构建的镜像指定一个命名的阶段（stage）。在 `FROM` 指令中使用 `AS` 关键字可以为基础镜像指定一个名称，以便在后续的指令中引用该阶段。使用 `AS` 关键字可以将 Dockerfile 分成多个阶段，每个阶段都可以使用不同的基础镜像和指令。这样可以使得构建过程更加高效和灵活

2. 用于 CI/CD 环境的依赖安装命令，以确保每次构建使用相同的依赖项版本。会根据 `package-lock.json` 文件中的依赖项版本进行安装，没有 `package-lock.json`会抛出错误

```shell
   yarn install --frozen-lockfile
   npm ci # npm clean install 的缩写，每次会删除 node_modules
```

3.

```shell
# --production 只安装生产环境依赖，即只安装 `dependencies` 字段中的依赖项，而不安装 `devDependencies` 字段中的依赖项

# --ignore-scripts 在安装依赖项时，不执行 `package.json` 文件中的 `scripts` 字段中定义的脚本

# --prefer-offline 在安装依赖项时，尽可能使用本地缓存，如果本地缓存中不存在依赖项，则从远程仓库下载
yarn install --production --ignore-scripts --prefer-offline
```

# 二、导出静态 HTML

```shell
next build && next export
```

# 三、部署到 vercel

在云计算中，术语 "边缘" 功能是指，位于或靠近网络边缘的计算能力，通常更靠近数据源

边缘功能用于在靠近生成位置的地方处理数据，而不是将所有数据发送到集中式云进行处理。这减少了数据传输所需的延迟和带宽，并可以提高基于云的应用程序的效率、可扩展性和安全性

部署在 Vercel 上的无服务器功能在位于世界某个地方的服务器上运行。对函数的请求在服务器上执行。如果请求来自靠近服务器的位置，则速度很快。但是，如果它来自很远的地方，则响应速度较慢

Edge Functions 解决了这个问题。简而言之，Edge Functions 是在**靠近用户的地方运行**的无服务器功能，无论用户身在何处，都能产生快速请求

### 步骤如下：

1. 创建一个新的 Next.js 13 项目

```shell
$ npx create-next-app@latest --experimental-app
```

2. 添加新的 API 路由

   在默认项目结构的 `pages/api` 文件夹中创建一个新文件

```js
import { NextRequest, NextResponse } from 'next/server'

const handler = (req: NextRequest) => {
  return NextResponse.json({
    name: `Hello, from ${req.url} I'm now an Edge Function!`
  })
}

export default handler
```

3. 设置 Edge Runtime

```js
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  runtime: 'edge'
}

const handler = (req: NextRequest) => {
  return NextResponse.json({
    name: `Hello, from ${req.url} I'm now an Edge Function!`
  })
}

export default handler
```

4. 部署到 vercel

首先在 vercel.com 上注册一个免费帐户，以便您能够访问仪表板

```shell
$ npm i -g vercel@latest

# 在 next 项目中执行
$ vercel deploy
# 登录 vercel 账号
```
