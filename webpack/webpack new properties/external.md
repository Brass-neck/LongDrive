### 概念

webpack 在打包时经常会用到一个选项`external`，用于将一些第三方包独立出去，不要打包到我们的 bundle 里，从而减小 bundle 包的体积，提升性能，在我们的 library 被上层项目使用后，由 webpack 统一把这个 external 外部依赖加载进来

### 实践

我们创建一个简单的 webpack 项目，入口就是 `src/index.js`，里面引入一个`lodash`，内容如下

```javascript
// src/index.js
const _ = require('lodash')

var s = _.cloneDeep({ a: 1 })
console.log(s)
```

webpack 配置如下

```javascript
// 入口文件
entry: {
  util: './src/index.js',
}

// 输出文件
output: {
  path: './dist',
  filename: '[name].js'
}
```

这样打包出来的`index.js`里会把`lodash`的完整源码注入进去，长达 17000 多行，因为我们的源码中用到了它

```javascript
;(() => {
  var __webpack_modules__ = {
    './node_modules/_lodash@4.17.21@lodash/lodash.js': (module, exports, __webpack_require__) => {
      // 这里是17000行的源码
    }
  }
})()
```

这不是我们希望的结果，因为`lodash`是一个比较通用的库，在多个模块都会被用到，如果每个 bundle 都打包一份`lodash`，那整个项目中会冗余多份，导致“代码爆炸”

所以我们使用`external`声明这种通用模块，告诉 webpack 不要把这些库打包进`bundle`里，而是对于我源码里出现的任何`require('lodash')`或者`import _ from 'lodash'`等语句进行保留，等到真正运行的时候再引入

```javascript
externals: {
  lodash: 'commonjs2 lodash'
}
```

配置了`external`后我们再次打包，发现 bundle 文件的内容只剩下 100 多行  
有一个重要的变化就是，原先引入`lodash`全量源码的地方，只剩下一句保留了`require`或者`import` lodash 的语句，大片的源码不见了

```javascript
;(() => {
  var __webpack_modules__ = {
    lodash: (module) => {
      // 这里保留了require语句，不再是大片的源码
      module.exports = require('lodash')
    }
  }
})()
```

### 提一嘴 umd 打包

如果我们打包为 umd 格式，`external`为了满足不同环境，可能会表现的有所不同，但是本质是一样的，看下打包结果

```javascript
(function webpackUniversalModuleDefinition(root, factory) {
  if(typeof exports === 'object' && typeof module === 'object')

    module.exports = factory(require('lodash'));  // commonjs2

  else if(typeof define === 'function' && define.amd)

    define("util", ['lodash'], factory);  // amd

  else if(typeof exports === 'object')

    exports["util"] = factory(require('lodash'));  // commonjs

  else

    root["util"] = factory(root['lodash']);  // var

}) (window, function(__webpack_external_module_lodash__) {
  return (function(modules) {
    var installedModules = {};
    function webpack_require(moduleId) {
       // ...
    }
    return webpack_require('./src/index.js');
  }) ({
    './src/index.js': generated_util,
  });
}
```
