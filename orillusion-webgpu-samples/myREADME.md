# devDependencies

- @webgpu/types
  - 用于开发 gpu 过程中的提示
  - 需要在 `tsconfig.json` 中引用该 types

# 开发重要步骤

1. check webgpu support

   - 检测 `navigator.gpu` 是否存在

2. 获取 adapter
   - adapter 类似于 canvas，是一个代理，不可直接操作 gpu，需要获取 device，正如 canvas 需要获取 context
   - adapter.features
   - adapter.limits
   - 可以指定 `power`，电脑并不一定会按照这个指示去做（会结合电脑有没有插电等等因素）

```js
const adapter = await navigator.gpu.requestAdapter({
  powerPreference: 'high-performance'
})
```

3. 获取 device

```js
const device = await adapter.requestDevice({
  requiredLimits: {
    maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize
  }
})
```

4. 创建 gpu 管线（gpu pipeline）

   - WGSL 后缀文件是 W3C 为 webGPU 定制的一套全新 `shading language`
   - 我们创建渲染管线，只能控制的是 Vertx Shader 和 Fragment Shader 两步
     - Vertx Shader 用于控制顶点数据，通常用于执行变换
     - Fragment Shader 输出每个像素点的颜色
   - 编写 shader 程序

```ts
// 把 wgsl 引用进来，引为纯文本内容
import vertex from './shaders/vertex?raw' // 使用 vite 的 ?raw 语法，因为 import 默认不能导入纯文本

function initPipeline(device: GPUDevice) {
  // 这里给了 device 类型，在这个方法里 device才有提示
  const VertxShader = device.createShaderModule({
    code: vertex
  })
  const fragmentShader = device.createShaderModule({
    code: frag
  })

  const pipeline = await device.createRenderPipelineAync({
    vertex: {
      module: VertxShader,
      entryPoint: 'main' // 指定 shader 文件中的入口函数名称
    },
    fragment: {
      module: fragmentShader,
      entryPoint: 'main'
    }
  })

  return pipeline
}
```

5. 录制 command 队列
   - 提前录制大量操作，一次性交给 Dawn 去操作，减少 js <> Dawn 之间的沟通开销
