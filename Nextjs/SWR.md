# SWR

```js
// api
const { data, error, isLoading, isValidating, mutate } = useSWR(key, fetcher, options)

// fetcher:（可选）一个请求数据的 Promise 返回函数
// options:（可选）该 SWR hook 的配置对象
```

```js
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())
```
