'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app
  router.get('/', controller.home.index)

  router.resources('user', '/api/user', controller.user)

  // 验证码生成与验证
  router.get('/api/captcha', controller.index.getCaptcha)
  router.post('/api/captcha', controller.index.checkCaptcha)
}
