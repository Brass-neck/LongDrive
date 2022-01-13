# roadhog

antd 使用 dva，dva 使用 umi，umi 使用 roadhog

```
npm i -g roadhog
```

### 配置 webpack

使用 react-create-app 脚手架时，不方便配置 webapck，可以通过 readhog 的`.webpackrc`文件进行配置

### mock

通过 readhog 的 `.roadhog.mock.js` 文件进行 mock 数据

# YAML

YAML 是专门用来写配置文件的，比 JSON 强大、方便

### 基本规则

- 大小写敏感
- 使用缩进表示层级关系，缩进只能使用空格，不能使用 tab；缩进空格数量没关系，只要相同层级的元素左对齐
- 井号表示注释

### 支持的数据结构

- 对象
  使用冒号表示一组键值对

  ```yaml
  map:
    key1: value1
    block:
      blockItem1: 1
      blockItem2: 2
  #
  # 转为js：
  # map: { key1: value1, block: { blockItem1:1, blockItem2: 2 } }
  ```

- 数组
  使用 - 开头，构成一个数组

  ```yaml
  names:
    - first
    - second
    - third
  #
  # 转为js：
  # names: ['first', 'second', 'third']
  ```

- 纯量
