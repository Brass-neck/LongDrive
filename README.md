# LongDrive

学习贯穿整条生命线 Start A LongDrive!

This project is used to record some new & interesting knowledge.

# 💊

有朋友反馈，我的 github 文章中的图片加载不出来，经过查阅了解的资料，综合起来，出现这样的情况，是因为**我们使用一个错误的域名访问了某个节点的 https 资源导致的**，可能原因如下：

1. dns 污染
2. host 设置错误
3. 官方更新了 dns，但是 dns 缓存没有被更新，导致错误解析

解决方案：

1. 打开图片加载不出来的 github 文章，打开 F12 - Network 面板，刷新页面，查看图片请求，获取到图片的来源的域名，即 `request URL`，我这里拿到的是 https://raw.githubusercontent.com

2. 打开一个域名解析网站，https://ping.eu/nslookup 和 https://www.ipaddress.com/ 都可以，解析https://raw.githubusercontent.com，获取图片域名对应的 ip 地址

3. 修改我们电脑的 host，添加 https://raw.githubusercontent.com 和第二步得到的 ip 映射关系，比如，

```
185.199.108.133 raw.githubusercontent.com
185.199.110.133 raw.githubusercontent.com
185.199.109.133 raw.githubusercontent.com
185.199.111.133 raw.githubusercontent.com
```

以上 ip 是 github 当前使用的最新的 ip 地址，可能之后还会发生变更，如果遇到图片不能显示了，大家可依据上述方法及时更新 ip 配置 host 文件即可
