const Controller = require('egg').Controller

const fs = require('mz/fs')
const sendToWormhole = require('stream-wormhole')

class UploaderController extends Controller {
  // 通过 file 模式 上传
  async uploadByFile() {
    const { ctx } = this
    const file = ctx.request.files[0]
    const name = 'egg-multipart-test/' + path.basename(file.filename)
    let result
    try {
      // 处理文件，比如上传到云端
      result = await ctx.oss.put(name, file.filepath)
    } catch (error) {
      console.log(error)
    } finally {
      // 需要删除临时文件
      await fs.unlink(file.filepath)
    }

    ctx.body = {
      url: result.url,
      // 获取所有的字段值
      requestBody: ctx.request.body
    }
  }

  // 通过 stream 模式 上传
  uploadByStream() {
    const { ctx } = this
    const stream = await ctx.getFileStream()
    const name = 'egg-multipart-test/' + path.basename(stream.filename)
    // 文件处理，上传到云存储等等
    let result
    try {
      result = await ctx.oss.put(name, stream)
    } catch (err) {
      // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
      await sendToWormhole(stream)
      throw err
    }

    ctx.body = {
      url: result.url,
      // 所有表单字段都能通过 `stream.fields` 获取到
      fields: stream.fields
    }
  }
}

module.exports = UploaderController
