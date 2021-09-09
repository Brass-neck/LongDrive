// import A from './A'
// import B from './B'
// import C from './C'

/**
 * 打包结果：
 * A为1.js
 * B为2.js
 * C为3.js
 *
 * 特征：
 * 按照引用顺序，chunkIds: 'natural'
 */

/****************************************** */
/****************************************** */

// import B from './B'
// import C from './C'

/**
 * 打包结果：
 * B为1.js
 * C为2.js
 *
 * 虽然B、C内容没变，但是打包结果却变化了，这不合理
 * 所以使用 chunkIds: 'deterministic'，根据文件名称 生成 打包文件名称
 */
