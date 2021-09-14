import ts from 'rollup-plugin-typescript2'
import serve from 'rollup-plugin-serve'
import repalce from '@rollup/plugin-replace'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import path from 'path'

export default {
  input: './src/index.ts',
  output: {
    name: 'VueReactivity', // 全局变量名 window.VueReactivity
    format: 'umd',
    file: path.resolve('dist/vue.js'),
    sourcemap: true // 生成映射文件，如果不配置，就无法调试对应的源码文件，而调试的是dist下的打包后的文件
  },
  plugins: [
    ts({
      tsconfig: path.resolve(__dirname, 'tsconfig.json')
    }),
    nodeResolve({
      extensions: ['.js', '.ts']
    }),
    repalce({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    serve({
      open: true,
      openPage: '/public/index.html',
      port: 3000,
      contentBase: ''
    })
  ]
}
