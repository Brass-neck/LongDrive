const { Controller } = require('egg')
const svgCaptcha = require('svg-captcha')

class IndexController extends Controller {
  // 获取验证码
  async getCaptcha() {
    const { ctx } = this
    let captcha = svgCaptcha.create({})
    // 把用户的 验证码 放进 session 里
    ctx.session.captcha = captcha.text

    ctx.set('Content-Type', 'image/svg+xml')
    ctx.body = captcha.data
  }

  // 核对验证码
  async checkCaptcha() {
    const { ctx } = this
    const { captcha } = ctx.request.body
    if (captcha === ctx.session.captcha) {
      ctx.body = { code: 0, data: '验证成功' }
    } else {
      ctx.body = { code: 1, data: '验证失败' }
    }
  }
}

module.exports = IndexController
