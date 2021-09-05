#!/usr/bin/env node

//上面这一句注释是必须的，指定了代码的运行环境

const yargs = require('yargs')
let argv = yargs.argv
console.log(argv)

// const args = process.argv.slice(2)
// if (args[0] == '-v') {
//   console.log('当前版本：1.0.0')
// } else {
//   console.log("命令有误，尝试 'gogo -v' 获取最新版本")
// }
